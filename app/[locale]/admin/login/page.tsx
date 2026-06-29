'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(`/${locale}/admin/dashboard`);
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>

        <div className="bg-brand-navy border border-brand-border p-8">
          <h1
            className="text-white text-2xl mb-1"
            style={{ fontFamily: 'var(--font-barlow)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Admin Access
          </h1>
          <p className="text-brand-subtext text-sm mb-8">Manage your availability and bookings.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-subtext tracking-widest uppercase" style={{ fontFamily: 'var(--font-barlow)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-brand-dark border border-brand-border px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-ice transition-colors"
                placeholder="Floriseg@proton.me"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-subtext tracking-widest uppercase" style={{ fontFamily: 'var(--font-barlow)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-brand-dark border border-brand-border px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-ice transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 py-3.5 bg-brand-ice text-brand-dark text-sm tracking-widest uppercase font-bold hover:bg-white transition-all disabled:opacity-60"
              style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
