import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

const barlow = Barlow_Condensed({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Florencia Segovia — Ski Instructor in Japan',
  description:
    'Private ski lessons in Hakuba, Myoko and Shiga Kogen, Japan. Off-piste, kids, groups. Argentinian instructor, WFR certified, lawyer — one standard: safety.',
  keywords: ['ski instructor Japan', 'Hakuba ski lessons', 'Myoko ski instructor', 'off-piste Japan', 'private ski lessons'],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'es' | 'th')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${barlow.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
