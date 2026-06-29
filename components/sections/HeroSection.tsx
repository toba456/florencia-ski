'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpeg"
          alt="Florencia Segovia skiing in deep powder snow in Japan"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/75 via-brand-dark/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/45 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-brand-ice text-sm tracking-[0.3em] uppercase mb-6"
            style={{ fontFamily: 'var(--font-barlow)', fontWeight: 600 }}
          >
            {t('location')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white leading-none mb-4"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 900,
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}
          >
            {t('title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-brand-ice/90 mb-10"
            style={{
              fontFamily: 'var(--font-barlow)',
              fontWeight: 600,
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#about"
              className="inline-flex items-center gap-3 px-7 py-3.5 border border-white text-white text-sm tracking-widest uppercase font-bold hover:bg-white hover:text-brand-dark transition-all duration-200 group"
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
            <a
              href="#booking"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-brand-ice text-brand-dark text-sm tracking-widest uppercase font-bold hover:bg-white transition-all duration-200"
              style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
            >
              Book Now
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-barlow)' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
