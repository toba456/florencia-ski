'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'th', label: 'TH' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <div className="flex items-center border border-white/20 rounded-sm overflow-hidden">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLocale(lang.code)}
          className={`px-2.5 py-1 text-sm tracking-widest font-semibold transition-colors ${
            locale === lang.code
              ? 'bg-brand-ice text-brand-dark'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          style={{ fontFamily: 'var(--font-barlow)' }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
