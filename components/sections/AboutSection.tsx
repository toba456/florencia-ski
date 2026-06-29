'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
  const t = useTranslations('about');

  return (
    <section id="about" className="bg-brand-navy py-24 md:py-32 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[3/4] max-w-sm mx-auto md:mx-0 overflow-hidden">
              <Image
                src="/about.jpeg"
                alt="Florencia Segovia ski instructor Japan"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 90vw, 40vw"
              />
              {/* Decorative border offset */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-brand-ice/20 -z-10" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            viewport={{ once: true }}
          >
            <p
              className="text-brand-ice text-xs tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600 }}
            >
              {t('sectionLabel')}
            </p>

            <h2
              className="text-white leading-none mb-6"
              style={{
                fontFamily: 'var(--font-barlow)',
                fontWeight: 900,
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                textTransform: 'uppercase',
              }}
            >
              {t('title')}
            </h2>

            <p
              className="text-brand-subtext text-sm tracking-widest uppercase mb-8 leading-relaxed"
              style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600 }}
            >
              {t('credentials')}
            </p>

            <div className="w-12 h-px bg-brand-ice mb-8" />

            <p className="text-brand-text/80 leading-relaxed mb-10 text-lg">
              {t('bio')}
            </p>

            <div className="flex flex-col gap-3 mb-10">
              {['Passion.', 'Professionalism.', 'Safety.'].map((word) => (
                <span
                  key={word}
                  className="text-white text-2xl"
                  style={{
                    fontFamily: 'var(--font-barlow)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            <a
              href="#method"
              className="inline-flex items-center gap-3 px-6 py-3 border border-brand-border text-brand-subtext text-xs tracking-widest uppercase font-semibold hover:border-brand-ice hover:text-white transition-all duration-200 group"
              style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
            >
              {t('cta')}
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
