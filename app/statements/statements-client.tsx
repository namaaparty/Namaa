"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, FileText, Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

const ITEMS_PER_PAGE = 3

interface StatementsClientProps {
  statements: any[]
  heroImage: string
}

export default function StatementsClient({ statements, heroImage }: StatementsClientProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(statements.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentStatements = statements.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <main dir="rtl" className="min-h-screen bg-background relative">
      <SiteNavbar />
      <div className="relative z-10 mt-20">
        <section className="relative w-full h-[80vh] overflow-hidden">
          <Image
            src={heroImage || "/placeholder.svg"}
            alt="البيانات الصادرة عن الحزب"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)' }}>البيانات الصادرة</h1>
              <p className="text-xl lg:text-2xl text-white/95 drop-shadow-lg">
                مواقف وبيانات حزب نماء حول القضايا الوطنية
              </p>
            </div>
          </div>
        </section>

        <section className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/10 py-6">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">البيانات الصادرة عن الحزب</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                مواقف وبيانات حزب نماء حول القضايا الوطنية والسياسية والاقتصادية
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentStatements.map((statement) => (
              <div key={statement.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col p-0 group">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={statement.image || "/placeholder.svg?height=192&width=384&query=بيان صحفي"}
                      alt={statement.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      quality={80}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(statement.date).toLocaleDateString("en-GB")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{statement.views || 0} views</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{statement.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">{statement.content}</p>
                    <Button variant="outline" className="w-full bg-transparent mt-auto" asChild>
                      <Link href={`/statements/${statement.id}`}>
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

        <SiteFooter />
      </div>
    </main>
  )
}
