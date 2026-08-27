import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://meko1984.github.io/ECG-Reading-Lab/';
const previewImageUrl = 'https://meko1984.github.io/ECG-Reading-Lab/og.png';
const siteTitle = '心電図よみときラボ | ECG Reading Lab';
const siteDescription =
  '心電図を読む前の考え方を、図と波形で見える化する非診断用の学習Webアプリ。';
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const publicAsset = (path: string) => `${publicBasePath}${path}`;

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: '心電図ラボ',
  title: siteTitle,
  description: siteDescription,
  manifest: publicAsset('/manifest.webmanifest'),
  icons: {
    icon: [
      { url: publicAsset('/favicon.svg'), type: 'image/svg+xml' },
      { url: publicAsset('/icon-192.png'), sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: publicAsset('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '心電図ラボ',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteUrl,
    siteName: '心電図よみときラボ',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: previewImageUrl,
        width: 1200,
        height: 630,
        alt: '心電図よみときラボ — ECG Reading Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [previewImageUrl],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f5fcff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
