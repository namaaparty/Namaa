"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getNewsById, getNews } from "@/lib/news-storage"
import type { NewsArticle } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NewsCard } from "@/components/news-card"
import { Facebook } from "lucide-react"
import { LoginButton } from "@/components/login-button"
import { SiteNavbar } from "@/components/site-navbar"

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true)
      const id = params.id as string

      const articleData = await getNewsById(id)
      setArticle(articleData)

      if (articleData) {
        const allNews = await getNews()
        const related = allNews
          .filter((a) => a.id !== articleData.id && a.category === articleData.category)
          .slice(0, 3)
        setRelatedArticles(related)
      }

      setLoading(false)

      // التمرير لأعلى الصفحة
      window.scrollTo({ top: 0, behavior: "instant" })
    }

    loadArticle()
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold text-gray-900">الخبر غير موجود</h1>
        <Link href="/news">
          <Button>العودة للأخبار</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      <SiteNavbar />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-12">
        {/* Article */}
        <article className="max-w-3xl mx-auto mb-12">
          {/* Hero Image */}
          <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8 bg-muted">
            <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm bg-blue-100 text-blue-700 px-4 py-1 rounded-full">{article.category}</span>
              <span className="text-sm text-gray-500">{formatDate(article.date)}</span>
              <span className="text-sm text-gray-500">{article.views} مشاهدة</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <p className="text-xl text-gray-600">{article.description}</p>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12">{article.content}</div>

          {/* Back Button */}
          <Link href="/news">
            <Button variant="outline">العودة للأخبار</Button>
          </Link>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">أخبار ذات صلة</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
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
                <p className="text-muted-foreground text-sm leading-relaxed">
                  حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة
                </p>
                <p className="text-muted-foreground text-sm font-semibold">نهضة تنموية اقتصادية شاملة</p>
                <p className="text-muted-foreground text-xs">نمو – عدالة – تأهيل – تشغيل – تطوير</p>
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
                <p>البريد: info@namaaparty.com</p>
                <p>رقم الهاتف: 0770449644</p>
                <p>واتساب: 0770449644</p>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <a
                  href="https://www.facebook.com/namaaparty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-[#1877F2]/10 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-[#1877F2]" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 text-center">
            <p className="text-sm text-muted-foreground">© 2025 حزب نماء. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
