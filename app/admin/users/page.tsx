"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Key, Mail, Shield, LogOut, ArrowLeft, Lock, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "@/components/confirm-dialog"

interface Admin {
  id: string
  username: string
  full_name: string
  email: string
  role: string
  created_at: string
}

export default function UsersManagement() {
  const router = useRouter()
  const { loading: authLoading, authorized, signOut } = useAdminAccess(["admin"])

  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [editUsername, setEditUsername] = useState("")
  const [showEditUsername, setShowEditUsername] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    email: "",
    role: "pages_admin",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (authorized) {
      loadAdmins()
    }
  }, [authorized])

  const handleLogout = async () => {
    await signOut()
    router.push("/admin/login")
  }

  const loadAdmins = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setAdmins(data)
      }
    } catch (error) {
      console.error("[v0] Error loading admins:", error)
      toast({
        title: "خطأ",
        description: "فشل تحميل المستخدمين",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!selectedAdmin || !newPassword || !confirmPassword) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/admin/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedAdmin, newPassword }),
      })

      if (response.ok) {
        const targetAdmin = admins.find((admin) => admin.id === selectedAdmin)
        toast({
          title: "تم تغيير كلمة المرور",
          description: targetAdmin
            ? `تم تحديث كلمة مرور ${targetAdmin.full_name} بنجاح.`
            : "تم تغيير كلمة المرور للمستخدم المحدد بنجاح.",
          variant: "success",
        })
        setSelectedAdmin(null)
        setNewPassword("")
        setConfirmPassword("")
      } else {
        throw new Error("Failed to change password")
      }
    } catch (error) {
      console.error("[v0] Error changing password:", error)
      toast({
        title: "خطأ",
        description: "فشل تغيير كلمة المرور",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedAdmin) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار مستخدم أولاً",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/admin/users/${selectedAdmin}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "فشل حذف المستخدم")
      }

      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم نهائياً من النظام.",
        variant: "success",
      })

      setSelectedAdmin(null)
      setEditUsername("")
      setNewPassword("")
      setConfirmPassword("")
      await loadAdmins()
      setDeleteDialogOpen(false)
    } catch (error: any) {
      console.error("[v0] Error deleting user:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل حذف المستخدم",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditUsername = async () => {
    if (!selectedAdmin || !editUsername) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم الجديد",
        variant: "destructive",
      })
      return
    }

    if (editUsername.length < 3) {
      toast({
        title: "خطأ",
        description: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/admin/users/edit-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedAdmin, newUsername: editUsername }),
      })

      const data = await response.json()

      if (response.ok) {
        const targetAdmin = admins.find((admin) => admin.id === selectedAdmin)
        toast({
          title: "تم تحديث اسم المستخدم",
          description: targetAdmin
            ? `تم تغيير اسم المستخدم لـ ${targetAdmin.full_name} بنجاح.`
            : "تم تحديث اسم المستخدم للمستخدم المحدد بنجاح.",
          variant: "success",
        })
        setSelectedAdmin(null)
        setEditUsername("")
        setShowEditUsername(false)
        loadAdmins()
      } else {
        throw new Error(data.error || "Failed to edit username")
      }
    } catch (error: any) {
      console.error("[v0] Error editing username:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل تغيير اسم المستخدم",
        variant: "destructive",
      })
    }
  }

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.full_name || !newUser.email) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      })
      return
    }

    if (newUser.password.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          full_name: newUser.full_name,
          email: newUser.email,
          role: newUser.role,
        }),
      })

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم إضافة المستخدم بنجاح",
          variant: "success",
        })
        setShowAddUser(false)
        setNewUser({
          username: "",
          password: "",
          confirmPassword: "",
          full_name: "",
          email: "",
          role: "pages_admin",
        })
        loadAdmins()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to add user")
      }
    } catch (error: any) {
      console.error("[v0] Error adding user:", error)
      toast({
        title: "خطأ",
        description: error.message || "فشل إضافة المستخدم",
        variant: "destructive",
      })
    }
  }

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      news_admin: "إدارة الأخبار والبيانات",
      pages_admin: "إدارة المحتوى",
      activities_admin: "إدارة النشاطات",
      super_admin: "مدير عام",
    }
    return roles[role] || role
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <p className="text-muted-foreground">جاري التحقق من الصلاحيات...</p>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">إدارة المستخدمين</CardTitle>
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>هذه الصفحة محمية. يجب تسجيل الدخول كمدير عام للوصول إليها.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Lock className="w-12 h-12 text-primary mx-auto" />
            <p className="text-muted-foreground">لا تمتلك الصلاحية للوصول إلى إدارة المستخدمين.</p>
            <Link href="/admin/login">
              <Button className="w-full">الانتقال إلى صفحة تسجيل الدخول</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">إدارة المستخدمين</h1>
            <p className="text-muted-foreground">عرض وإدارة المستخدمين الإداريين</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة إلى لوحة التحكم
              </Button>
            </Link>
            <Button onClick={() => setShowAddUser(!showAddUser)}>
              <User className="w-4 h-4 ml-2" />
              {showAddUser ? "إلغاء" : "إضافة مستخدم"}
            </Button>
          </div>
        </div>

        {showAddUser && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                إضافة مستخدم جديد
              </CardTitle>
              <CardDescription>أدخل بيانات المستخدم الجديد</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-username">اسم المستخدم *</Label>
                  <Input
                    id="new-username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="اسم المستخدم"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-fullname">الاسم الكامل *</Label>
                  <Input
                    id="new-fullname"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    placeholder="الاسم الكامل"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-email">البريد الإلكتروني *</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="admin@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-role">الصلاحية *</Label>
                <select
                  id="new-role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="pages_admin">إدارة المحتوى</option>
                  <option value="news_admin">إدارة الأخبار والبيانات</option>
                  <option value="activities_admin">إدارة النشاطات</option>
                  <option value="super_admin">مدير عام</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">كلمة المرور *</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="6 أحرف على الأقل"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-confirm-password">تأكيد كلمة المرور *</Label>
                  <Input
                    id="new-confirm-password"
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                    placeholder="أعد إدخال كلمة المرور"
                  />
                </div>
              </div>

              <Button onClick={handleAddUser} className="w-full">
                <User className="w-4 h-4 ml-2" />
                إضافة المستخدم
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* قائمة المستخدمين */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                المستخدمون الإداريون
              </CardTitle>
              <CardDescription>{admins.length} مستخدم إداري</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {admins.map((admin) => (
                <Card
                  key={admin.id}
                  className={`cursor-pointer transition-all ${
                    selectedAdmin === admin.id ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => setSelectedAdmin(admin.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold">{admin.full_name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-3 h-3" />
                            {admin.username}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {admin.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-3 h-3" />
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10">{getRoleLabel(admin.role)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* تعديل المستخدم */}
          <div className="space-y-6">
            {/* تعديل اسم المستخدم */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  تعديل اسم المستخدم
                </CardTitle>
                <CardDescription>
                  {selectedAdmin ? "تعديل اسم المستخدم المحدد" : "اختر مستخدماً من القائمة"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAdmin ? (
                  <>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm font-medium">
                        المستخدم المحدد: {admins.find((a) => a.id === selectedAdmin)?.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        اسم المستخدم الحالي: {admins.find((a) => a.id === selectedAdmin)?.username}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="editUsername">اسم المستخدم الجديد</Label>
                      <Input
                        id="editUsername"
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        placeholder="أدخل اسم المستخدم الجديد (3 أحرف على الأقل)"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleEditUsername} className="flex-1">
                        <User className="w-4 h-4 ml-2" />
                        تعديل اسم المستخدم
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditUsername("")
                        }}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>اختر مستخدماً من القائمة لتعديل اسم المستخدم</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* تغيير كلمة المرور */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  تغيير كلمة المرور
                </CardTitle>
                <CardDescription>
                  {selectedAdmin ? "اختر كلمة مرور جديدة للمستخدم المحدد" : "اختر مستخدماً من القائمة"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAdmin ? (
                  <>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm font-medium">
                        المستخدم المحدد: {admins.find((a) => a.id === selectedAdmin)?.full_name}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="أعد إدخال كلمة المرور"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleChangePassword} className="flex-1">
                        <Key className="w-4 h-4 ml-2" />
                        تغيير كلمة المرور
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedAdmin(null)
                          setNewPassword("")
                          setConfirmPassword("")
                        }}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Key className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>اختر مستخدماً من القائمة لتغيير كلمة المرور</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* حذف المستخدم */}
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="w-5 h-5" />
                  حذف المستخدم نهائياً
                </CardTitle>
                <CardDescription>
                  {selectedAdmin
                    ? "سيتم حذف المستخدم من جدول الإدارة وSupabase Auth"
                    : "اختر مستخدماً من القائمة لحذفه"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedAdmin ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm font-medium text-destructive">
                        سيتم حذف {admins.find((a) => a.id === selectedAdmin)?.full_name}
                      </p>
                      <p className="text-xs text-destructive/80 mt-1">
                        هذا الإجراء نهائي ويزيل الحساب من Supabase Auth وجداول الإدارة.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        className="flex-1 gap-2"
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? "جارٍ الحذف..." : "تأكيد الحذف"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedAdmin(null)
                        }}
                        disabled={isDeleting}
                      >
                        إلغاء التحديد
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trash2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>اختر مستخدماً من القائمة لحذفه نهائياً</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* معلومات مهمة */}
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="text-yellow-800">معلومات مهمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-yellow-800">
            <p>• كلمات المرور مشفرة في قاعدة البيانات ولا يمكن رؤيتها</p>
            <p>• كلمة المرور يجب أن تكون 6 أحرف على الأقل</p>
            <p>• اسم المستخدم يجب أن يكون فريداً ولا يمكن تكراره</p>
            <p>• يُنصح بتغيير كلمة المرور بشكل دوري للأمان</p>
            <p>• لا تشارك كلمة المرور مع أي شخص</p>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="تأكيد حذف المستخدم"
        description={
          selectedAdmin
            ? `سيتم حذف ${admins.find((a) => a.id === selectedAdmin)?.full_name || "هذا المستخدم"} من جميع الأنظمة.`
            : "يرجى اختيار مستخدم لحذفه."
        }
        confirmLabel="حذف نهائي"
        cancelLabel="تراجع"
        loading={isDeleting}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}
