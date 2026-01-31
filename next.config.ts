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
  // Enable SWC minifier for JS in production (fast and smaller bundles)
  swcMinify: true,

  // Compiler options for modern browsers
  compiler: {
    // Remove React properties
    reactRemoveProperties: true,
    // Remove console statements in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Target modern browsers to reduce bundle size
  // This tells Next.js to output ES2022 code without unnecessary polyfills
  transpilePackages: [],

  // Client-side (browser) source maps in production:
  productionBrowserSourceMaps: false,

  // SWC minify removed — Next.js may warn about `swcMinify` in newer versions.
  // Experimental CSS optimization (dedupe & minimize CSS across pages).
  experimental: {
    optimizeCss: true,
    // Enable optimized resource loading hints
    optimizePackageImports: ['react', 'react-dom'],
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
        // Emit source maps only when explicitly enabled in config:
        if (nextConfig.productionBrowserSourceMaps) {
          cfg.devtool = 'hidden-source-map';  // emit maps, don't link in JS
        }
        try {
          // Add CSS minimizer in production builds. The plugin is optional at runtime
          // so requiring it here won't break the build when it's absent.

          const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

          cfg.optimization = cfg.optimization || {};
          cfg.optimization.minimizer = cfg.optimization.minimizer || [];
          cfg.optimization.minimizer.push(new CssMinimizerPlugin());
        } catch (err) {
          // optional package not installed — skip enhancing webpack
        }
        // Ensure JS minification is enabled in webpack as a fallback
        try {

          const TerserPlugin = require('terser-webpack-plugin');
          cfg.optimization.minimize = true;
          cfg.optimization.minimizer.push(new TerserPlugin({ parallel: true }));
        } catch (err) {
          // optional package not installed — skip adding Terser fallback
        }
      }
      return cfg;
    } catch (e) {
      // ignore cache configuration errors
      return config as any;
    }
  }
  // NOTE: headers() function removed - not compatible with output: 'export'
  // For static exports, configure caching at your CDN or hosting provider level
};

export default withBundleAnalyzer(nextConfig as NextConfig);