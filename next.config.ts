import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: 'https',
            hostname: new URL(supabaseUrl).hostname,
            pathname: '/storage/v1/object/public/**',
          },
        ]
      : [],
  },
};

export default withNextIntl(nextConfig);
