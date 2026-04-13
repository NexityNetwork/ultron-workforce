import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@cap/ui': './lib/partner-shims/cap-ui.tsx',
      '@cap/utils': './lib/partner-shims/cap-utils.ts',
      '@midday/events/client': './lib/partner-shims/midday-events-client.ts',
      '@midday/events/events': './lib/partner-shims/midday-events-events.ts',
      'ui': './lib/partner-shims/ui.ts',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      'react-icons',
    ],
  },
}

export default nextConfig
