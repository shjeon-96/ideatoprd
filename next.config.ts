import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Optimize barrel file imports for faster builds and smaller bundles
    // See: https://vercel.com/blog/how-we-optimized-package-imports-in-next-js
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
    ],
  },
};

export default nextConfig;
