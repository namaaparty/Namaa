"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, FileText, Upload, LogOut, Lock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ConstitutionDocument {
  id: string
  title: string | null
  file_url: string | null
  file_size: number | null
  uploaded_at: string | null
}

export default function AdminConstitutionManagerPage() {
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()
  const { loading: authLoading, authorized, signOut } = useAdminAccess(["admin"])

  const [document, setDocument] = useState<ConstitutionDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (authorized) {
      fetchDocument()
    }
  }, [authorized])

  const fetchDocument = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/constitution-documents", { cache: "no-store" })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          (payload && typeof payload === "object" && "error" in payload && payload.error) ||
          "تعذر تحميل بيانات النظام الأساسي."
        throw new Error(typeof message === "string" ? message : "تعذر تحميل بيانات النظام الأساسي.")
      }

      setDocument((payload as ConstitutionDocument | null) ?? null)
    } catch (error) {
      console.error("[constitution-admin] Failed to fetch document:", error)
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : "تعذر تحميل بيانات النظام الأساسي.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast({
        variant: "destructive",
        title: "تنبيه",
        description: "يرجى اختيار ملف PDF قبل الرفع.",
      })
      return
    }

    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "تنبيه",
        description: "نقبل ملفات PDF فقط.",
      })
      return
    }

    try {
      setUploading(true)
      const fileName = `constitution-${Date.now()}.pdf`
      const { error: uploadError } = await supabase.storage.from("budgets").upload(fileName, file, {
        upsert: true,
      })
      if (uploadError) {
        console.error("[constitution-admin] upload error:", uploadError)
        throw new Error("تعذر رفع الملف، حاول مرة أخرى.")
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("budgets").getPublicUrl(fileName)

      const { error: insertError } = await supabase.from("constitution_documents").insert({
        title: file.name,
        file_url: publicUrl,
        file_size: file.size,
        uploaded_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("[constitution-admin] insert error:", insertError)
        throw new Error("تعذر حفظ بيانات الملف.")
      }

      toast({
        title: "تم الرفع",
        description: "تم تحديث ملف النظام الأساسي بنجاح.",
      })
      setFile(null)
      fetchDocument()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء رفع الملف.",
      })
    } finally {
      setUploading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center space-y-4 p-8">
          <Lock className="w-12 h-12 text-primary mx-auto" />
          <div>
            <CardTitle className="text-2xl mb-2">صفحة محمية</CardTitle>
            <CardDescription>لا تمتلك الصلاحية لإدارة ملف النظام الأساسي.</CardDescription>
          </div>
          <div className="space-y-3">
            <Link href="/admin/login">
              <Button className="w-full">الانتقال إلى صفحة تسجيل الدخول</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                العودة إلى الموقع الرئيسي
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <p className="text-sm text-muted-foreground">لوحة إدارة النظام الأساسي</p>
              <h1 className="text-2xl font-bold">تحديث ملف النظام الأساسي</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="ghost" className="gap-2">
                  <ArrowRight size={18} />
                  العودة إلى لوحة التحكم
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
                <LogOut size={16} />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-20" />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>آخر نسخة مرفوعة</CardTitle>
            <CardDescription>يمكنك الاطلاع على أحدث ملف PDF تم استخدامه في صفحة النظام الرئيسي.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">جاري التحميل...</p>
            ) : document ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <FileText className="w-5 h-5 text-primary" />
                  {document.title || "ملف مرفوع"}
                </div>
                <p className="text-sm text-muted-foreground">
                  الحجم: {(document.file_size ? document.file_size / (1024 * 1024) : 0).toFixed(2)} MB
                </p>
                {document.uploaded_at && (
                  <p className="text-sm text-muted-foreground">
                    تاريخ الرفع: {new Date(document.uploaded_at).toLocaleDateString("ar-JO")}
                  </p>
                )}
                {document.file_url && (
                  <Button variant="outline" asChild className="mt-4 w-fit">
                    <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                      عرض الملف الحالي
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">لا يوجد ملف مرفوع حتى الآن.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>رفع ملف جديد</CardTitle>
            <CardDescription>اختر ملف PDF ليتم عرضه في الصفحة العامة للنظام الرئيسي.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleUpload}>
              <div className="space-y-2">
                <Label>ملف PDF</Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file && <p className="text-sm text-muted-foreground">الملف المختار: {file.name}</p>}
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={uploading} className="gap-2">
                  <Upload size={16} />
                  {uploading ? "جاري الرفع..." : "حفظ الملف"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

