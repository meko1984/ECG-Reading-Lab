const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function appPath(path: string): string {
  if (!publicBasePath) return path;
  if (path === '/') return `${publicBasePath}/`;
  return `${publicBasePath}${path}.html`;
}
