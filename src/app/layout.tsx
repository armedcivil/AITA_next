import type { Metadata } from 'next';
import { AlertManager } from './ui/alert';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AITA Companies',
  description: 'AITA CMS for companies',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body className={`${inter.className} h-full w-full bg-white antialiased`}>
        {children}
        <AlertManager />
      </body>
    </html>
  );
}
