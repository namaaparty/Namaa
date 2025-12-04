"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getPartyStatistics, updatePartyStatistics, type PartyStatistics } from "@/lib/pages-storage"
import { RefreshCw, Save, LogOut, Lock, ArrowRight } from "lucide-react"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function StatisticsAdmin() {
  const router = useRouter()
  const { loading: authLoading, authorized, signOut } = useAdminAccess(["admin"])
  const { toast } = useToast()
  const [stats, setStats] = useState<PartyStatistics | null>(null)
  const [formData, setFormData] = useState({
    total_members: 0,
    female_members: 0,
    male_members: 0,
    youth_members: 0,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (authorized) {
    loadStats()
    }
  }, [authorized])

  async function loadStats() {
    setLoading(true)
    const data = await getPartyStatistics()
    if (data) {
      setStats(data)
      setFormData({
        total_members: data.total_members,
        female_members: data.female_members,
        male_members: data.male_members,
        youth_members: data.youth_members,
      })
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const success = await updatePartyStatistics(formData)
    if (success) {
      toast({ title: "تم الحفظ", description: "تم تحديث الإحصائيات بنجاح" })
      await loadStats()
    } else {
      toast({ variant: "destructive", title: "فشل التحديث", description: "تعذر تحديث الإحصائيات" })
    }
    setSaving(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center space-y-4 p-8">
          <Lock className="w-12 h-12 text-primary mx-auto" />
          <div>
            <h2 className="text-2xl font-bold mb-2">صفحة محمية</h2>
            <p className="text-muted-foreground">لا تمتلك الصلاحية لإدارة إحصائيات الحزب.</p>
          </div>
          <Button onClick={() => router.push("/admin/login")} className="w-full">
            الانتقال إلى تسجيل الدخول
          </Button>
        </Card>
      </div>
    )
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold">إدارة إحصائيات الحزب</h1>
          <div className="flex flex-wrap gap-2 justify-end">
            <Link href="/admin">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowRight className="h-4 w-4" />
                العودة إلى لوحة التحكم
              </Button>
            </Link>
          <Button onClick={loadStats} disabled={loading} variant="outline">
            <RefreshCw className={`ml-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="total_members">إجمالي الأعضاء</Label>
              <Input
                id="total_members"
                type="number"
                value={formData.total_members}
                onChange={(e) => setFormData({ ...formData, total_members: Number.parseInt(e.target.value) || 0 })}
                className="text-right"
              />
            </div>

            <div>
              <Label htmlFor="female_members">الأعضاء الإناث</Label>
              <Input
                id="female_members"
                type="number"
                value={formData.female_members}
                onChange={(e) => setFormData({ ...formData, female_members: Number.parseInt(e.target.value) || 0 })}
                className="text-right"
              />
            </div>

            <div>
              <Label htmlFor="male_members">الأعضاء الذكور</Label>
              <Input
                id="male_members"
                type="number"
                value={formData.male_members}
                onChange={(e) => setFormData({ ...formData, male_members: Number.parseInt(e.target.value) || 0 })}
                className="text-right"
              />
            </div>

            <div>
              <Label htmlFor="youth_members">الشباب</Label>
              <Input
                id="youth_members"
                type="number"
                value={formData.youth_members}
                onChange={(e) => setFormData({ ...formData, youth_members: Number.parseInt(e.target.value) || 0 })}
                className="text-right"
              />
            </div>

            {stats && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  آخر تحديث: {new Date(stats.last_updated).toLocaleString("ar-EG")}
                </p>
              </div>
            )}

            <Button onClick={handleSave} disabled={saving} className="w-full">
              <Save className="ml-2 h-4 w-4" />
              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </div>
        </Card>

        <Card className="p-6 mt-6 bg-primary/5">
          <h3 className="font-bold mb-2">ملاحظة</h3>
          <p className="text-sm text-muted-foreground">
            يمكنك تحديث هذه الأرقام يدوياً من خلال هذه الصفحة، أو يمكن برمجة تحديث تلقائي أسبوعي لجلب البيانات من موقع
            الهيئة المستقلة للانتخاب.
          </p>
        </Card>
      </div>
    </div>
  )
}
