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
    <div className="flex items-center gap-1">
      {languages.map((lang, i) => (
        <span key={lang.code} className="flex items-center gap-1">
          <button
            onClick={() => switchLocale(lang.code)}
            className={`text-xs tracking-widest font-medium transition-colors ${
              locale === lang.code
                ? 'text-brand-ice'
                : 'text-brand-subtext hover:text-white'
            }`}
            style={{ fontFamily: 'var(--font-barlow)' }}
          >
            {lang.label}
          </button>
          {i < languages.length - 1 && (
            <span className="text-brand-border text-xs">·</span>
          )}
        </span>
      ))}
    </div>
  );
}
