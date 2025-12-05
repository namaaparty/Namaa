"use client"

import { useState, useEffect } from "react"
import { NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import type { NewsArticle } from "@/lib/types"
import Link from "next/link"
import { Newspaper, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

const CATEGORIES = ["الكل", "أخبار", "تدريب", "فعاليات", "بيانات"]
const ITEMS_PER_PAGE = 3

interface NewsClientPageProps {
  articles: NewsArticle[]
  heroImage: string
}

export default function NewsClientPage({ articles, heroImage }: NewsClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const filteredArticles =
    selectedCategory === "الكل"
      ? articles
      : Array.isArray(articles)
        ? articles.filter((a) => a.category === selectedCategory)
        : []

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentArticles = filteredArticles.slice(startIndex, endIndex)

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

      {/* Hero Section - استخدام صورة Hero من Supabase */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image src={heroImage || "/placeholder.svg"} alt="أخبار حزب نماء" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)' }}>أخبار الحزب</h1>
            <p className="text-xl lg:text-2xl text-white/95 drop-shadow-lg">تابع أحدث أخبار وفعاليات حزب نماء</p>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <section className="relative py-8 bg-gradient-to-br from-background via-primary/5 to-secondary/10">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">أخبار حزب نماء</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">تابع أحدث أخبار وفعاليات الحزب</p>
            </div>
          </div>
        </section>

        <main className="container mx-auto px-4 py-6">
          <div className="flex gap-2 mb-12 justify-center flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">لا توجد أخبار في هذه الفئة</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {currentArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mb-12">
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
            </>
          )}
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
