import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import { StackProvider, StackTheme } from '@stackframe/stack';

import './globals.css';

import { stackServerApp } from '../stack';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Footprint AI',
  description:
    'Track your carbon footprint and make meaningful changes to your lifestyle.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StackProvider app={stackServerApp}>
          <StackTheme>{children}</StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
