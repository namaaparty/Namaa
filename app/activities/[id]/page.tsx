"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { Calendar, MapPin, Eye, Facebook } from "lucide-react"
import { SiteNavbar } from "@/components/site-navbar"

interface Activity {
  id: string
  title: string
  description: string
  content: string
  image: string
  date: string
  location: string
  views: number
  created_at: string
}

export default function ActivityDetailPage() {
  const params = useParams()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [relatedActivities, setRelatedActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  useEffect(() => {
    async function loadActivity() {
      const paramId = Array.isArray(params.id) ? params.id[0] : params.id
      if (!paramId) return

      const supabase = createClient()

      // Get activity details
      const { data: activityData, error } = await supabase.from("activities").select("*").eq("id", paramId).single()

      if (error || !activityData) {
        console.error("Error loading activity:", error)
        setLoading(false)
        return
      }

      setActivity(activityData)

      // Increment views
      await supabase
        .from("activities")
        .update({ views: (activityData.views || 0) + 1 })
        .eq("id", paramId)

      // Get related activities
      const { data: relatedData } = await supabase
        .from("activities")
        .select("*")
        .neq("id", paramId)
        .order("date", { ascending: false })
        .limit(3)

      if (relatedData) {
        setRelatedActivities(relatedData)
      }

      setLoading(false)
    }

    loadActivity()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold text-gray-900">النشاط غير موجود</h1>
        <Link href="/activities">
          <Button>العودة للنشاطات</Button>
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
          {activity.image && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8 bg-muted">
              <Image src={activity.image || "/placeholder.svg"} alt={activity.title} fill className="object-contain" />
            </div>
          )}

          {/* Activity Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(activity.date)}</span>
              </div>
              {activity.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{activity.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{activity.views || 0} مشاهدة</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{activity.title}</h1>
            <p className="text-xl text-gray-600">{activity.description}</p>
          </div>

          {/* Activity Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12 whitespace-pre-wrap">
            {activity.content}
          </div>

          <Link href="/activities">
            <Button variant="outline">العودة للنشاطات</Button>
          </Link>
        </article>

        {/* Related Activities */}
        {relatedActivities.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">نشاطات أخرى</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedActivities.map((a) => (
                <Link key={a.id} href={`/activities/${a.id}`}>
                  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    {a.image && (
                      <div className="relative h-32 w-full bg-muted">
                        <Image src={a.image || "/placeholder.svg"} alt={a.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-2 line-clamp-2">{a.title}</h3>
                      <p className="text-xs text-gray-500">{formatDate(a.date)}</p>
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
