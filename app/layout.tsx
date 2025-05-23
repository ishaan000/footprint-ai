import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import { stackServerApp } from '@/stack';
import theme from '@/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { StackProvider, StackTheme } from '@stackframe/stack';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import '@/app/globals.css';

import Footer from '@/components/footer';
import { Header } from '@/components/header';

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
    <html
      lang='en'
      suppressHydrationWarning
      data-mui-color-scheme='light'
      className='light'
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} light antialiased`}
        data-theme='light'
      >
        <NextThemesProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={false}
          forcedTheme='light'
          themes={['light']}
        >
          <StackProvider app={stackServerApp}>
            <StackTheme>
              <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <div className='flex min-h-screen flex-col justify-between'>
                    <Header />
                    {children}
                    <Footer />
                  </div>
                </ThemeProvider>
              </AppRouterCacheProvider>
            </StackTheme>
          </StackProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
