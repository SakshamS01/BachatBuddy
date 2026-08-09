/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  staticPageGenerationTimeout: 180,
  experimental: {
    webpackBuildWorker: true,
    // Disable the Suspense requirement for useSearchParams
    missingSuspenseWithCSRBailout: false,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;