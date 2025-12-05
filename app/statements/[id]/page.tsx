"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { Eye, Facebook } from "lucide-react"
import { SiteNavbar } from "@/components/site-navbar"

interface Statement {
  id: string
  title: string
  description: string
  content: string
  image: string
  date: string
  views: number
  created_at: string
}

export default function StatementDetailPage() {
  const params = useParams()
  const [statement, setStatement] = useState<Statement | null>(null)
  const [relatedStatements, setRelatedStatements] = useState<Statement[]>([])
  const [loading, setLoading] = useState(true)

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-GB")
  }

  useEffect(() => {
    async function loadStatement() {
      if (!params.id) return

      const supabase = createClient()

      // Get statement details
      const { data: statementData, error } = await supabase.from("statements").select("*").eq("id", params.id).single()

      if (error || !statementData) {
        console.error("Error loading statement:", error)
        setLoading(false)
        return
      }

      setStatement(statementData)

      // Increment views
      await supabase
        .from("statements")
        .update({ views: (statementData.views || 0) + 1 })
        .eq("id", params.id)

      // Get related statements
      const { data: relatedData } = await supabase
        .from("statements")
        .select("*")
        .neq("id", params.id)
        .order("date", { ascending: false })
        .limit(3)

      if (relatedData) {
        setRelatedStatements(relatedData)
      }

      setLoading(false)
    }

    loadStatement()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    )
  }

  if (!statement) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold text-gray-900">البيان غير موجود</h1>
        <Link href="/statements">
          <Button>العودة للبيانات الصادرة</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {/* Header */}
      <SiteNavbar />
      <div className="h-20" />

      <main className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto mb-12">
          {/* Hero Image */}
          {statement.image && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8 bg-muted">
              <Image
                src={statement.image || "/placeholder.svg"}
                alt={statement.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5" />
            </div>
          )}

          {/* Statement Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <span>{formatDate(statement.date)}</span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{statement.views || 0} مشاهدة</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{statement.title}</h1>
            <p className="text-xl text-gray-600">{statement.description}</p>
          </div>

          {/* Statement Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12 whitespace-pre-wrap">
            {statement.content}
          </div>

          <Link href="/statements">
            <Button variant="outline">العودة للبيانات الصادرة</Button>
          </Link>
        </article>

        {/* Related Statements */}
        {relatedStatements.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">بيانات أخرى</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedStatements.map((s) => (
                <Link key={s.id} href={`/statements/${s.id}`}>
                  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    {s.image && (
                      <div className="relative h-32 w-full bg-muted">
                        <Image src={s.image || "/placeholder.svg"} alt={s.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-2 line-clamp-2">{s.title}</h3>
                      <p className="text-xs text-gray-500">{formatDate(s.date)}</p>
                    </div>
                  </div>
                </Link>
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
