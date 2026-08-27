import type { NextConfig } from 'next';

const pagesBasePath = process.env.PAGES_BASE_PATH ?? '';
const isGitHubPagesBuild = pagesBasePath.length > 0;

const nextConfig: NextConfig = {
  output: isGitHubPagesBuild ? 'export' : undefined,
  assetPrefix: isGitHubPagesBuild ? pagesBasePath : undefined,
  trailingSlash: false,
  images: isGitHubPagesBuild ? { unoptimized: true } : undefined,
};

export default nextConfig;
