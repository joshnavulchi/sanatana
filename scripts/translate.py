import json
import os
import sys
import argparse
import copy
import time
import concurrent.futures
from deep_translator import GoogleTranslator
from deep_translator import exceptions as dt_exceptions


def resolve_locales_root(locales_dir_arg: str | None) -> str:
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    default_locales = os.path.join(repo_root, "locales")

    if not locales_dir_arg:
        return default_locales

    # Allow relative paths (relative to repo root)
    if os.path.isabs(locales_dir_arg):
        return locales_dir_arg
    return os.path.abspath(os.path.join(repo_root, locales_dir_arg))


def translate_text(text, target_lang, chunk_size=500):
    """Translate long text by splitting into chunks under 5000 characters."""
    translator = GoogleTranslator(source="en", target=target_lang)
    translated_chunks = []
    for i in range(0, len(text), chunk_size):
        chunk = text[i:i+chunk_size]
        if not chunk or not chunk.strip():
            translated_chunks.append(chunk)
            continue
        try:
            translated_chunks.append(translator.translate(chunk))
        except dt_exceptions.TranslationNotFound:
            # If translator cannot find a translation, keep original chunk and warn
            print(f"⚠️ Translation not found for chunk (len={len(chunk)}). Keeping original chunk.")
            translated_chunks.append(chunk)
        except Exception as e:
            # Generic fallback: keep original text to avoid failing entire run
            print(f"⚠️ Translator error: {e}. Keeping original chunk.")
            translated_chunks.append(chunk)
    return " ".join(translated_chunks)


def translate_json_values(data, target_lang, progress_callback=None, total=1, counter=None):
    """Recursively translates values in a dictionary or list."""
    if counter is None:
        counter = {"done": 0}
    skip_keys = {"url", "link", "links", "@context", "logo", "canonical", "src", "href", "ogimage", "email", "action"}
    def is_skip_key(key):
        key_lower = key.lower()
        if key_lower in skip_keys:
            return True
        if any(k in key_lower for k in ["image", "img", "path", "src", "href", "ogimage", "email", "link"]):
            return True
        return False

    if isinstance(data, dict):
        result = {}
        for k, v in data.items():
            if is_skip_key(k):
                result[k] = v
            else:
                result[k] = translate_json_values(v, target_lang, progress_callback, total, counter)
        return result
    elif isinstance(data, list):
        return [translate_json_values(item, target_lang, progress_callback, total, counter) for item in data]
    elif isinstance(data, str):
        # Skip trivial or non-translatable short strings
        if not data or not data.strip():
            return data
        translated = translate_text(data, target_lang=target_lang)
        counter["done"] += 1
        if progress_callback:
            progress_callback(counter["done"], total)
        return translated
    else:
        return data


def count_strings(data):
    """Count total number of strings in JSON for progress tracking."""
    if isinstance(data, dict):
        return sum(count_strings(v) for v in data.values())
    elif isinstance(data, list):
        return sum(count_strings(item) for item in data)
    elif isinstance(data, str):
        return 1
    else:
        return 0


def _is_skip_key(key):
    skip_keys = {"url", "link", "links", "@context", "logo", "canonical", "src", "href", "ogimage", "email", "action"}
    key_lower = key.lower()
    if key_lower in skip_keys:
        return True
    if any(k in key_lower for k in ["image", "img", "path", "src", "href", "ogimage", "email", "link"]):
        return True
    return False


def _collect_string_paths(data, path=()):
    """Return list of (path_tuple, string) for non-empty strings to translate."""
    out = []
    if isinstance(data, dict):
        for k, v in data.items():
            if _is_skip_key(k):
                continue
            out.extend(_collect_string_paths(v, path + (k,)))
    elif isinstance(data, list):
        for idx, item in enumerate(data):
            out.extend(_collect_string_paths(item, path + (idx,)))
    elif isinstance(data, str):
        if data and data.strip():
            out.append((path, data))
    return out


def _get_by_path(data, path):
    cur = data
    for p in path:
        if cur is None:
            return None
        try:
            cur = cur[p]
        except Exception:
            return None
    return cur


