import type { NextConfig } from 'next';

const pagesBasePath = process.env.PAGES_BASE_PATH ?? '';
const isStaticExport = process.env.GITHUB_PAGES_BUILD === 'true' || pagesBasePath.length > 0;

const nextConfig: NextConfig = {
  output: isStaticExport ? 'export' : undefined,
  assetPrefix: pagesBasePath || undefined,
  trailingSlash: false,
  images: isStaticExport ? { unoptimized: true } : undefined,
};

export default nextConfig;
