"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type { UserRole } from "@/hooks/use-admin-access"
import type { Session } from "@supabase/supabase-js"

interface LoginButtonProps {
  onClick?: () => void
  fullWidth?: boolean
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LoginButton({
  onClick,
  fullWidth = false,
  variant = "ghost",
  size = "sm",
  className,
}: LoginButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useMemo(() => createClient(), [])
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  const rolePanelMap: Record<UserRole, { href: string; label: string }> = {
    admin: { href: "/admin", label: "لوحة التحكم الرئيسية" },
    news_statements: { href: "/admin/news", label: "الأخبار والبيانات" },
    activities: { href: "/admin/activities", label: "إدارة النشاطات" },
  }

  useEffect(() => {
    let isMounted = true

    const applySession = async (session: Session | null) => {
      if (!isMounted) return

      if (!session) {
        setUserEmail(null)
        setUserRole(null)
        setLoading(false)
        return
      }

      setUserEmail(session.user.email ?? null)

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle()

      if (!isMounted) return

      setUserRole((profile?.role as UserRole) ?? null)
      setLoading(false)
    }

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      await applySession(session)
    }

    init()

    const {
      data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        applySession(session)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut({ scope: "local" })

      if (typeof window !== "undefined") {
        Object.keys(window.localStorage)
          .filter((key) => key.startsWith("sb-") || key.includes("supabase"))
          .forEach((key) => {
            try {
              window.localStorage.removeItem(key)
            } catch {
              // ignore
            }
          })
      }

      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error("Server logout failed")
      }
      setUserEmail(null)
      setUserRole(null)
      toast({ title: "تم تسجيل الخروج" })

      if (typeof window !== "undefined") {
        window.location.assign("/admin/login?logged_out=1")
      } else {
        router.replace("/admin/login")
      }
    } catch (error) {
      console.error("[v0] Logout error:", error)
      toast({ variant: "destructive", title: "خطأ أثناء تسجيل الخروج" })
    }
  }

  if (loading) {
    return null
  }

  if (userEmail) {
    const panelInfo = userRole ? rolePanelMap[userRole] : null
    return (
      <div className={cn(fullWidth ? "w-full flex flex-col gap-2" : "flex flex-col gap-2")}>
        {panelInfo && (
          <Link href={panelInfo.href} className={cn(fullWidth && "w-full")}>
            <Button
              variant="secondary"
              size={size}
              className={cn("gap-2", fullWidth ? "w-full justify-start" : "", className)}
              onClick={onClick}
            >
              <Settings className="w-4 h-4" />
              <div className="text-right leading-tight">
                <span>لوحة التحكم</span>
                <span className="block text-xs text-muted-foreground">{panelInfo.label}</span>
              </div>
            </Button>
          </Link>
        )}
        <Button
          variant={variant}
          size={size}
          onClick={() => {
            onClick?.()
            handleLogout()
          }}
          className={cn("gap-2", fullWidth ? "w-full justify-start" : "", className)}
        >
          <LogOut className="w-4 h-4" />
          <div className="text-right leading-tight">
            <span>تسجيل الخروج</span>
            <span className="block text-xs text-muted-foreground">{userEmail}</span>
          </div>
        </Button>
      </div>
    )
  }

  return (
    <Link href="/admin/login" onClick={onClick} className={cn(fullWidth && "w-full")}>
      <Button
        variant={variant}
        size={size}
        className={cn("gap-2", fullWidth ? "w-full justify-start" : "", className)}
      >
        <LogIn className="w-4 h-4" />
        <span>تسجيل الدخول</span>
      </Button>
    </Link>
  )
}