def _set_by_path(data, path, value):
    cur = data
    for p in path[:-1]:
        if isinstance(p, int):
            # ensure list has that index
            while len(cur) <= p:
                cur.append(None)
            if cur[p] is None:
                cur[p] = {}
            cur = cur[p]
        else:
            if p not in cur or cur[p] is None:
                cur[p] = {}
            cur = cur[p]
    last = path[-1]
    if isinstance(last, int):
        while len(cur) <= last:
            cur.append(None)
        cur[last] = value
    else:
        cur[last] = value


def translate_with_batching(source_data, target_lang, existing=None, chunk_size=500, progress_callback=None, workers=1):
    """Translate strings in `source_data` not present in `existing` using batching.

    - `target_lang` is the language code (string) used to build per-worker translators.
    - `workers` controls parallel worker count (ThreadPoolExecutor).

    Returns (translated_data, total_translated_count).
    """
    entries = _collect_string_paths(source_data)

    translated = copy.deepcopy(source_data)
    if existing:
        for path, src_text in entries:
            val = _get_by_path(existing, path)
            # Only reuse existing value when it's non-empty and differs from source
            if isinstance(val, str) and val.strip() and val.strip() != (src_text or "").strip():
                _set_by_path(translated, path, val)

    to_translate = []
    for path, src_text in entries:
        cur = _get_by_path(translated, path)
        # If current translated value exists and differs from source, skip it
        if isinstance(cur, str) and cur.strip() and (not src_text or cur.strip() != src_text.strip()):
            continue
        to_translate.append((path, src_text))

    total_to_translate = len(to_translate)
    if total_to_translate == 0:
        return translated, 0

    text_to_paths = {}
    for path, text in to_translate:
        text_to_paths.setdefault(text, []).append(path)

    unique_texts = list(text_to_paths.keys())

    DELIM = "\n<<<|||DELIM|||>>>\n"
    done = 0

    # Build batches of unique_texts by chunk_size
    batches = []
    i = 0
    while i < len(unique_texts):
        chunk_texts = []
        size = 0
        while i < len(unique_texts):
            t = unique_texts[i]
            add_len = len(t) + len(DELIM)
            if size + add_len > chunk_size and chunk_texts:
                break
            chunk_texts.append(t)
            size += add_len
            i += 1
        if chunk_texts:
            batches.append(chunk_texts)

    def _translate_batch(chunk_texts):
        concatenated = DELIM.join(chunk_texts)
        translator = GoogleTranslator(source="en", target=target_lang)
        try:
            translated_concat = translator.translate(concatenated)
            parts = translated_concat.split(DELIM)
            if len(parts) != len(chunk_texts):
                # if split mismatch, translate individually as fallback
                parts = []
                for t in chunk_texts:
                    try:
                        parts.append(translator.translate(t))
                    except Exception:
                        parts.append(t)
        except Exception:
            parts = []
            for t in chunk_texts:
                try:
                    parts.append(GoogleTranslator(source="en", target=target_lang).translate(t))
                except Exception:
                    parts.append(t)
        return parts

    # Execute batches in parallel (threads) if workers > 1
    if workers and workers > 1:
        with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
            future_to_batch = {executor.submit(_translate_batch, batch): batch for batch in batches}
            for fut in concurrent.futures.as_completed(future_to_batch):
                batch = future_to_batch[fut]
                try:
                    parts = fut.result()
                except Exception:
                    parts = []
                    for t in batch:
                        try:
                            parts.append(GoogleTranslator(source="en", target=target_lang).translate(t))
                        except Exception:
                            parts.append(t)

                for orig, trans in zip(batch, parts):
                    paths = text_to_paths.get(orig, [])
                    for p in paths:
                        _set_by_path(translated, p, trans)
                    done += len(paths)
                    if progress_callback:
                        progress_callback(done, total_to_translate)
    else:
        # Single-threaded loop over batches
        for batch in batches:
            parts = _translate_batch(batch)
            for orig, trans in zip(batch, parts):
                paths = text_to_paths.get(orig, [])
                for p in paths:
                    _set_by_path(translated, p, trans)
                done += len(paths)
                if progress_callback:
                    progress_callback(done, total_to_translate)

    return translated, total_to_translate


