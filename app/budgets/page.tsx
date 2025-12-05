"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Download,
  Calendar,
  Eye,
  Printer,
  AlertCircle,
  Facebook,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SiteNavbar } from "@/components/site-navbar"
import { useToast } from "@/components/ui/use-toast"

interface BudgetDocument {
  id: string
  year: number
  title: string
  description: string | null
  file_url: string
  file_size: number | null
  uploaded_at: string
  fileExists?: boolean
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const { toast } = useToast()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  useEffect(() => {
    loadBudgets()
  }, [])

  async function loadBudgets() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("budget_documents").select("*").order("year", { ascending: false })

      if (error) throw error

      const budgetsWithUrls = await Promise.all(
        (data || []).map(async (budget) => {
          try {
            const fileName = `budget-${budget.year}.pdf`

            const { data: fileData, error: fileError } = await supabase.storage.from("budgets").list("", {
              search: fileName,
            })

            const fileExists = !fileError && fileData && fileData.length > 0

            const { data: urlData } = supabase.storage.from("budgets").getPublicUrl(fileName)

            return {
              ...budget,
              file_url: urlData.publicUrl,
              fileExists,
            }
          } catch (err) {
            console.error(`[v0] Error processing budget ${budget.year}:`, err)
            return {
              ...budget,
              fileExists: false,
            }
          }
        }),
      )

      setBudgets(budgetsWithUrls)
    } catch (error) {
      console.error("[v0] Error loading budgets:", error)
    } finally {
      setLoading(false)
    }
  }

  async function viewBudget(e: React.MouseEvent, fileUrl: string, fileExists?: boolean) {
    e.preventDefault()
    e.stopPropagation()

    if (fileExists === false) {
      toast({
        variant: "destructive",
        title: "الملف غير متوفر",
        description: "يرجى التواصل مع إدارة الموقع للحصول على نسخة محدثة.",
      })
      return
    }

    try {
      const response = await fetch(fileUrl, { method: "HEAD" })
      if (!response.ok) {
        throw new Error("File not found")
      }
      window.open(fileUrl, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("[v0] Error opening budget:", error)
      toast({
        variant: "destructive",
        title: "تعذر فتح الملف",
        description: "الملف غير موجود أو تم حذفه.",
      })
    }
  }

  async function downloadBudget(e: React.MouseEvent, fileUrl: string, year: number, fileExists?: boolean) {
    e.preventDefault()
    e.stopPropagation()

    if (fileExists === false) {
      toast({
        variant: "destructive",
        title: "الملف غير متوفر",
        description: "يرجى التواصل مع إدارة الموقع للحصول على نسخة محدثة.",
      })
      return
    }

    try {
      const response = await fetch(fileUrl)
      if (!response.ok) {
        throw new Error("File not found")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `ميزانية-حزب-نماء-${year}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Error downloading file:", error)
      toast({
        variant: "destructive",
        title: "تعذر التحميل",
        description: "الملف غير موجود أو تم حذفه.",
      })
    }
  }

  async function printBudget(e: React.MouseEvent, fileUrl: string, fileExists?: boolean) {
    e.preventDefault()
    e.stopPropagation()

    if (fileExists === false) {
      toast({
        variant: "destructive",
        title: "الملف غير متوفر",
        description: "يرجى التواصل مع إدارة الموقع للحصول على نسخة محدثة.",
      })
      return
    }

    try {
      const response = await fetch(fileUrl, { method: "HEAD" })
      if (!response.ok) {
        throw new Error("File not found")
      }

      const printWindow = window.open(fileUrl, "_blank", "noopener,noreferrer")
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print()
        })
      }
    } catch (error) {
      console.error("[v0] Error printing budget:", error)
      toast({
        variant: "destructive",
        title: "تعذر الطباعة",
        description: "الملف غير موجود أو تم حذفه.",
      })
    }
  }

  const totalPages = Math.ceil(budgets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBudgets = budgets.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="h-20" />

      <section className="relative py-16 bg-gradient-to-br from-background via-primary/5 to-secondary/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">ميزانيات حزب نماء</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              الشفافية المالية هي أساس الثقة. نلتزم بنشر ميزانياتنا المالية السنوية لإطلاع الجميع على مواردنا ونفقاتنا
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-lg text-muted-foreground">جاري تحميل الميزانيات...</div>
              </div>
            ) : budgets.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">لا توجد ميزانيات متاحة حالياً</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-6">
                  {currentBudgets.map((budget) => (
                    <Card key={budget.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="border-b">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-2xl text-primary flex items-center gap-3">
                              <Calendar className="w-6 h-6" />
                              {budget.title}
                            </CardTitle>
                            {budget.description && (
                              <CardDescription className="mt-2 text-base">{budget.description}</CardDescription>
                            )}
                            {budget.fileExists === false && (
                              <div className="mt-3 flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">الملف غير متوفر حالياً. يرجى التواصل مع إدارة الموقع.</span>
                              </div>
                            )}
                          </div>
                          <div className="text-3xl font-bold text-primary">{budget.year}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="w-5 h-5" />
                            <span className="font-semibold">ملف PDF</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              onClick={(e) => viewBudget(e, budget.file_url, budget.fileExists)}
                              variant="outline"
                              className="flex items-center gap-2"
                              disabled={budget.fileExists === false}
                            >
                              <Eye className="w-4 h-4" />
                              <span>عرض</span>
                            </Button>
                            <Button
                              onClick={(e) => printBudget(e, budget.file_url, budget.fileExists)}
                              variant="outline"
                              className="flex items-center gap-2"
                              disabled={budget.fileExists === false}
                            >
                              <Printer className="w-4 h-4" />
                              <span>طباعة</span>
                            </Button>
                            <Button
                              onClick={(e) => downloadBudget(e, budget.file_url, budget.year, budget.fileExists)}
                              className="bg-accent hover:bg-accent/90 flex items-center gap-2"
                              disabled={budget.fileExists === false}
                            >
                              <Download className="w-4 h-4" />
                              <span>تحميل</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>السابق</span>
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1"
                    >
                      <span>التالي</span>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

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
                    عمان / لواء بيادر وادي السير – شارع أم السماق امتداد شارع مكة – مجمع الفيصل – عمارة رقم (4) – الطابق
                    (1)
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
  )
}
