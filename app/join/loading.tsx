import { SiteNavbar } from "@/components/site-navbar"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <SiteNavbar />
      
      <div className="py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8 mx-auto" />
          <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-12 w-full mt-8" />
          </div>
        </div>
      </div>
    </main>
  )
}

