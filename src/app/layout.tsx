import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI TODO & Work Management Platform',
  description: 'AI-native work management platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
