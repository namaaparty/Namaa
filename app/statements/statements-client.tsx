"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, FileText, Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { SiteNavbar } from "@/components/site-navbar"

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
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    window.scrollTo({ top: 0, behavior: "smooth" })
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
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">البيانات الصادرة</h1>
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
              <Link key={statement.id} href={`/statements/${statement.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer">
                  <div className="relative h-48">
                    <Image
                      src={statement.image || "/placeholder.svg?height=192&width=384&query=بيان صحفي"}
                      alt={statement.title}
                      fill
                      className="object-cover"
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
                  </div>
                </Card>
              </Link>
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

        <footer className="bg-secondary/30 border-t py-8">
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
                    <Facebook className="w-5 h-5 text-[#1877F2]" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">© 2025 حزب نماء. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
