"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogIn, LogOut, Settings, User, ChevronDown } from "lucide-react"
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
    // Show placeholder to prevent layout shift - matches login button exactly
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={cn("gap-2 pointer-events-none min-w-[120px]", fullWidth ? "w-full" : "", className)}
        style={{ visibility: 'visible', opacity: 0.6 }}
      >
        <User className="w-4 h-4" />
        <span className="whitespace-nowrap">تسجيل الدخول</span>
      </Button>
    )
  }

  if (userEmail) {
    const panelInfo = userRole ? rolePanelMap[userRole] : null
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn("gap-2", fullWidth ? "w-full" : "", className)}
          >
            <User className="w-4 h-4" />
            <span className="text-sm">{userEmail.split("@")[0]}</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-sm text-muted-foreground">{userEmail}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {panelInfo && (
            <DropdownMenuItem asChild>
              <Link href={panelInfo.href} className="flex items-center gap-2 cursor-pointer">
                <Settings className="w-4 h-4" />
                <span>{panelInfo.label}</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => {
              onClick?.()
              handleLogout()
            }}
            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

