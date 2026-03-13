/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import Link from 'next/link';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@lib/i18n';
import localesList from '@lib/localesList.json';

type Lang = { code: string; name?: string; nativeName?: string };

const normalizeLocale = (value?: string | null) => {
  const candidate = String(value || '').trim();
  if (!candidate) return DEFAULT_LOCALE;
  return SUPPORTED_LOCALES.includes(candidate) ? candidate : DEFAULT_LOCALE;
};

export default function LanguageDropdown({
  pathname = '/',
  currentLang,
}: {
  pathname?: string;
  currentLang?: string;
}) {
  const active = normalizeLocale(currentLang);
  const allLanguages = (Array.isArray(localesList) ? localesList : []) as Lang[];

  return (
    <details className="relative">
      <summary className="list-none cursor-pointer inline-flex items-center gap-2 px-3 py-1 hover:shadow-md transition-all duration-300">
        <img src="/images/svg/ml.svg" alt="Language selector" width={24} height={24} />
        <span className="hidden md:inline text-sm">{active}</span>
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-amber-200 bg-white shadow-xl p-2 max-h-96 overflow-y-auto">
        {allLanguages.map((lang) => {
          const isActive = lang.code === active;
          const href = `${pathname}?lang=${encodeURIComponent(lang.code)}`;
          return (
            <Link
              key={lang.code}
              href={href}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-amber-100 font-semibold' : 'hover:bg-amber-50'}`}
            >
              <span>{lang.nativeName || lang.name || lang.code}</span>
              <span className="text-xs text-gray-600">{lang.code}</span>
            </Link>
          );
        })}
      </div>
    </details>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
