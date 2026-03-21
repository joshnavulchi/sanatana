// Safe loader for optionally-present generated params modules.
// This file uses a dynamic require and must only be imported from server-side code.
export function loadGeneratedParamsSync(modulePath: string): any[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(modulePath) as any;
    return Array.isArray(mod?.params) ? mod.params : (Array.isArray(mod) ? mod : []);
  } catch (_) {
    return [];
  }
}

export async function loadGeneratedParams(modulePath: string): Promise<any[]> {
  try {
    // Use require inside async function to avoid top-level dynamic import during bundling
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = await Promise.resolve().then(() => require(modulePath)) as any;
    return Array.isArray(mod?.params) ? mod.params : (Array.isArray(mod) ? mod : []);
  } catch (_) {
    return [];
  }
}
