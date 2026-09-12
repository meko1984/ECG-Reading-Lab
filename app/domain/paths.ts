const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

export function createAppPath(path: string, basePath = '', staticExport = false): string {
  if (path === '/') return `${basePath}/`;
  if (staticExport) return `${basePath}${path}.html`;
  return `${basePath}${path}`;
}

export function appPath(path: string): string {
  return createAppPath(path, publicBasePath, isStaticExport);
}
