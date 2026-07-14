'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import StarRating from './StarRating';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ReviewForm() {
  const t = useTranslations('reviews.form');
  const [status, setStatus] = useState<Status>('idle');
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setStatus('submitting');
    try {
      const formData = new FormData();
      formData.set('reviewer_name', name);
      formData.set('rating', String(rating));
      formData.set('text', text);
      if (image) formData.set('image', image);

      const res = await fetch('/api/reviews', { method: 'POST', body: formData });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-brand-navy border border-brand-border p-10 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-ice/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-ice" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white text-sm max-w-sm">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-brand-navy border border-brand-border p-6 grid sm:grid-cols-2 gap-5">
      <h3
        className="sm:col-span-2 text-white text-xl mb-1"
        style={{ fontFamily: 'var(--font-barlow)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}
      >
        {t('title')}
      </h3>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-brand-subtext tracking-widest uppercase" style={{ fontFamily: 'var(--font-barlow)' }}>
          {t('name')} *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('namePlaceholder')}
          maxLength={100}
          className="bg-brand-dark border border-brand-border px-4 py-2.5 text-white text-sm placeholder:text-brand-muted focus:outline-none focus:border-brand-ice transition-colors"
        />
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-brand-subtext tracking-widest uppercase" style={{ fontFamily: 'var(--font-barlow)' }}>
          {t('rating')} *
        </label>
        <StarRating rating={rating} onChange={setRating} size="lg" />
      </div>

      {/* Review text */}
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <label className="text-xs text-brand-subtext tracking-widest uppercase" style={{ fontFamily: 'var(--font-barlow)' }}>
          {t('text')} *
        </label>
        <textarea
          required
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('textPlaceholder')}
          maxLength={1000}
          className="bg-brand-dark border border-brand-border px-4 py-2.5 text-white text-sm placeholder:text-brand-muted focus:outline-none focus:border-brand-ice transition-colors resize-none"
        />
      </div>

      {/* Image */}
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <label className="text-xs text-brand-subtext tracking-widest uppercase" style={{ fontFamily: 'var(--font-barlow)' }}>
          {t('image')}
        </label>
        <div className="flex items-center gap-4">
          {imagePreview && (
            /* eslint-disable-next-line @next/next/no-img-element -- local blob preview, next/image is unnecessary here */
            <img src={imagePreview} alt="" className="w-16 h-16 object-cover border border-brand-border" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-brand-subtext text-sm file:mr-4 file:py-2 file:px-4 file:border file:border-brand-border file:bg-brand-dark file:text-white file:text-xs file:tracking-widest file:uppercase hover:file:border-brand-ice file:cursor-pointer cursor-pointer"
          />
        </div>
        <p className="text-brand-muted text-xs">{t('imageHint')}</p>
      </div>

      {/* Submit */}
      <div className="sm:col-span-2">
        {status === 'error' && <p className="text-red-400 text-sm mb-3">{t('error')}</p>}
        <button
          type="submit"
          disabled={status === 'submitting' || rating === 0}
          className="w-full py-4 bg-brand-ice text-brand-dark text-sm tracking-widest uppercase font-bold hover:bg-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
        >
          {status === 'submitting' ? t('submitting') : t('submit')}
        </button>
      </div>
    </form>
  );
}
