"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Trash2, Edit2, Plus, LogOut, Lock, Upload, X, ArrowRight } from "lucide-react"
import Image from "next/image"
import { uploadImageToStorage, deleteImageFromStorage } from "@/lib/pages-storage"
import { useRouter } from "next/navigation"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { ConfirmDialog } from "@/components/confirm-dialog"

interface Activity {
  id: string
  title: string
  description: string
  content: string
  image: string
  date: string
  location: string
  views?: number // إضافة حقل views كاختياري
}

export default function AdminActivitiesPage() {
  const router = useRouter()
  const { loading: authLoading, authorized, signOut } = useAdminAccess(["admin", "activities"])
  const { toast } = useToast()

  const [activities, setActivities] = useState<Activity[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
    date: "",
    location: "",
    views: 0, // إضافة حقل views إلى النموذج
  })
  const [imagePreview, setImagePreview] = useState<string>("")

  const [showHeroSection, setShowHeroSection] = useState(false)
  const [heroImageData, setHeroImageData] = useState<{ file: File | null; preview: string }>({
    file: null,
    preview: "",
  })
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (authorized) {
      loadActivities()
    }
  }, [authorized])

  const handleLogout = async () => {
    await signOut()
    router.push("/admin/login")
  }

  const loadActivities = async () => {
    const { data, error } = await supabase.from("activities").select("*").order("date", { ascending: false })

    if (error) {
      console.error("Error loading activities:", error)
      toast({
        variant: "destructive",
        title: "فشل تحميل النشاطات",
        description: "حدث خطأ أثناء جلب البيانات",
      })
      return
    }

    setActivities(data || [])
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
        const img = document.createElement("img")
        img.onload = () => {
          const maxWidth = 1200
          const maxHeight = 800
          let width = img.width
          let height = img.height

          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }

          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            const resizedImage = canvas.toDataURL("image/jpeg", 0.9)
            setFormData({ ...formData, image: resizedImage })
            setImagePreview(resizedImage)
          }
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" })
    setImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      const { error } = await supabase
        .from("activities")
        .update({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          image: formData.image,
          date: formData.date,
          location: formData.location,
          views: formData.views, // تضمين views في التحديث
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId)

      if (error) {
        console.error("Error updating activity:", error)
        toast({
          variant: "destructive",
          title: "خطأ أثناء التحديث",
          description: "حدث خطأ أثناء تحديث النشاط",
        })
        return
      }

      toast({
        title: "تم تحديث النشاط",
        description: "تم حفظ التعديلات بنجاح",
        variant: "success",
      })
      setEditingId(null)
    } else {
      const { error } = await supabase.from("activities").insert([
        {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          image: formData.image,
          date: formData.date,
          location: formData.location,
          views: formData.views, // تضمين views في الإضافة
        },
      ])

      if (error) {
        console.error("Error adding activity:", error)
        toast({
          variant: "destructive",
          title: "خطأ أثناء الإضافة",
          description: "حدث خطأ أثناء إضافة النشاط",
        })
        return
      }

      toast({
        title: "تم إضافة النشاط",
        description: "تم إنشاء النشاط الجديد بنجاح",
        variant: "success",
      })
    }

    setFormData({
      title: "",
      description: "",
      content: "",
      image: "",
      date: "",
      location: "",
      views: 0, // إعادة تعيين views
    })
    setImagePreview("")
    setShowForm(false)
    loadActivities()
  }

  const handleEdit = (activity: Activity) => {
    setFormData({
      title: activity.title,
      description: activity.description,
      content: activity.content,
      image: activity.image,
      date: activity.date,
      location: activity.location,
      views: activity.views || 0, // تحميل views من النشاط
    })
    setImagePreview(activity.image)
    setEditingId(activity.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    setDeleteLoading(true)
    const { error } = await supabase.from("activities").delete().eq("id", deleteTarget.id)

    if (error) {
      console.error("Error deleting activity:", error)
      toast({
        variant: "destructive",
        title: "خطأ أثناء الحذف",
        description: "حدث خطأ أثناء حذف النشاط",
      })
      setDeleteLoading(false)
      return
    }

    toast({
      title: "تم حذف النشاط",
      description: `${deleteTarget.title} تم حذفه نهائياً`,
      variant: "success",
    })

    setDeleteLoading(false)
    setDeleteTarget(null)
    loadActivities()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      content: "",
      image: "",
      date: "",
      location: "",
      views: 0, // إعادة تعيين views
    })

    setImagePreview("")
  }

  const handlePageHeroImageUpdate = async () => {
    if (!heroImageData.file) {
      toast({
        variant: "destructive",
        title: "تنبيه",
        description: "يرجى اختيار صورة أولاً",
      })
      return
    }

    try {
      // جلب الصورة القديمة (ignore errors if row doesn't exist)
      const { data: pageData } = await supabase
        .from("page_content")
        .select("hero_image")
        .eq("page_id", "activities")
        .maybeSingle()

      // حذف الصورة القديمة من Storage إن وجدت
      if (pageData?.hero_image && pageData.hero_image.includes("supabase.co/storage")) {
        await deleteImageFromStorage(pageData.hero_image).catch(() => {}) // Ignore delete errors
      }

      // رفع الصورة الجديدة إلى Supabase Storage
      const imageUrl = await uploadImageToStorage(heroImageData.file, "activities")

      // تحديث قاعدة البيانات برابط الصورة الجديدة (upsert if row doesn't exist)
      const { error } = await supabase
        .from("page_content")
        .upsert({ 
          page_id: "activities", 
          page_title: "نشاطات الحزب",
          hero_image: imageUrl 
        }, { onConflict: "page_id" })

      if (error) {
        console.error("Error updating hero image:", error)
        toast({
          variant: "destructive",
          title: "خطأ أثناء الحفظ",
          description: "حدث خطأ أثناء حفظ الصورة",
        })
        return
      }

      toast({
        title: "تم الحفظ",
        description: "تم حفظ صورة الخلفية العلوية بنجاح",
      })
      setShowHeroSection(false)
      setHeroImageData({ file: null, preview: "" })

      // إعادة تحميل البيانات
      loadActivities()
    } catch (error) {
      console.error("Error saving hero image:", error)
      toast({
        variant: "destructive",
        title: "خطأ أثناء الحفظ",
        description: "حدث خطأ أثناء حفظ الصورة",
      })
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

      const preview = URL.createObjectURL(file)
      setHeroImageData({ file, preview })
    }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">يتطلب صلاحية</h1>
            <p className="text-gray-600">لا تمتلك الصلاحية لإدارة النشاطات. يرجى تسجيل الدخول بحساب مختلف.</p>
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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex-shrink-0">
              <img src="/logo-horizontal.png" alt="حزب نماء" className="h-12 w-auto drop-shadow-lg" />
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <Link href="/" scroll={true}>
                <Button variant="ghost" size="sm">
                  الرئيسية
                </Button>
              </Link>
              <Link href="/vision" scroll={true}>
                <Button variant="ghost" size="sm">
                  رؤية الحزب
                </Button>
              </Link>
              <Link href="/leadership" scroll={true}>
                <Button variant="ghost" size="sm">
                  القيادات التنفيذية
                </Button>
              </Link>
              <Link href="/local-development" scroll={true}>
                <Button variant="ghost" size="sm">
                  البرنامج الاقتصادي
                </Button>
              </Link>
              <Link href="/news" scroll={true}>
                <Button variant="ghost" size="sm">
                  أخبار الحزب
                </Button>
              </Link>
              <Link href="/statements" scroll={true}>
                <Button variant="ghost" size="sm">
                  البيانات الصادرة
                </Button>
              </Link>
              <Link href="/activities" scroll={true}>
                <Button variant="ghost" size="sm">
                  النشاطات
                </Button>
              </Link>
              <Link href="/branches" scroll={true}>
                <Button variant="ghost" size="sm">
                  فروع الحزب
                </Button>
              </Link>
              <Link href="/join" scroll={true}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  طلب الانتساب
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut size={16} />
                تسجيل الخروج
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="h-20" />

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إدارة النشاطات</h1>
          <div className="flex flex-wrap gap-2 justify-end">
            <Link href="/admin">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowRight size={18} />
                العودة إلى لوحة التحكم
              </Button>
            </Link>
            <Button
              onClick={() => setShowHeroSection(!showHeroSection)}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <Upload size={20} />
              صورة الخلفية العلوية
            </Button>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus size={20} />
                نشاط جديد
              </Button>
            )}
          </div>
        </div>

        {showHeroSection && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">صورة الخلفية العلوية</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختر صورة الخلفية (ستظهر في أعلى صفحة النشاطات)
                </label>
                {!heroImageData.preview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      className="hidden"
                      id="hero-image-upload"
                    />
                    <label htmlFor="hero-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-12 h-12 text-gray-400" />
                      <span className="text-sm text-gray-600">اضغط لاختيار صورة الخلفية</span>
                      <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 5MB</span>
                    </label>
                  </div>
                ) : (
                  <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={heroImageData.preview || "/placeholder.svg"}
                        alt="معاينة"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setHeroImageData({ file: null, preview: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button onClick={handlePageHeroImageUpdate} className="flex-1">
                  حفظ الصورة
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowHeroSection(false)
                    setHeroImageData({ file: null, preview: "" })
                  }}
                  className="flex-1 bg-transparent"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingId ? "تعديل النشاط" : "إضافة نشاط جديد"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان النشاط</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل عنوان النشاط"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف المختصر</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="وصف قصير للنشاط"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المحتوى الكامل</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  placeholder="تفاصيل النشاط الكاملة"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ النشاط</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المكان</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مكان إقامة النشاط"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عدد المشاهدات</label>
                <input
                  type="number"
                  min="0"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: Number.parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">صورة النشاط</label>
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
                        <Image src={imagePreview || "/placeholder.svg"} alt="معاينة" fill className="object-cover" />
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
                  {editingId ? "حفظ التعديلات" : "إضافة النشاط"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  إلغاء
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Activities List */}
        <div className="space-y-4">
          {activities.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 mb-4">لا توجد نشاطات حالياً</p>
              <Button onClick={() => setShowForm(true)}>إضافة أول نشاط</Button>
            </Card>
          ) : (
            activities.map((activity) => (
              <Card key={activity.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                    <p className="text-gray-600 mb-3">{activity.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📅 {new Date(activity.date).toLocaleDateString("ar-JO")}</span>
                      <span>📍 {activity.location}</span>
                      <span>👁️ {activity.views || 0} مشاهدة</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(activity)} className="gap-2">
                      <Edit2 size={16} />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteTarget(activity)}
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
      </main>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
          }
        }}
        title="تأكيد حذف النشاط"
        description={
          deleteTarget
            ? `سيتم حذف "${deleteTarget.title}" بشكل نهائي من قائمة النشاطات.`
            : "اختر نشاطاً للحذف."
        }
        confirmLabel="حذف النشاط"
        cancelLabel="تراجع"
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </div>
  )
}
