// Image optimization utilities

/**
 * Generate a simple blur placeholder for images
 * This provides a better loading experience
 */
export function getBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f3f4f6"/>
    </svg>
  `
  const base64 = Buffer.from(canvas).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Get optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(config?: {
  priority?: boolean
  quality?: number
  loading?: 'lazy' | 'eager'
}) {
  return {
    quality: config?.quality ?? 80,
    loading: config?.loading ?? 'lazy',
    placeholder: 'blur' as const,
    blurDataURL: getBlurDataURL(),
    ...(config?.priority && { priority: true }),
  }
}

