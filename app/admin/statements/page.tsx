"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Statement } from "@/lib/statements-storage"
import { Trash2, Edit2, Upload, X, LogOut, Loader2, Lock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { useToast } from "@/components/ui/use-toast"

export default function StatementsAdminPage() {
  const router = useRouter()
  const { loading, authorized, signOut } = useAdminAccess(["admin", "news_statements"])
  const { toast } = useToast()

  const [statements, setStatements] = useState<Statement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showHeroSection, setShowHeroSection] = useState(false)
  const [heroImage, setHeroImage] = useState<string>("")
  const [heroImagePreview, setHeroImagePreview] = useState<string>("")
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)
  const [heroImageSaving, setHeroImageSaving] = useState(false)
  const createInitialFormState = () => ({
    title: "",
    description: "",
    content: "",
    image: "",
    date: new Date().toISOString().split("T")[0],
  })

  const [formData, setFormData] = useState(createInitialFormState())
  const [imagePreview, setImagePreview] = useState<string>("")

  const loadStatements = async () => {
    try {
      const response = await fetch("/api/admin/statements")
      if (!response.ok) {
        throw new Error("فشل تحميل البيانات")
      }
      const stmts = (await response.json()) as Statement[]
      setStatements(stmts)
    } catch (error) {
      console.error("[v0] Error loading statements:", error)
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "تعذر تحميل البيانات الصادرة",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = editingId ? `/api/admin/statements/${editingId}` : "/api/admin/statements"
    const method = editingId ? "PUT" : "POST"

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error?.error || "تعذر حفظ البيان")
      }

      toast({
        title: editingId ? "تم تحديث البيان" : "تم إضافة البيان",
        description: editingId ? "تم حفظ التعديلات بنجاح" : "تم إضافة البيان الجديد بنجاح",
        variant: "success",
      })

      setShowForm(false)
      setEditingId(null)
      setFormData(createInitialFormState())
      setImagePreview("")
      loadStatements()
    } catch (error) {
      console.error("[v0] Error saving statement:", error)
      toast({
        variant: "destructive",
        title: "خطأ أثناء الحفظ",
        description: error instanceof Error ? error.message : "تعذر حفظ البيان",
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "تنبيه",
          description: "يرجى اختيار صورة فقط",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "تنبيه",
          description: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData({ ...formData, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview("")
    setFormData({ ...formData, image: "" })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData(createInitialFormState())
  }

  const handleAddStatementClick = () => {
    setEditingId(null)
    setFormData(createInitialFormState())
    setImagePreview("")
    setShowForm(true)
  }

  const handleEdit = (statement: Statement) => {
    setEditingId(statement.id)
    setFormData({
      title: statement.title,
      description: statement.description,
      content: statement.content,
      image: statement.image || "",
      date: statement.date || new Date().toISOString().split("T")[0],
    })
    setImagePreview(statement.image || "")
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/statements/${id}`, { method: "DELETE" })
      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error?.error || "تعذر حذف البيان")
      }
      toast({
        title: "تم الحذف",
        description: "تم حذف البيان بنجاح",
      })
      loadStatements()
    } catch (error) {
      console.error("[v0] Error deleting statement:", error)
      toast({
        variant: "destructive",
        title: "خطأ أثناء الحذف",
        description: error instanceof Error ? error.message : "تعذر حذف البيان",
      })
    }
  }

  const loadHeroImage = async () => {
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("hero_image")
        .eq("page_id", "statements")
        .limit(1)

      if (error) {
        console.error("Error fetching hero image:", error)
        return
      }

      if (data && data.length > 0 && data[0].hero_image) {
        setHeroImage(data[0].hero_image)
        setHeroImagePreview(data[0].hero_image)
      }
    } catch (error) {
      console.error("Error loading hero image:", error)
    }
  }

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "تنبيه",
          description: "يرجى اختيار صورة فقط",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "تنبيه",
          description: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string)
        setHeroImageFile(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveHeroImage = () => {
    setHeroImagePreview("")
    setHeroImage("")
    setHeroImageFile(null)
  }

  const handleSaveHeroImage = async () => {
    if (!heroImageFile) {
      toast({
        variant: "destructive",
        title: "تنبيه",
        description: "يرجى اختيار صورة أولاً",
      })
      return
    }

    setHeroImageSaving(true)
    try {
      const formData = new FormData()
      formData.append("pageId", "statements")
      formData.append("file", heroImageFile)

      const response = await fetch("/api/admin/page-hero", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error?.error || "تعذر حفظ صورة الخلفية")
      }

      const data = await response.json()
      setHeroImage(data.url)
      setHeroImagePreview(data.url)
      setHeroImageFile(null)
      toast({
        title: "تم الحفظ",
        description: "تم تحديث صورة الخلفية العلوية بنجاح",
        variant: "success",
      })
      setShowHeroSection(false)
    } catch (error) {
      console.error("Error saving hero image:", error)
      toast({
        variant: "destructive",
        title: "خطأ أثناء الحفظ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء حفظ الصورة",
      })
    } finally {
      setHeroImageSaving(false)
    }
  }

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/admin/login")
  }

  useEffect(() => {
    if (authorized) {
      loadStatements()
      loadHeroImage()
    }
  }, [authorized])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">يتطلب صلاحية</h1>
            <p className="text-gray-600">لا تمتلك الصلاحية لإدارة البيانات. يرجى تسجيل الدخول بحساب مختلف.</p>
          </div>
          <div className="mt-8 space-y-3">
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button onClick={() => handleNavigation("/")} className="flex-shrink-0">
              <img src="/logo-horizontal.png" alt="حزب نماء" className="h-12 w-auto drop-shadow-lg" />
            </button>

            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/")}>
                الرئيسية
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/vision")}>
                رؤية الحزب
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/leadership")}>
                القيادات التنفيذية
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/local-development")}>
                البرنامج الاقتصادي
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/news")}>
                أخبار الحزب
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/statements")}>
                البيانات الصادرة
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/activities")}>
                النشاطات
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/branches")}>
                فروع الحزب
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                onClick={() => handleNavigation("/join")}
              >
                طلب الانتساب
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="h-20" />

      <main className="container mx-auto px-4 py-12">
        <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">إدارة البيانات الصادرة</h1>
              <div className="flex flex-wrap gap-2 justify-end">
                <Link href="/admin">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <ArrowRight size={18} />
                    العودة إلى لوحة التحكم
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setShowHeroSection(!showHeroSection)} className="gap-2">
                  <Upload size={20} />
                  صورة الخلفية العلوية
                </Button>
                <Button onClick={showForm ? handleCancel : handleAddStatementClick} className="gap-2">
                  {showForm ? "إلغاء النموذج" : "بيان جديد"}
                </Button>
              </div>
            </div>

            {showHeroSection && (
              <Card className="p-6 mb-8 border-2 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold mb-4">صورة الخلفية العلوية للصفحة الرئيسية</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">هذه الصورة ستظهر في أعلى صفحة البيانات الصادرة الرئيسية</p>

                  <div>
                    {!heroImagePreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          className="hidden"
                          id="hero-image-upload"
                        />
                        <label htmlFor="hero-image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                          <Upload className="w-16 h-16 text-gray-400" />
                          <span className="text-lg text-gray-600">اضغط لاختيار صورة الخلفية العلوية</span>
                          <span className="text-sm text-gray-500">
                            الحجم الموصى به: 1920x1080 بكسل | PNG, JPG حتى 5MB
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                          <div className="relative h-96">
                            {heroImagePreview.startsWith("data:") ? (
                              <img
                                src={heroImagePreview || "/placeholder.svg"}
                                alt="معاينة صورة Hero"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image
                                src={heroImagePreview || "/placeholder.svg"}
                                alt="معاينة صورة Hero"
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveHeroImage}
                            className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X size={24} />
                          </button>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={handleSaveHeroImage}
                            className="flex-1"
                            disabled={heroImageSaving || !heroImageFile}
                          >
                            {heroImageSaving ? "جاري الحفظ..." : "حفظ صورة الخلفية"}
                          </Button>
                          <Button variant="outline" onClick={() => setShowHeroSection(false)} className="flex-1">
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form */}
            {showForm && (
              <Card className="p-6 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold mb-6">
                    {editingId ? "تعديل البيان" : "إضافة بيان جديد"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">العنوان</Label>
                      <Input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="أدخل عنوان البيان"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">الوصف</Label>
                      <Input
                        type="text"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="وصف قصير للبيان"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">المحتوى</Label>
                      <textarea
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                        placeholder="محتوى البيان الكامل"
                      />
                    </div>

                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">صورة البيان</Label>
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload className="w-12 h-12 text-gray-400" />
                            <span className="text-sm text-gray-600">اضغط لاختيار صورة</span>
                            <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 5MB</span>
                          </label>
                        </div>
                      ) : (
                        <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                          <div className="relative h-64">
                            {imagePreview.startsWith("data:") ? (
                              <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="معاينة"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image
                                src={imagePreview || "/placeholder.svg"}
                                alt="معاينة"
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" className="flex-1">
                        {editingId ? "حفظ التعديلات" : "إضافة البيان"}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Statements List */}
            <div className="space-y-4">
              {statements.length === 0 ? (
                <Card className="p-8 text-center">
                  <CardContent>
                    <p className="text-gray-600 mb-4">لا توجد بيانات حالياً</p>
                    <Button onClick={() => setShowForm(true)}>إضافة أول بيان</Button>
                  </CardContent>
                </Card>
              ) : (
                statements.map((statement) => (
                  <Card key={statement.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{statement.title}</h3>
                        <p className="text-gray-600 mb-3">{statement.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(statement.date).toLocaleDateString("en-GB")}</span>
                          <span>{statement.views} مشاهدة</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(statement)} className="gap-2">
                          <Edit2 size={16} />
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(statement.id)}
                          className="gap-2"
                        >
                          <Trash2 size={16} />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
      </main>
    </div>
  )
}
