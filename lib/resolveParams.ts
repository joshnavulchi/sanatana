export async function resolveParams<T>(params: T | Promise<T> | null | undefined): Promise<T | undefined> {
  if (params == null) return undefined;

  try {
    return await params;
  } catch {
    return undefined;
  }
}