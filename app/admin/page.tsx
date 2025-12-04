"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Newspaper,
  BarChart3,
  Settings,
  Calendar,
  Users,
  DollarSign,
  Loader2,
  LogOut,
  ScrollText,
} from "lucide-react"
import { useMemo } from "react"
import { useAdminAccess, type UserRole } from "@/hooks/use-admin-access"

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "مسؤول أعلى",
  news_statements: "محرر الأخبار والبيانات",
  activities: "منسق النشاطات",
  }

const ADMIN_LINKS = [
    {
      title: "إدارة الإحصائيات",
      description: "تحديث أعداد الأعضاء والبيانات الإحصائية للحزب",
      href: "/admin/statistics",
      icon: BarChart3,
      color: "text-blue-600",
    roles: ["admin"],
    },
    {
      title: "إدارة محتوى الصفحات",
      description: "تعديل محتوى صفحات الموقع (الرؤية، البرنامج، الفروع، إلخ)",
      href: "/admin/pages",
      icon: FileText,
      color: "text-green-600",
    roles: ["admin"],
    },
    {
      title: "إدارة الأخبار",
      description: "إضافة وتعديل وحذف أخبار الحزب",
      href: "/admin/news",
      icon: Newspaper,
      color: "text-orange-600",
    roles: ["admin", "news_statements"],
    },
    {
      title: "إدارة البيانات",
      description: "إدارة البيانات الصحفية والتصريحات",
      href: "/admin/statements",
      icon: Settings,
      color: "text-purple-600",
    roles: ["admin", "news_statements"],
    },
    {
      title: "إدارة النشاطات",
      description: "إضافة وتعديل وحذف نشاطات وفعاليات الحزب",
      href: "/admin/activities",
      icon: Calendar,
      color: "text-pink-600",
    roles: ["admin", "activities"],
    },
  {
    title: "ميزانيات الحزب",
    description: "إدارة ملفات الميزانيات المالية السنوية",
    href: "/admin/budgets",
    icon: DollarSign,
    color: "text-emerald-600",
    roles: ["admin"],
  },
  {
    title: "إدارة النظام الرئيسي",
    description: "رفع وتحديث ملف النظام الرئيسي (PDF)",
    href: "/admin/constitution",
    icon: ScrollText,
    color: "text-indigo-600",
    roles: ["admin"],
  },
    {
      title: "إدارة المستخدمين",
      description: "عرض وتعديل المستخدمين الإداريين وتغيير كلمات المرور",
      href: "/admin/users",
      icon: Users,
      color: "text-cyan-600",
    roles: ["admin"],
    },
  ]

export default function AdminDashboard() {
  const router = useRouter()
  const { loading, authorized, role, signOut } = useAdminAccess(["admin", "news_statements", "activities"])

  const visibleLinks = useMemo(() => {
    if (!role) return []
    return ADMIN_LINKS.filter((link) => link.roles.includes(role))
  }, [role])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!authorized || !role) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center space-y-4">
          <CardHeader>
            <CardTitle className="text-3xl">يتطلب تسجيل الدخول</CardTitle>
            <CardDescription>يرجى تسجيل الدخول باستخدام حساب مصرح به للوصول إلى لوحة الإدارة.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/login">
              <Button className="w-full">الانتقال إلى صفحة تسجيل الدخول</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                العودة إلى الموقع الرئيسي
              </Button>
              </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">الدور الحالي</p>
            <p className="text-xl font-semibold">{ROLE_LABELS[role]}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                العودة إلى الموقع
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={async () => {
                await signOut()
                router.push("/admin/login")
              }}
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">لوحة إدارة الموقع</h1>
          <p className="text-lg text-muted-foreground">اختر القسم الذي ترغب بإدارته</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {visibleLinks.map((page) => {
            const Icon = page.icon
            return (
              <Link key={page.href} href={page.href}>
                <Card className="h-full hover:shadow-xl transition-all border-2 hover:border-primary/50 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`p-3 rounded-lg bg-muted ${page.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-2xl">{page.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{page.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      الدخول إلى {page.title}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
