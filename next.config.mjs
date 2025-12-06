/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first (better compression), fallback to WebP
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // Cache for 24 hours (was 1 hour)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gavnfdnutmczdtcemzhj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: false,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Optimize for faster development
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js', '@supabase/ssr'],
  },
}

export default nextConfig
