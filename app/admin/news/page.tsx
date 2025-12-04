"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getNews, addNews, deleteNews, updateNews, exportNewsToFile, importNewsFromFile } from "@/lib/news-storage"
import { uploadImageToStorage, updatePageContent, getPageContent, deleteImageFromStorage } from "@/lib/pages-storage"
import type { NewsArticle } from "@/lib/types"
import Link from "next/link"
import {
  Trash2,
  Edit2,
  Plus,
  LogOut,
  Lock,
  Upload,
  X,
  Settings,
  Download,
  FileUp,
  ImageIcon,
  Loader2,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { useToast } from "@/components/ui/use-toast"
import { ConfirmDialog } from "@/components/confirm-dialog"

export default function AdminNewsPage() {
  const router = useRouter()
  const { loading, authorized, signOut } = useAdminAccess(["admin", "news_statements"])
  const { toast } = useToast()

  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
    category: "أخبار",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [showBackupMenu, setShowBackupMenu] = useState(false)
  const [showHeroImageDialog, setShowHeroImageDialog] = useState(false)
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)
  const [heroImagePreview, setHeroImagePreview] = useState<string>("")
  const [currentHeroImage, setCurrentHeroImage] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (authorized) {
      loadNews()
      loadHeroImage()
    }
  }, [authorized])

  const loadNews = async () => {
    console.log("[v0] Loading news from Supabase...")
    const newsData = await getNews()
    console.log("[v0] News loaded:", newsData)
    setArticles(Array.isArray(newsData) ? newsData : [])
  }

  const loadHeroImage = async () => {
    const pageContent = await getPageContent("news")
    setCurrentHeroImage(pageContent?.heroImage ?? null)
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/admin/login")
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

    try {
      if (editingId) {
        const updated = await updateNews(editingId, {
          ...formData,
          id: editingId,
        } as NewsArticle)

        if (!updated) {
          throw new Error("فشل تحديث الخبر")
        }

        toast({
          title: "تم تحديث الخبر",
          description: "تم حفظ التعديلات بنجاح",
          variant: "success",
        })
        setEditingId(null)
      } else {
        const created = await addNews({
          ...formData,
          date: new Date().toISOString().split("T")[0],
        })

        if (!created) {
          throw new Error("فشل إضافة الخبر")
        }

        toast({
          title: "تم إضافة الخبر",
          description: "تم نشر الخبر بنجاح",
          variant: "success",
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "تعذر حفظ الخبر",
        description: error.message || "حدث خطأ أثناء حفظ البيانات",
      })
      return
    }

    setFormData({
      title: "",
      description: "",
      content: "",
      image: "",
      category: "أخبار",
    })
    setImagePreview("")
    setShowForm(false)
    await loadNews()
  }

  const handleEdit = (article: NewsArticle) => {
    setFormData({
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.image,
      category: article.category,
    })
    setImagePreview(article.image)
    setEditingId(article.id)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)

    try {
      const success = await deleteNews(deleteTarget.id)
      if (!success) {
        throw new Error("تعذر حذف الخبر")
      }

      toast({
        title: "تم حذف الخبر",
        description: `${deleteTarget.title} تم حذفه بنجاح`,
        variant: "success",
      })
      setDeleteTarget(null)
      await loadNews()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "فشل حذف الخبر",
        description: error.message || "حدث خطأ أثناء حذف الخبر",
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      content: "",
      image: "",
      category: "أخبار",
    })
    setImagePreview("")
  }

  const handleExportNews = () => {
    exportNewsToFile()
    setShowBackupMenu(false)
    toast({
      title: "تم إنشاء النسخة الاحتياطية",
      description: "تم تصدير الأخبار في ملف JSON",
      variant: "success",
    })
  }

  const handleImportNews = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const success = await importNewsFromFile(file)
      if (success) {
        loadNews()
        toast({
          title: "تم الاستيراد",
          description: "تم استيراد الأخبار بنجاح",
        })
      } else {
        toast({
          variant: "destructive",
          title: "فشل الاستيراد",
          description: "تأكد من صحة ملف النسخة الاحتياطية ثم حاول مجدداً",
        })
      }
      setShowBackupMenu(false)
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

      setHeroImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setHeroImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveHeroImage = async () => {
    if (!heroImageFile) return

    try {
      console.log("[v0] Uploading hero image for news page...")

      // حذف الصورة القديمة إذا كانت موجودة في Supabase Storage
      if (currentHeroImage && currentHeroImage.includes("supabase.co/storage")) {
        console.log("[v0] Deleting old hero image...")
        await deleteImageFromStorage(currentHeroImage)
      }

      const imageUrl = await uploadImageToStorage(heroImageFile, "news")
      if (!imageUrl) {
        throw new Error("تعذر رفع الصورة")
      }
      console.log("[v0] Image uploaded successfully:", imageUrl)

      await updatePageContent("news", { heroImage: imageUrl })
      console.log("[v0] Page content updated successfully")

      setCurrentHeroImage(imageUrl)
      setShowHeroImageDialog(false)
      setHeroImageFile(null)
      setHeroImagePreview("")

      // إعادة تحميل البيانات
      await loadHeroImage()

      toast({
        title: "تم الحفظ",
        description: "تم حفظ الصورة الخلفية بنجاح",
      })
    } catch (error) {
      console.error("[v0] Error saving hero image:", error)
      toast({
        variant: "destructive",
        title: "خطأ أثناء الحفظ",
        description: "حدث خطأ أثناء حفظ الصورة",
      })
    }
  }

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
            <p className="text-gray-600">لا تمتلك الصلاحية لإدارة الأخبار. يرجى تسجيل الدخول بحساب مختلف.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">إدارة الأخبار</h1>
          <div className="flex flex-wrap gap-2 justify-end">
            <Link href="/admin">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowRight size={18} />
                العودة إلى لوحة التحكم
              </Button>
            </Link>
            <Button variant="outline" onClick={() => setShowHeroImageDialog(true)} className="gap-2">
              <ImageIcon size={20} />
              صورة الخلفية العلوية
            </Button>
            <div className="relative">
              <Button variant="outline" onClick={() => setShowBackupMenu(!showBackupMenu)} className="gap-2">
                <Download size={20} />
                نسخ احتياطي
              </Button>
              {showBackupMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleExportNews}
                    className="w-full px-4 py-2 text-right hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Download size={16} />
                    تصدير الأخبار
                  </button>
                  <label className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                    <FileUp size={16} />
                    استيراد الأخبار
                    <input type="file" accept=".json" onChange={handleImportNews} className="hidden" />
                  </label>
                </div>
              )}
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus size={20} />
                خبر جديد
              </Button>
            )}
          </div>
        </div>

        {showHeroImageDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">صورة الخلفية العلوية</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowHeroImageDialog(false)
                    setHeroImageFile(null)
                    setHeroImagePreview("")
                  }}
                >
                  <X size={20} />
                </Button>
              </div>

              {currentHeroImage && !heroImagePreview && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">الصورة الحالية:</p>
                  <div className="relative h-64 rounded-lg overflow-hidden border">
                    <Image
                      src={currentHeroImage || "/placeholder.svg"}
                      alt="صورة الخلفية الحالية"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">رفع صورة جديدة:</p>
                {!heroImagePreview ? (
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
                      <span className="text-sm text-gray-600">اضغط لاختيار صورة</span>
                      <span className="text-xs text-gray-500">PNG, JPG, GIF حتى 5MB (سيتم تحسين الحجم تلقائياً)</span>
                    </label>
                  </div>
                ) : (
                  <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                    <div className="relative h-64">
                      <img
                        src={heroImagePreview || "/placeholder.svg"}
                        alt="معاينة"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHeroImageFile(null)
                        setHeroImagePreview("")
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSaveHeroImage} disabled={!heroImageFile} className="flex-1">
                  حفظ الصورة
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowHeroImageDialog(false)
                    setHeroImageFile(null)
                    setHeroImagePreview("")
                  }}
                  className="flex-1 bg-transparent"
                >
                  إلغاء
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingId ? "تعديل الخبر" : "إضافة خبر جديد"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل عنوان الخبر"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="وصف قصير للخبر"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المحتوى</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  placeholder="محتوى الخبر الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">صورة الخبر</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>أخبار</option>
                  <option>تدريب</option>
                  <option>فعاليات</option>
                  <option>بيانات</option>
                </select>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  {editingId ? "حفظ التعديلات" : "إضافة الخبر"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  إلغاء
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* News List */}
        <div className="space-y-4">
          {!Array.isArray(articles) || articles.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 mb-4">لا توجد أخبار حالياً</p>
              <Button onClick={() => setShowForm(true)}>إضافة أول خبر</Button>
            </Card>
          ) : (
            articles.map((article) => (
              <Card key={article.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-3">{article.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{article.category}</span>
                      <span>{new Date(article.date).toLocaleDateString("ar-JO")}</span>
                      <span>{article.views} مشاهدة</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(article)} className="gap-2">
                      <Edit2 size={16} />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteTarget(article)}
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
        title="تأكيد حذف الخبر"
        description={deleteTarget ? `سيتم حذف "${deleteTarget.title}" بشكل نهائي.` : ""}
        confirmLabel="حذف الخبر"
        cancelLabel="تراجع"
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </div>
  )
}
