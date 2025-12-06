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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

