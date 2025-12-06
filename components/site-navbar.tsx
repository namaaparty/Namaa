"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/login-button"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/vision", label: "رؤية الحزب" },
  { href: "/leadership", label: "القيادات التنفيذية" },
  { href: "/local-development", label: "البرنامج الاقتصادي" },
  { href: "/news", label: "أخبار الحزب" },
  { href: "/statements", label: "البيانات الصادرة" },
  { href: "/activities", label: "النشاطات" },
  { href: "/branches", label: "فروع الحزب" },
  { href: "/join", label: "طلب الانتساب", accent: true },
]

interface SiteNavbarProps {
  className?: string
}

export function SiteNavbar({ className }: SiteNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavigate = () => setMobileMenuOpen(false)

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b h-20", className)}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex-shrink-0 h-12" aria-label="الصفحة الرئيسية" prefetch={true}>
              <div className="relative h-12 w-[165px]">
                <Image
                  src="/logo-horizontal.png"
                  alt="حزب نماء"
                  fill
                  sizes="165px"
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} prefetch={true}>
                  {link.accent ? (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {link.label}
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm">
                      {link.label}
                    </Button>
                  )}
                </Link>
              ))}
              <LoginButton variant="outline" size="sm" />
            </nav>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md hover:bg-primary/10 transition-colors"
              aria-label="القائمة"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-sm mt-20">
          <nav className="flex flex-col gap-2 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavigate}
                prefetch={true}
                className={cn(
                  "px-4 py-3 rounded-md transition-colors text-foreground cursor-pointer",
                  link.accent ? "bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white" : "hover:bg-primary/10",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4">
              <LoginButton
                variant="outline"
                size="sm"
                fullWidth
                className="justify-center"
                onClick={handleNavigate}
              />
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

