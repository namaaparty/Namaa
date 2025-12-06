import { SiteNavbar } from "@/components/site-navbar"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <SiteNavbar />
      
      {/* Hero Skeleton */}
      <div className="relative w-full h-[60vh] bg-muted animate-pulse" />

      {/* Content Skeleton */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

