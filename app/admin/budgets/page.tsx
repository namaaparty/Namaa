"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, FileText, Upload, Trash2, Calendar, Download, Eye, ChevronLeft, Edit, Lock, UploadCloud } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { ConfirmDialog } from "@/components/confirm-dialog"

interface BudgetDocument {
  id: string
  year: number
  title: string
  description: string | null
  file_url: string
  file_size: number | null
  uploaded_at: string
}

export default function AdminBudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [year, setYear] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BudgetDocument | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const router = useRouter()
  const { loading: authLoading, authorized, signOut } = useAdminAccess(["admin"])
  const { toast } = useToast()

  useEffect(() => {
    if (authorized) {
    loadBudgets()
    }
  }, [authorized])

  async function loadBudgets() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("budget_documents").select("*").order("year", { ascending: false })

      if (error) throw error
      setBudgets(data || [])
    } catch (error: any) {
      console.error("[v0] Error loading budgets:", error)
      toast({
        variant: "destructive",
        title: "فشل تحميل الميزانيات",
        description: "حدث خطأ أثناء جلب البيانات",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/admin/login")
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!year || !title) {
      toast({
        variant: "destructive",
        title: "تنبيه",
        description: "الرجاء ملء جميع الحقول المطلوبة",
      })
      return
    }

    if (!file && !editingId) {
      toast({
        variant: "destructive",
        title: "تنبيه",
        description: "الرجاء اختيار ملف PDF",
      })
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()

      let fileUrl = ""
      let fileSize = 0

      if (file) {
        const fileExt = file.name.split(".").pop()
        const fileName = `budget-${year}.${fileExt}`
        const filePath = `${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("budgets")
          .upload(filePath, file, { upsert: true })

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("budgets").getPublicUrl(filePath)

        fileUrl = publicUrl
        fileSize = file.size
      }

      if (editingId) {
        const updateData: any = {
          year: Number.parseInt(year),
          title,
          description: description || null,
        }

        if (fileUrl) {
          updateData.file_url = fileUrl
          updateData.file_size = fileSize
        }

        const { error: dbError } = await supabase.from("budget_documents").update(updateData).eq("id", editingId)

        if (dbError) throw dbError

        toast({
          title: "تم التحديث",
          description: "تم تحديث الميزانية بنجاح",
        })
      } else {
        const { error: dbError } = await supabase.from("budget_documents").insert([
          {
            year: Number.parseInt(year),
            title,
            description: description || null,
            file_url: fileUrl,
            file_size: fileSize,
          },
        ])

        if (dbError) throw dbError

        toast({
          title: "تم الرفع",
          description: "تم رفع الميزانية بنجاح",
        })
      }

      setYear("")
      setTitle("")
      setDescription("")
      setFile(null)
      setEditingId(null)

      loadBudgets()
    } catch (error: any) {
      console.error("[v0] Error uploading budget:", error)
      toast({
        variant: "destructive",
        title: "خطأ أثناء الرفع",
        description: error.message,
      })
    } finally {
      setUploading(false)
    }
  }

  function handleEdit(budget: BudgetDocument) {
    setYear(budget.year.toString())
    setTitle(budget.title)
    setDescription(budget.description || "")
    setFile(null)
    setEditingId(budget.id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleCancelEdit() {
    setYear("")
    setTitle("")
    setDescription("")
    setFile(null)
    setEditingId(null)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return

    try {
      setDeleteLoading(true)
      const supabase = createClient()

      const { error: dbError } = await supabase.from("budget_documents").delete().eq("id", deleteTarget.id)

      if (dbError) throw dbError

      try {
        const filePath = deleteTarget.file_url.split("/budgets/")[1]
        if (filePath) {
          await supabase.storage.from("budgets").remove([filePath])
        }
      } catch (err) {
        console.error("[v0] Error deleting file:", err)
      }

      toast({
        title: "تم الحذف",
        description: "تم حذف الميزانية بنجاح",
        variant: "success",
      })
      setDeleteTarget(null)
      loadBudgets()
    } catch (error: any) {
      console.error("[v0] Error deleting budget:", error)
      toast({
        variant: "destructive",
        title: "خطأ أثناء الحذف",
        description: error.message,
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  function formatFileSize(bytes: number | null): string {
    if (!bytes) return "N/A"
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
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
            <CardTitle className="text-2xl mb-2">صفحة محمية</CardTitle>
            <CardDescription>لا تمتلك الصلاحية لإدارة ملفات الميزانيات.</CardDescription>
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo-namaa.png" alt="شعار حزب نماء" width={50} height={50} className="object-contain" />
              <div className="text-right">
                <div className="text-xl font-bold text-[#1a472a]">حزب نماء</div>
                <div className="text-xs text-gray-600">إدارة الميزانيات</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-[#1a472a] transition-colors">
                الرئيسية
              </Link>
              <Link href="/vision" className="text-gray-700 hover:text-[#1a472a] transition-colors">
                رؤية الحزب
              </Link>
              <Link href="/leadership" className="text-gray-700 hover:text-[#1a472a] transition-colors">
                القيادات التنفيذية
              </Link>
              <Link href="/local-development" className="text-gray-700 hover:text-[#1a472a] transition-colors">
                البرنامج الاقتصادي
              </Link>
              <Link href="/news" className="text-gray-700 hover:text-[#1a472a] transition-colors">
                أخبار الحزب
              </Link>
              <Link href="/statements" className="text-gray-700 hover:text-[#1a472a] transition-colors">
                البيانات الصادرة
              </Link>
              <Link href="/activities" className="text-gray-700 hover:text-[#1a472a] transition-colors">
                النشاطات
              </Link>
              <Link href="/branches" className="text-gray-700 hover:text-[#1a472a] transition-colors">
                فروع الحزب
              </Link>
              <Link href="/join" className="text-gray-700 hover:text-[#1a472a] transition-colors">
                طلب الانتساب
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1a472a] mb-2">إدارة الميزانيات</h1>
                <p className="text-gray-600">رفع وإدارة ميزانيات الحزب المالية السنوية</p>
              </div>
              <Link href="/admin">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <ChevronLeft className="w-4 h-4" />
                  <span>العودة إلى لوحة التحكم</span>
                </Button>
              </Link>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {editingId ? "تعديل الميزانية" : "رفع ميزانية جديدة"}
              </CardTitle>
              <CardDescription>
                {editingId ? "قم بتعديل معلومات الميزانية" : "قم برفع ملف PDF للميزانية المالية السنوية"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="year">السنة *</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2024"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                      min="2000"
                      max="2100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">العنوان *</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="ميزانية حزب نماء 2024"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف (اختياري)</Label>
                  <Textarea
                    id="description"
                    placeholder="وصف مختصر عن الميزانية..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="budget-file-upload" className="cursor-pointer font-semibold text-[#1a472a]">
                    ملف PDF {editingId ? "(اختياري للتعديل)" : "*"}
                  </Label>
                  <input
                    ref={fileInputRef}
                    id="budget-file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required={!editingId}
                    className="hidden"
                  />
                  <label htmlFor="budget-file-upload" className="block cursor-pointer">
                    <div className="border-2 border-dashed border-[#1a472a]/40 rounded-xl p-6 text-center flex flex-col items-center gap-3 text-[#1a472a] hover:border-[#1a472a] hover:bg-[#1a472a]/5 transition-all">
                      <UploadCloud className="w-10 h-10" />
                      <p className="text-base font-medium">اضغط هنا أو اسحب ملف PDF لوضعه في هذه المنطقة</p>
                      <p className="text-sm text-gray-500">يُقبل فقط ملف PDF – الحجم الموصى به أقل من 25MB</p>
                    </div>
                  </label>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
                    <span>
                      {file ? `الملف المحدد: ${file.name} (${formatFileSize(file.size)})` : "لم يتم اختيار ملف بعد"}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer border-[#1a472a] text-[#1a472a] hover:bg-[#1a472a]/10"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      اختيار ملف
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={uploading} className="flex-1 bg-[#1a472a] hover:bg-[#2d5a3f]">
                    {uploading ? "جاري الرفع..." : editingId ? "تحديث الميزانية" : "رفع الميزانية"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      إلغاء
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الميزانيات المرفوعة</CardTitle>
              <CardDescription>جميع ميزانيات الحزب المتاحة للجمهور</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-600">جاري التحميل...</div>
              ) : budgets.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">لا توجد ميزانيات مرفوعة بعد</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {budgets.map((budget) => (
                    <div key={budget.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-5 h-5 text-[#1a472a]" />
                            <h3 className="text-lg font-semibold text-[#1a472a]">{budget.title}</h3>
                            <span className="text-2xl font-bold text-[#1a472a]">{budget.year}</span>
                          </div>
                          {budget.description && <p className="text-sm text-gray-600 mb-2">{budget.description}</p>}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>الحجم: {formatFileSize(budget.file_size)}</span>
                            <span>رفع في: {new Date(budget.uploaded_at).toLocaleDateString("ar-JO")}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => window.open(budget.file_url, "_blank")}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const link = document.createElement("a")
                              link.href = budget.file_url
                              link.download = `ميزانية-${budget.year}.pdf`
                              link.click()
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(budget)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(budget)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
          }
        }}
        title="تأكيد حذف الميزانية"
        description={
          deleteTarget ? `سيتم حذف ميزانية ${deleteTarget.year} (${deleteTarget.title}) بشكل نهائي.` : ""
        }
        confirmLabel="حذف الميزانية"
        cancelLabel="تراجع"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