def safe_write_json(path, data):
    """Write `data` as JSON to `path` safely.

    - Writes to a temporary file first
    - Validates by loading the temp file
    - Backs up the existing file with a timestamped suffix
    - Atomically replaces the target file
    Returns True on success, False on failure.
    """
    tmp_path = path + ".tmp"
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        # Validate JSON by reloading
        with open(tmp_path, "r", encoding="utf-8") as f:
            json.load(f)

        # Backup existing file
        if os.path.exists(path):
            ts = int(time.time())
            bak_path = f"{path}.bak.{ts}"
            try:
                os.replace(path, bak_path)
            except Exception:
                # If backup fails, attempt to continue but warn
                print(f"⚠️ Warning: failed to create backup for {path}")

        # Atomic replace
        os.replace(tmp_path, path)
        return True
    except Exception as e:
        try:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        except Exception:
            pass
        print(f"⚠️ Failed to write JSON to {path}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Translate locale JSON files")
    parser.add_argument("--non-interactive", action="store_true", help="Run without prompts (all files → all locales)")
    parser.add_argument("--files", help="Comma-separated filenames from locales/en to translate (e.g. donate.json,home.json)")
    parser.add_argument("--locales", help="Comma-separated locale codes to translate into (e.g. es,fr)")
    parser.add_argument("--locales-dir", help="Path to locales directory (default: <repo>/locales)")
    parser.add_argument("--translate-workers", type=int, help="Per-locale batch workers (overrides TRANSLATE_WORKERS env)")
    parser.add_argument("--locale-workers", type=int, help="Parallel locale workers (overrides TRANSLATE_LOCALE_WORKERS env)")
    args = parser.parse_args()

    locales_root = resolve_locales_root(args.locales_dir)
    source_dir = os.path.join(locales_root, "en")

    if not os.path.isdir(source_dir):
        print(f"Locales source directory not found: {source_dir}")
        print("Tip: run from the repo root or pass --locales-dir=./locales")
        sys.exit(1)

    non_interactive = args.non_interactive

    # Show available files in locales/en/
    files = [f for f in os.listdir(source_dir) if f.endswith(".json")]
    if not files:
        print("No JSON files found in locales/en/")
        sys.exit(1)

    print("Available files in locales/en/:")
    for i, f in enumerate(files, 1):
        print(f"{i}. {f}")

    # Ask which file(s) to translate (or run non-interactively)
    if args.files:
        requested = [s.strip() for s in args.files.split(",") if s.strip()]
        # validate against available files
        filenames = [f for f in files if f in requested]
        missing = [r for r in requested if r not in filenames]
        if missing:
            print(f"Warning: requested files not found: {missing}")
    elif non_interactive:
        filenames = files
    else:
        choice = input("Enter the number of the file you want to translate (or 'all' for all files): ").strip()
        if choice.lower() == "all":
            filenames = files
        else:
            try:
                idx = int(choice) - 1
                if idx < 0 or idx >= len(files):
                    raise ValueError()
                filenames = [files[idx]]
            except ValueError:
                print("Invalid selection. Please enter a valid file number or 'all'.")
                sys.exit(1)

    # Determine available locale directories (exclude 'en')
    all_locales = [d for d in os.listdir(locales_root) if os.path.isdir(os.path.join(locales_root, d))]
    available_locales = [lc for lc in all_locales if lc.lower() != "en"]
    if not available_locales:
        print("No other locale folders found to translate into.")
        sys.exit(0)

    # Ask whether to translate into all locales or specific locale(s)
    print("\nTarget locale options:")
    print("1. Translate into ALL locales")
    print("2. Translate into specific locale(s)")
    print("3. Enter a locale folder name directly")

    if non_interactive:
        mode = "1"
    else:
        mode = input("Choose option (1, 2, or 3): ").strip()

    target_locales = []
    if mode == "1":
        target_locales = available_locales
    elif mode == "2":
        # ...existing code for option 2...
        if args.locales:
            requested = [s.strip() for s in args.locales.split(",") if s.strip()]
            for token in requested:
                if token.isdigit():
                    n = int(token) - 1
                    if 0 <= n < len(available_locales):
                        target_locales.append(available_locales[n])
                else:
                    if token in available_locales:
                        target_locales.append(token)
            # dedupe while preserving order
            seen = set()
            target_locales = [x for x in target_locales if not (x in seen or seen.add(x))]
        else:
            print("Available locales:")
            for i, lc in enumerate(available_locales, 1):
                print(f"{i}. {lc}")
            sel = input("Enter locale code(s) or number(s) separated by commas (e.g. 'es' or '2,3'): ").strip()
            if not sel:
                print("No locale selected. Exiting.")
                sys.exit(1)
            choices = [s.strip() for s in sel.split(",") if s.strip()]
            for token in choices:
                if token.isdigit():
                    n = int(token) - 1
                    if 0 <= n < len(available_locales):
                        target_locales.append(available_locales[n])
                    else:
                        print(f"Invalid locale number: {token}")
                        sys.exit(1)
                else:
                    if token in available_locales:
                        target_locales.append(token)
                    else:
                        print(f"Invalid locale code: {token}")
                        sys.exit(1)
            # dedupe while preserving order
            seen = set()
            target_locales = [x for x in target_locales if not (x in seen or seen.add(x))]
    elif mode == "3":
        folder_name = input("Enter the locale folder name: ").strip()
        if not folder_name:
            print("No folder name entered. Exiting.")
            sys.exit(1)
        if not os.path.isdir(os.path.join(locales_root, folder_name)):
            print(f"Locale folder '{folder_name}' does not exist.")
            sys.exit(1)
        target_locales = [folder_name]
    else:
        print("Invalid option. Please choose 1, 2, or 3.")
        sys.exit(1)

    # Iterate selected source file(s) and target locale(s)
    for filename in filenames:
        input_path = os.path.join(source_dir, filename)
        with open(input_path, "r", encoding="utf-8") as infile:
            source_data = json.load(infile)

        # Optionally run per-locale translations in parallel
        try:
            locale_workers_env = os.environ.get("TRANSLATE_LOCALE_WORKERS")
            locale_workers = int(locale_workers_env) if locale_workers_env else min(16, max(1, os.cpu_count() or 1))
        except Exception:
            locale_workers = min(16, max(1, os.cpu_count() or 1))

        print(f"\nStarting translations for {filename} with up to {locale_workers} locale workers...")

        def _translate_one_locale(target_lang):
            target_dir = os.path.join(locales_root, target_lang)
            os.makedirs(target_dir, exist_ok=True)
            output_path = os.path.join(target_dir, filename)

            print(f"\nTranslating {input_path} → {output_path} into {target_lang}")

            def progress_callback(done, total, fname=filename, lang=target_lang):
                percent = (done / total) * 100 if total else 100
                print(f"Progress for {fname} ({lang}): {percent:.2f}% ({done}/{total})", end="\r")

            # Load existing translations if present so we don't re-translate them
            existing_data = None
            if os.path.exists(output_path):
                try:
                    with open(output_path, "r", encoding="utf-8") as ef:
                        existing_data = json.load(ef)
                except Exception:
                    existing_data = None

            # determine batch-workers for this locale
            try:
                workers_env = os.environ.get("TRANSLATE_WORKERS")
                workers = int(workers_env) if workers_env else 16
            except Exception:
                workers = 16

            translated_data, total_translated = translate_with_batching(source_data,
                                                                         target_lang,
                                                                         existing=existing_data,
                                                                         chunk_size=16500,
                                                                         progress_callback=progress_callback,
                                                                         workers=workers)

            if total_translated == 0:
                print(f"\nℹ️ No untranslated strings found for {filename} in {target_lang}. Skipping.")
                return (target_lang, 0)

            ok = safe_write_json(output_path, translated_data)
            if ok:
                print(f"\n✅ Finished translating {filename} into {target_lang}")
            else:
                print(f"\n❌ Failed to save translations for {filename} into {target_lang}; original file preserved.")
            return (target_lang, total_translated)

        # run translations concurrently across locales
        with concurrent.futures.ThreadPoolExecutor(max_workers=locale_workers) as exec:
            futures = {exec.submit(_translate_one_locale, lc): lc for lc in target_locales}
            for fut in concurrent.futures.as_completed(futures):
                lc = futures[fut]
                try:
                    res = fut.result()
                except Exception as e:
                    print(f"\n⚠️ Error translating {filename} for {lc}: {e}")


if __name__ == "__main__":
    main()