import type { NextConfig } from "next";
import os from 'os';
import path from 'path';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const cpuCount = os.cpus()?.length ?? 1;
const requestedWorkers = Number(process.env.NEXT_BUILD_MAX_WORKERS ?? '0');
const buildWorkers = Number.isFinite(requestedWorkers) && requestedWorkers > 0
  ? Math.min(Math.floor(requestedWorkers), cpuCount)
  : Math.min(cpuCount, 4);

// This app is statically exported. `output: 'export'` and `trailingSlash: true`
// are set permanently to produce a static site suitable for static hosts.

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicit turbopack config (empty) to avoid the runtime error when
  // a custom `webpack` function is present. Next.js 16 enables Turbopack
  // by default; providing an explicit `turbopack` field silences the
  // conflict warning and allows webpack overrides to continue working.
  turbopack: {
    // Ensure Turbopack resolves the workspace root (prevents inferring `app` as project root)
    // Use an absolute path so Turbopack can find `next` and other dependencies.
    root: path.resolve(__dirname),
  },
  reactStrictMode: true,
  // SWC minifier is handled by Next.js automatically in modern versions.
  // `swcMinify` is removed to avoid unrecognized-option warnings.

  // Compiler options for modern browsers
  compiler: {
    // Remove React properties
    reactRemoveProperties: true,
    // Remove console statements in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  typescript: {
    // Ignore TypeScript errors during production builds to avoid build failures.
    // Ensure type safety during development by running `tsc --noEmit` locally or in CI.
    ignoreBuildErrors: true,
  },
  // eslint: {
  // Ignore ESLint errors during production builds to avoid build failures.
  // Ensure code quality during development by running `eslint .` locally or in CI.
  // ignoreDuringBuilds: true,
  // },
  // Target modern browsers to reduce bundle size
  // This tells Next.js to output ES2022 code without unnecessary polyfills
  transpilePackages: [],

  // Client-side (browser) source maps in production:
  productionBrowserSourceMaps: false,

  // SWC minify removed — Next.js may warn about `swcMinify` in newer versions.
  // Experimental CSS optimization (dedupe & minimize CSS across pages).
  experimental: {
    // Control build concurrency for CI/local stability and speed.
    // Override with NEXT_BUILD_MAX_WORKERS (e.g. 4, 6, 8).
    cpus: buildWorkers,
    // optimizeCss requires the `critters` package and is incompatible with
    // output: 'export'. Critical CSS is handled by scripts/generate-critical-css.js.
    optimizeCss: false,
    largePageDataBytes: 512 * 1024, // 512KB threshold for inlining page data as JSON
    // Enable optimized resource loading hints
    // optimizePackageImports: ['react', 'react-dom'],
  },
  // This app is statically exported. Keep `output: 'export'` for static builds.
  output: 'export',
  trailingSlash: true,
  staticPageGenerationTimeout: 180,
  images: {
    // Disable Next Image optimization for static export / GitHub Pages
    unoptimized: true,
    minimumCacheTTL: 86400, // 1 day
    qualities: [75, 90]
  },
  outputFileTracingRoot: __dirname,
  // Custom webpack config removed for full Turbopack support.
  // NOTE: headers() function removed - not compatible with output: 'export'
  // For static exports, configure caching at your CDN or hosting provider level
};

export default withBundleAnalyzer(nextConfig as NextConfig);