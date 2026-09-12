import { readFileSync } from 'node:fs';

const routes = JSON.parse(readFileSync(new URL('./data/routes.json', import.meta.url), 'utf8'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * Every legacy URL ends in a slash. Without this the whole site 301-chains or
   * 404s on day one — the single highest-impact setting in the migration.
   */
  trailingSlash: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
  },

  /**
   * 301s live here rather than in middleware so they are edge-cached and never
   * boot React. Targets are reconciled against the pages that actually get built
   * by scripts/bootstrap/reconcile.py — a redirect to a non-existent page is a
   * 404 in disguise, so that check fails the bootstrap.
   */
  async redirects() {
    return routes.redirects.map(({ from, to }) => ({
      source: from.replace(/\/$/, ''),
      destination: to,
      permanent: true,
    }));
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/img/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
