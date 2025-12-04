"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

const supabase = createClient()
const REMEMBER_KEY = "namaa-admin-remember"

function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)
  const [prefilledRemember, setPrefilledRemember] = useState(false)

  const redirectTo = searchParams.get("redirect") || "/admin"

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session && isMounted) {
        router.replace(redirectTo)
        return
      }

      if (isMounted) {
        setCheckingSession(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace(redirectTo)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [redirectTo, router])

  useEffect(() => {
    if (typeof window === "undefined" || prefilledRemember) {
      return
    }

    const stored = window.localStorage.getItem(REMEMBER_KEY)
    if (!stored) {
      setPrefilledRemember(true)
      return
    }

    try {
      const parsed = JSON.parse(stored) as { email?: string; remember?: boolean }
      if (parsed.email) {
        setEmail(parsed.email)
      }
      setRememberMe(Boolean(parsed.remember))
    } catch (error) {
      window.localStorage.removeItem(REMEMBER_KEY)
    } finally {
      setPrefilledRemember(true)
    }
  }, [prefilledRemember])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError("بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.")
      setIsSubmitting(false)
      return
    }

    if (typeof window !== "undefined") {
      if (rememberMe) {
        window.localStorage.setItem(
          REMEMBER_KEY,
          JSON.stringify({
            email,
            remember: true,
          }),
        )
      } else {
        window.localStorage.removeItem(REMEMBER_KEY)
      }
    }

    router.push(redirectTo)
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>جاري التحقق من الجلسة...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f5fb] via-white to-[#eaf4ef] flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-10 text-white shadow-2xl border border-emerald-600/50">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#ffffff33,_transparent)]" aria-hidden />
          <div className="relative flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/95 p-4 shadow-xl">
                <Image src="/logo-colored.png" alt="شعار حزب نماء" width={64} height={64} priority />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.5em] text-white/70">NAMAA PARTY</p>
                <p className="text-2xl font-bold">بوابة التحكم المركزية</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-white/90">
              ندعوك لتسجيل الدخول لإدارة المحتوى الخاص بك حسب الصلاحيات الممنوحة لك. ستظل جلستك فعالة على الأجهزة
              الموثوقة عند تفعيل خيار التذكر.
            </p>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/15">
              <p className="text-sm text-white/75">معلومات الدخول</p>
              <p className="text-base font-semibold">admin@namaaparty.com</p>
              <p className="text-sm text-white/80">يرجى التواصل مع المشرف التقني لتحديث كلمات المرور والصلاحيات.</p>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-md justify-self-center shadow-2xl border border-border/60">
          <CardHeader className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">مرحباً بعودتك</p>
            <CardTitle className="text-3xl">تسجيل الدخول</CardTitle>
            <CardDescription>أدخل بيانات الاعتماد الخاصة بك للمتابعة إلى لوحة الإدارة</CardDescription>
            {searchParams.get("error") === "forbidden" && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                لا تملك الصلاحية لزيارة الصفحة المطلوبة.
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@namaaparty.com"
                  dir="ltr"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="remember" className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(Boolean(v))}
                    className="h-5 w-5 rounded-md border-2 border-emerald-600/70 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 text-white shadow-sm transition-all"
                  />
                  تذكرني على هذا الجهاز
                </label>
                <span className="text-xs text-muted-foreground">للمستخدمين المصرح لهم فقط</span>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                <LogIn className="w-4 h-4" />
                {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  العودة إلى الموقع الرئيسي
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري تحميل الصفحة...</span>
          </div>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  )
}

