function buildDiskPath(...segments: string[]) {
  const cwd = process.cwd().replace(/\\/g, '/').replace(/\/+$/, '');
  const normalized = segments.map((s) => String(s || '').replace(/^\/+|\/+$/g, '')).filter(Boolean);
  return `${cwd}/${normalized.join('/')}`;
}

async function readJsonFile(filePath: string) {
  try {
    const fs = await Promise.resolve().then(() => require('fs')) as typeof import('fs');
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

export async function fetchContentByRouteFromDisk(loc: string, base: string, joined: string) {
  try {
    const fs = await Promise.resolve().then(() => require('fs')) as typeof import('fs');
    const diskPath = buildDiskPath('public', 'data', 'locales', loc, base, joined, 'index.json');

    if (fs.existsSync(diskPath)) {
      return { data: (await readJsonFile(diskPath)) || {}, path: diskPath };
    }

    const parentDir = diskPath.substring(0, diskPath.lastIndexOf('/'));
    const parentParent = parentDir.substring(0, parentDir.lastIndexOf('/'));
    const lastSegment = parentDir.substring(parentDir.lastIndexOf('/') + 1);

    if (fs.existsSync(parentParent)) {
      const entries = fs.readdirSync(parentParent, { withFileTypes: true });
      for (const ent of entries) {
        if (!ent.isDirectory()) continue;
        const candidateIdx = `${parentParent}/${String(ent.name).replace(/^\/+|\/+$/g, '')}/index.json`;
        if (!fs.existsSync(candidateIdx)) continue;

        const parsed = (await readJsonFile(candidateIdx)) || {};
        if (parsed && Object.prototype.hasOwnProperty.call(parsed, lastSegment)) {
          return { data: parsed, path: candidateIdx };
        }
      }
    }

    const dirPath = buildDiskPath('public', 'data', 'locales', loc, base, joined);
    if (fs.existsSync(dirPath)) {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      const jsonFiles = entries
        .filter((e: any) => e.isFile() && String(e.name).toLowerCase().endsWith('.json'))
        .map((e: any) => String(e.name));

      if (jsonFiles.length > 0) {
        const aggregated: Record<string, any> = {};
        for (const fname of jsonFiles) {
          const fp = `${dirPath}/${String(fname).replace(/^\/+|\/+$/g, '')}`;
          const parsed = (await readJsonFile(fp)) || {};
          const key = fname.replace(/\.json$/i, '');
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length === 1) {
            const innerKey = Object.keys(parsed)[0];
            aggregated[key] = parsed[innerKey];
          } else {
            aggregated[key] = parsed;
          }
        }
        if (Object.keys(aggregated).length > 0) {
          return { data: aggregated, path: dirPath };
        }
      }
    }
  } catch (_) {
    // ignore disk access errors
  }
  return null;
}


