import { SiteNavbar } from "@/components/site-navbar"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <SiteNavbar />
      
      {/* Hero Skeleton */}
      <div className="relative w-full h-[80vh] bg-muted animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
            <Skeleton className="h-16 w-3/4 mx-auto bg-white/20" />
            <Skeleton className="h-8 w-1/2 mx-auto bg-white/20" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

