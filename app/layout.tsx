import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://meko1984.github.io/ECG-Reading-Lab/';
const previewImageUrl = 'https://meko1984.github.io/ECG-Reading-Lab/og.png';
const siteTitle = '心電図よみときラボ | ECG Reading Lab';
const siteDescription =
  '心電図を読む前の考え方を、図と波形で見える化する非診断用の学習Webアプリ。';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
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
