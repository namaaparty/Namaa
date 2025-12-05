"use client"

import { useState, useEffect } from "react"
import { NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import type { NewsArticle } from "@/lib/types"
import Link from "next/link"
import { Newspaper, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { SiteNavbar } from "@/components/site-navbar"

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
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">أخبار الحزب</h1>
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

        {/* Footer Section */}
        <footer className="bg-secondary/30 py-8 border-t">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <Link href="/" className="inline-block">
                  <Image
                    src="/logo-horizontal.png"
                    alt="حزب نماء"
                    width={200}
                    height={50}
                    className="h-14 w-auto object-contain"
                  />
                </Link>
                <div className="space-y-2">
                  <p className="text-muted-foreground font-semibold">حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة</p>
                  <p className="text-muted-foreground font-semibold">نهضة تنموية اقتصادية شاملة</p>
                  <p className="text-muted-foreground text-sm">نمو – عدالة – تأهيل – تشغيل – تطوير</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">روابط سريعة</h3>
                <div className="flex flex-col gap-2">
                  <Link href="/vision" className="text-muted-foreground hover:text-primary transition-colors">
                    رؤية الحزب
                  </Link>
                  <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                    الأخبار
                  </Link>
                <Link href="/statements" className="text-muted-foreground hover:text-primary transition-colors">
                  البيانات الصادرة
                </Link>
                  <Link href="/budgets" className="text-muted-foreground hover:text-primary transition-colors">
                    ميزانيات الحزب
                  </Link>
                <Link href="/constitution" className="text-muted-foreground hover:text-primary transition-colors">
                  النظام الرئيسي
                </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">روابط هامة</h3>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://iec.jo/ar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    الهيئة المستقلة للانتخاب
                  </a>
                  <a
                    href="https://jordan.gov.jo/AR/List/%D8%A7%D9%84%D8%AC%D9%87%D8%A7%D8%AA_%D8%A7%D9%84%D8%AD%D9%83%D9%88%D9%85%D9%8A%D8%A9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    موقع الحكومة الأردنية
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">تواصل معنا</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <a href="mailto:info@namaaparty.com" className="hover:text-primary transition-colors">
                      info@namaaparty.com
                    </a>
                  </p>
                  <p>
                    <a href="tel:+962770449644" className="hover:text-primary transition-colors">
                      رقم الهاتف: 0770449644
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://wa.me/962770449644"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      واتساب: 0770449644
                    </a>
                  </p>
                  <p className="text-sm pt-2">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Ibrahim+Al+Naimat+Complex,+Um+Al+Summaq+St+4,+Amman"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      عمان / لواء بيادر وادي السير – شارع أم السماق امتداد شارع مكة – مجمع الفيصل – عمارة رقم (4) –
                      الطابق (1)
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <a
                    href="https://www.facebook.com/namaaparty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-[#1877F2]/10 transition-colors"
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <span className="text-sm text-muted-foreground">تابعنا على صفحتنا على الفيسبوك</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 text-center border-card">
              <p className="text-sm text-muted-foreground">© 2025 حزب نماء. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
