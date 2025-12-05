"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Loader2,
  LogOut,
  Lock,
  User,
} from "lucide-react"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface JoinApplication {
  id: string
  national_id: string
  phone: string
  title: string
  full_name: string
  birth_date: string
  gender: string
  marital_status: string
  id_expiry: string
  email: string
  governorate: string
  district: string
  election_district: string
  address: string
  qualification: string
  major: string
  university: string
  graduation_year: string
  profession: string
  workplace: string
  job_title: string
  experience: string
  party_membership: string
  previous_party: string
  resignation_date: string
  id_front_url: string | null
  id_back_url: string | null
  resignation_url: string | null
  clearance_url: string | null
  photo_url: string | null
  status: "pending" | "approved" | "rejected"
  submitted_at: string
  reviewed_by: string | null
  reviewed_at: string | null
  notes: string | null
}

const STATUS_LABELS = {
  pending: "قيد المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
}

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
}

export default function JoinApplicationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { loading: authLoading, authorized, signOut } = useAdminAccess(["admin"])

  const [applications, setApplications] = useState<JoinApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<JoinApplication | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (authorized) {
      fetchApplications()
    }
  }, [authorized, statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const url = `/api/admin/join-applications${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`
      const response = await fetch(url, { cache: "no-store" })
      
      if (!response.ok) {
        throw new Error("فشل تحميل الطلبات")
      }

      const data = await response.json()
      setApplications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[join-applications] Error fetching:", error)
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "تعذر تحميل طلبات الانتساب",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: "pending" | "approved" | "rejected", notes?: string) => {
    try {
      setUpdating(true)
      const response = await fetch("/api/admin/join-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, notes }),
      })

      const result = await response.json()
      console.log("[join-admin] Update response:", result)

      if (!response.ok) {
        throw new Error(result.error || "فشل تحديث الحالة")
      }

      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الطلب بنجاح",
      })

      fetchApplications()
      setDetailsOpen(false)
    } catch (error) {
      console.error("[join-applications] Error updating:", error)
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "تعذر تحديث حالة الطلب",
      })
    } finally {
      setUpdating(false)
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      app.full_name.toLowerCase().includes(query) ||
      app.national_id.includes(query) ||
      app.phone.includes(query) ||
      app.email?.toLowerCase().includes(query)
    )
  })

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
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
            <CardDescription>لا تمتلك الصلاحية لإدارة طلبات الانتساب.</CardDescription>
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <p className="text-sm text-muted-foreground">إدارة طلبات الانتساب</p>
              <h1 className="text-2xl font-bold">طلبات العضوية</h1>
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

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>البحث والتصفية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>البحث</Label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث بالاسم، الرقم الوطني، الهاتف، أو البريد..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الحالة</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الطلبات</SelectItem>
                    <SelectItem value="pending">قيد المراجعة</SelectItem>
                    <SelectItem value="approved">مقبول</SelectItem>
                    <SelectItem value="rejected">مرفوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>طلبات الانتساب ({filteredApplications.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchApplications}>
                تحديث
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                لا توجد طلبات تطابق معايير البحث
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map((app) => (
                  <Card
                    key={app.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedApplication(app)
                      setDetailsOpen(true)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg mb-1">{app.full_name}</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                              <p>الرقم الوطني: {app.national_id}</p>
                              <p>الهاتف: {app.phone}</p>
                              <p>المحافظة: {app.governorate}</p>
                              <p>
                                تاريخ التقديم: {new Date(app.submitted_at).toLocaleDateString("en-GB")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${STATUS_COLORS[app.status]} border`}>
                          {STATUS_LABELS[app.status]}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Application Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">تفاصيل طلب الانتساب</DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <span>
                  تم التقديم في {new Date(selectedApplication.submitted_at).toLocaleDateString("ar-JO")}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge className={`${STATUS_COLORS[selectedApplication.status]} border text-base px-4 py-2`}>
                  {STATUS_LABELS[selectedApplication.status]}
                </Badge>
                <div className="flex gap-2">
                  {selectedApplication.status !== "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-green-700 border-green-300 hover:bg-green-50"
                      onClick={() => handleUpdateStatus(selectedApplication.id, "approved")}
                      disabled={updating}
                    >
                      <CheckCircle className="w-4 h-4" />
                      قبول
                    </Button>
                  )}
                  {selectedApplication.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-red-700 border-red-300 hover:bg-red-50"
                      onClick={() => handleUpdateStatus(selectedApplication.id, "rejected")}
                      disabled={updating}
                    >
                      <XCircle className="w-4 h-4" />
                      رفض
                    </Button>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  البيانات الشخصية
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">الاسم الكامل:</span>
                    <p className="font-semibold">{selectedApplication.full_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الرقم الوطني:</span>
                    <p className="font-semibold">{selectedApplication.national_id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">رقم الهاتف:</span>
                    <p className="font-semibold">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">البريد الإلكتروني:</span>
                    <p className="font-semibold">{selectedApplication.email || "غير متوفر"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">تاريخ الميلاد:</span>
                    <p className="font-semibold">{selectedApplication.birth_date}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الجنس:</span>
                    <p className="font-semibold">{selectedApplication.gender === "male" ? "ذكر" : "أنثى"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الحالة الاجتماعية:</span>
                    <p className="font-semibold">{selectedApplication.marital_status}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">المحافظة:</span>
                    <p className="font-semibold">{selectedApplication.governorate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">اللواء:</span>
                    <p className="font-semibold">{selectedApplication.district}</p>
                  </div>
                  {selectedApplication.address && (
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">العنوان:</span>
                      <p className="font-semibold">{selectedApplication.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Education and Work */}
              <div>
                <h3 className="text-lg font-bold mb-3">التعليم والوظيفة</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">المؤهل العلمي:</span>
                    <p className="font-semibold">{selectedApplication.qualification || "غير متوفر"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">التخصص:</span>
                    <p className="font-semibold">{selectedApplication.major || "غير متوفر"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">المهنة:</span>
                    <p className="font-semibold">{selectedApplication.profession || "غير متوفر"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">جهة العمل:</span>
                    <p className="font-semibold">{selectedApplication.workplace || "غير متوفر"}</p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="text-lg font-bold mb-3">المرفقات</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedApplication.id_front_url && (
                    <Button variant="outline" asChild className="justify-start">
                      <a href={selectedApplication.id_front_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        الهوية (أمامي)
                      </a>
                    </Button>
                  )}
                  {selectedApplication.id_back_url && (
                    <Button variant="outline" asChild className="justify-start">
                      <a href={selectedApplication.id_back_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        الهوية (خلفي)
                      </a>
                    </Button>
                  )}
                  {selectedApplication.photo_url && (
                    <Button variant="outline" asChild className="justify-start">
                      <a href={selectedApplication.photo_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        الصورة الشخصية
                      </a>
                    </Button>
                  )}
                  {selectedApplication.resignation_url && (
                    <Button variant="outline" asChild className="justify-start">
                      <a href={selectedApplication.resignation_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        الاستقالة
                      </a>
                    </Button>
                  )}
                  {selectedApplication.clearance_url && (
                    <Button variant="outline" asChild className="justify-start">
                      <a href={selectedApplication.clearance_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        عدم المحكومية
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="text-base font-bold mb-2 block">ملاحظات المراجع</Label>
                <Textarea
                  placeholder="أضف ملاحظات حول هذا الطلب..."
                  defaultValue={selectedApplication.notes || ""}
                  className="min-h-[100px]"
                  onBlur={(e) => {
                    if (e.target.value !== selectedApplication.notes) {
                      handleUpdateStatus(selectedApplication.id, selectedApplication.status, e.target.value)
                    }
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

