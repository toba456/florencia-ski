'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const serviceKeys = ['private', 'kids', 'offPiste', 'group'] as const;

const icons = {
  private: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  kids: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  offPiste: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
    </svg>
  ),
  group: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function ServicesSection() {
  const t = useTranslations('services');

  return (
    <section id="services" className="bg-brand-navy py-24 md:py-32 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p
            className="text-brand-ice text-xs tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600 }}
          >
            {t('sectionLabel')}
          </p>
          <h2
            className="text-white"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 900,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            {t('title')}
          </h2>
        </motion.div>

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-px bg-brand-border mb-px">
          {serviceKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="bg-brand-navy p-8 flex flex-col gap-6 group hover:bg-brand-dark transition-colors duration-300"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-brand-ice/10 group-hover:bg-brand-ice/20 transition-colors duration-300 text-brand-ice/70 group-hover:text-brand-ice">
                {icons[key]}
              </div>

              <div>
                <h3
                  className="text-white text-xl mb-3"
                  style={{
                    fontFamily: 'var(--font-barlow)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-brand-subtext text-sm leading-relaxed">
                  {t(`items.${key}.description`)}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-brand-border flex flex-col gap-2 text-xs text-brand-subtext">
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {t('duration')}
                  </span>
                  <span>{t('halfDay')}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {t('language')}
                  </span>
                  <span>{t('languages')}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {t('price')}
                  </span>
                  <span className="text-brand-ice">{t('priceValue')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <a
            href="#booking"
            className="inline-flex items-center gap-3 px-10 py-4 bg-brand-ice text-brand-dark text-sm tracking-widest uppercase font-bold hover:bg-white transition-all duration-200"
            style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
          >
            {t('inquire')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
