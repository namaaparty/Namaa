"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Calendar, ChevronLeft, ChevronRight, Eye, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

const ITEMS_PER_PAGE = 3

interface Activity {
  id: string
  src: string
  title: string
  description: string
  date: string
  location: string
  views: number
}

interface ActivitiesClientProps {
  heroImage: string
  activities: Activity[]
}

export default function ActivitiesClient({ heroImage, activities }: ActivitiesClientProps) {
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentActivities = activities.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="h-20" />

      <section className="relative h-[80vh] overflow-hidden">
        <Image src={heroImage || "/placeholder.svg"} alt="نشاطات حزب نماء" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)' }}>نشاطات الحزب</h1>
            <p className="text-xl lg:text-2xl text-white/95 drop-shadow-lg">
              نعمل بشكل مستمر على التواصل مع المجتمع وتنظيم الفعاليات
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <section className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/10 py-6">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">نشاطاتنا</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                نعمل بشكل مستمر على التواصل مع المجتمع وتنظيم الفعاليات والاجتماعات
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentActivities.map((item, idx) => (
                <div key={item.id || idx} className="group">
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow p-0 h-full flex flex-col">
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={item.src || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 space-y-3 flex flex-col">
                      {item.date && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <time>{formatDate(item.date)}</time>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            <span>{item.views || 0}</span>
                          </div>
                        </div>
                      )}
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed flex-1">{item.description}</p>
                      {item.location && (
                        <p className="text-sm text-muted-foreground/80 flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          {item.location}
                        </p>
                      )}
                      <Button variant="outline" className="w-full bg-transparent mt-auto" asChild>
                        <Link href={`/activities/${item.id}`}>
                          اقرأ المزيد
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 bg-transparent"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  صفحة {currentPage} من {totalPages}
                </span>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 bg-transparent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  )
}
