import type { NextConfig } from "next";
import path from 'path';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// This app is statically exported. `output: 'export'` and `trailingSlash: true`
// are set permanently to produce a static site suitable for static hosts.

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicit turbopack config (empty) to avoid the runtime error when
  // a custom `webpack` function is present. Next.js 16 enables Turbopack
  // by default; providing an explicit `turbopack` field silences the
  // conflict warning and allows webpack overrides to continue working.
  turbopack: {},
  reactStrictMode: true,

  // Client-side (browser) source maps in production:
  productionBrowserSourceMaps: true,

  // SWC minify removed — Next.js may warn about `swcMinify` in newer versions.
  // Experimental CSS optimization (dedupe & minimize CSS across pages).
  experimental: {
    optimizeCss: true,
  },
  // This app is statically exported. `output: 'export'` and `trailingSlash: true`
  // are set to produce a static site suitable for static hosts.
  output: 'export',
  trailingSlash: true,
  images: {
    // Disable Next Image optimization for static export / GitHub Pages
    unoptimized: true,
    minimumCacheTTL: 86400 // 1 day
  },
  outputFileTracingRoot: __dirname,
  // Configure webpack persistent caching so subsequent builds can reuse
  // compiled artifacts. This reduces build times and avoids "No build
  // cache found" warnings in environments that support a writable
  // filesystem cache (CI or developer machines).
  webpack(config: unknown, { dev }: { dev: boolean }) {
    try {
      const cfg = config as any;
      if (!cfg.cache) {
        cfg.cache = {
          type: 'filesystem',
          cacheDirectory: path.join(__dirname, '.next', '.cache', 'webpack'),
          buildDependencies: {
            config: [__filename],
          },
        };
      }
      if (!dev) {
        // Emit source maps but don't link them in the JS files:
        cfg.devtool = 'hidden-source-map';  // emit maps, don't link in JS
        try {
          // Add CSS minimizer in production builds. The plugin is optional at runtime
          // so requiring it here won't break the build when it's absent.
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

          cfg.optimization = cfg.optimization || {};
          cfg.optimization.minimizer = cfg.optimization.minimizer || [];
          cfg.optimization.minimizer.push(new CssMinimizerPlugin());
        } catch (err) {
          // optional package not installed — skip enhancing webpack
        }
      }
      return cfg;
    } catch (e) {
      // ignore cache configuration errors
      return config as any;
    }
  },
  async headers() {
    return [
      // Long cache for static images and assets in `public/` (not fingerprinted)
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, stale-while-revalidate=259200' },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, stale-while-revalidate=259200' },
        ],
      },
      // Long-term immutable caching for fingerprinted assets (images, js, css, fonts)
      {
        source: '/(.*)\\.(png|jpg|jpeg|gif|svg|webp|css|js|woff2|woff|ttf)$',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable, stale-while-revalidate=259200' },
        ],
      },
      // JSON or locale files: moderate caching with revalidation
      {
        source: '/locales/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=259200' },
        ],
      },
      // HTML/SSR content: allow CDN short caching while keeping origin authoritative
      {
        source: '/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=604800' },
          { key: 'Vary', value: 'Accept-Encoding' }
        ],
      }
    ];
  }
};

export default withBundleAnalyzer(nextConfig as NextConfig);