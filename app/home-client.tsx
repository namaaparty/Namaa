"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Facebook, TrendingUp, Users, Settings } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { SiteNavbar } from "@/components/site-navbar"

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={counterRef} className="text-4xl lg:text-5xl font-bold text-foreground">
      {count.toLocaleString("en-US")}
    </div>
  )
}

interface HomeClientProps {
  heroImage: string
  heroVideo: string | null
  homeContent: string
  statistics: {
    total_members: number
    female_members: number
    male_members: number
    youth_members: number
  }
}

const SPLASH_SEEN_KEY = "namaa-splash-seen"

export default function HomeClient({ heroImage, heroVideo, homeContent, statistics }: HomeClientProps) {
  const [showSplash, setShowSplash] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const hasSeenSplash = window.sessionStorage.getItem(SPLASH_SEEN_KEY) === "true"
    if (hasSeenSplash) {
      return
    }

    setShowSplash(true)

    // Auto-hide after 1.2s for faster loading
    const timer = window.setTimeout(() => {
      setShowSplash(false)
      window.sessionStorage.setItem(SPLASH_SEEN_KEY, "true")
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  const safeStatistics = statistics || {
    total_members: 0,
    female_members: 0,
    male_members: 0,
    youth_members: 0,
  }
  const contentParagraphs = homeContent ? homeContent.split("\n\n") : ["مرحباً بكم في حزب نماء"]

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-zinc-200 via-gray-100 to-stone-200">
          {/* تأثير الإضاءة الخلفية */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />

          {/* نقاط الإضاءة المتحركة */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700" />

          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-1000 relative z-10">
            <div className="relative w-[600px] h-[600px] mx-auto animate-in zoom-in duration-700 delay-100">
              <Image
                src="/images/namaa-20logo-20colored-20final.png"
                alt="حزب نماء"
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                priority
              />
            </div>

            {/* النص التعريفي */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                حزب نماء
              </h1>
              <p className="text-2xl text-gray-700 font-medium">نحو اقتصاد وطني قوي</p>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-emerald-600 to-transparent rounded-full" />
            </div>

            {/* نقاط التحميل المتحركة */}
            <div className="flex justify-center gap-2 animate-in fade-in duration-700 delay-500 mt-8">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-bounce [animation-delay:0ms] shadow-lg shadow-emerald-500/50" />
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-bounce [animation-delay:150ms] shadow-lg shadow-emerald-500/50" />
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-bounce [animation-delay:300ms] shadow-lg shadow-emerald-500/50" />
            </div>
          </div>
        </div>
      )}

      <SiteNavbar />

        <section className="relative w-full h-[80vh] overflow-hidden">
          {heroVideo ? (
            <video
              src={heroVideo}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : typeof heroImage === "string" && heroImage.startsWith("data:") ? (
            <img
              src={heroImage || "/placeholder.svg"}
              alt="حزب نماء - نحو اقتصاد وطني قوي"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Image
              src={heroImage || "/placeholder.svg"}
              alt="حزب نماء - نحو اقتصاد وطني قوي"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        </section>

        <section className="py-8 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-xl lg:text-3xl text-center font-bold text-foreground leading-relaxed">
              حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة
            </div>
          </div>
        </section>

        <section className="py-12 bg-background lg:py-4">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12 space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">عن حزب نماء</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {contentParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="text-lg text-muted-foreground leading-relaxed text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* قسم الإحصائيات */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gradient">إنجازاتنا بالأرقام</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {[
                { label: "عدد الأعضاء", value: safeStatistics.total_members, icon: Users },
                { label: "إناث", value: safeStatistics.female_members, icon: Users },
                { label: "ذكور", value: safeStatistics.male_members, icon: Users },
                { label: "شباب (18-35)", value: safeStatistics.youth_members, icon: TrendingUp },
              ].map((stat, idx) => (
                <div key={idx}>
                  <Card className="p-8 text-center hover:shadow-xl transition-all border-2 hover:border-primary/50 bg-gradient-to-br from-background to-secondary/20">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full bg-primary/10">
                        <stat.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <AnimatedCounter end={stat.value} />
                    <p className="text-muted-foreground mt-3 font-medium">{stat.label}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/10 lg:py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12 space-y-6">
              <p className="text-2xl lg:text-4xl text-primary font-bold">حزب نماء بالأرقام</p>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                نمو معاً لبناء مستقبل أفضل للأردن
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-16">
              <Link href="/news">
                <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer group bg-primary/5">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">أخبار الحزب</h3>
                  <p className="text-muted-foreground">تابع آخر الأخبار والفعاليات</p>
                </Card>
              </Link>
              <Link href="/activities">
                <Card className="p-8 text-center hover:shadow-xl transition-all cursor-pointer group">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">النشاطات</h3>
                  <p className="text-muted-foreground">اطلع على نشاطات الحزب المختلفة</p>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        <footer className="bg-secondary/30 border-t py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <Link href="/" className="inline-block">
                  <Image
                    src="/logo-horizontal.png"
                    alt="حزب نماء"
                    width={200}
                    height={50}
                    className="h-14 w-auto object-contain"
                  />
                </Link>
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm leading-relaxed font-semibold">
                    حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة
                  </p>
                  <p className="text-muted-foreground text-sm font-semibold">نهضة تنموية اقتصادية شاملة</p>
                  <p className="text-muted-foreground text-xs">نمو – عدالة – تأهيل – تشغيل – تطوير</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">روابط سريعة</h3>
                <div className="flex flex-col gap-2">
                  <Link href="/vision" className="text-muted-foreground hover:text-primary transition-colors">
                    رؤية الحزب
                  </Link>
                  <Link
                    href="/local-development"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    البرنامج الاقتصادي
                  </Link>
                  <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                    الأخبار
                  </Link>
                  <Link href="/statements" className="text-muted-foreground hover:text-primary transition-colors">
                    البيانات الصادرة
                  </Link>
                  <Link href="/budgets" className="text-muted-foreground hover:text-primary transition-colors">
                    ميزانيات الحزب
                  </Link>
                <Link href="/constitution" className="text-muted-foreground hover:text-primary transition-colors">
                  النظام الرئيسي
                </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">روابط هامة</h3>
                <div className="flex flex-col gap-2">
                  <Link href="/branches" className="text-muted-foreground hover:text-primary transition-colors">
                    فروع الحزب
                  </Link>
                  <Link href="/leadership" className="text-muted-foreground hover:text-primary transition-colors">
                    القيادات التنفيذية
                  </Link>
                  <Link href="/activities" className="text-muted-foreground hover:text-primary transition-colors">
                    نشاطات الحزب
                  </Link>
                  <Link href="/join" className="text-muted-foreground hover:text-primary transition-colors">
                    طلب الانتساب
                  </Link>
                  <a
                    href="https://iec.jo/ar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    الهيئة المستقلة للانتخاب
                  </a>
                  <a
                    href="https://jordan.gov.jo/AR/List/%D8%A7%D9%84%D8%AC%D9%87%D8%A7%D8%AA_%D8%A7%D9%84%D8%AD%D9%83%D9%88%D9%85%D9%8A%D8%A9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    موقع الحكومة الأردنية
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">تواصل معنا</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <a href="mailto:info@namaaparty.com" className="hover:text-primary transition-colors">
                      info@namaaparty.com
                    </a>
                  </p>
                  <p>
                    <a href="tel:+962770449644" className="hover:text-primary transition-colors">
                      رقم الهاتف: 0770449644
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://wa.me/962770449644"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      واتساب: 0770449644
                    </a>
                  </p>
                  <p className="text-sm pt-2">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Ibrahim+Al+Naimat+Complex,+Um+Al+Summaq+St+4,+Amman"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      عمان / لواء بيادر وادي السير – شارع أم السماق امتداد شارع مكة – مجمع الفيصل – عمارة رقم (4) –
                      الطابق (1)
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <a
                    href="https://www.facebook.com/namaaparty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-[#1877F2]/10 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-[#1877F2]" />
                  </a>
                  <span className="text-sm text-muted-foreground">تابعنا على صفحتنا على الفيسبوك</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-center text-muted-foreground text-sm">
                © {new Date().getFullYear()} حزب نماء. جميع الحقوق محفوظة.
              </p>
            </div>
        </div>
      </footer>
    </>
  )
}
