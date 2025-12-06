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
        <div className="max-w-7xl mx-auto">
          {/* Main Leader */}
          <div className="mb-16">
            <Skeleton className="h-10 w-48 mx-auto mb-8" />
            <div className="flex justify-center">
              <Skeleton className="h-96 w-80" />
            </div>
          </div>
          
          {/* Assistant Leaders */}
          <div>
            <Skeleton className="h-10 w-64 mx-auto mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

