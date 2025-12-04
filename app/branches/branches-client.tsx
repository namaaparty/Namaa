"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MapPin, Phone, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { SiteNavbar } from "@/components/site-navbar"

interface Branch {
  id: string
  title: string
  content: string
  order_number: number
}

interface BranchesClientProps {
  branches: Branch[]
  heroImage: string
}

export default function BranchesClient({ branches, heroImage }: BranchesClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="h-20" />

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <Image src={heroImage || "/placeholder.svg"} alt="فروع حزب نماء" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">فروع الحزب</h1>
            <p className="text-xl lg:text-2xl text-white/95 drop-shadow-lg">
              نحن في جميع محافظات المملكة لخدمة مواطنينا
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="relative z-10">
        {/* Section for Text Below Image */}
        <section className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/10 py-6">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">فروع حزب نماء</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                نحن في جميع محافظات المملكة لخدمة مواطنينا
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => {
                const parts = branch.content.split("|").map((p) => p.trim())
                const address = parts[0] || branch.content
                const phone =
                  parts
                    .find((p) => p.includes("هاتف"))
                    ?.replace("هاتف:", "")
                    .trim() || "0777884444"
                const coordinates = parts.find((p) => p.includes("°"))

                return (
                  <div
                    key={branch.id}
                    className="h-full hover:shadow-lg transition-all border-2 hover:border-primary/50"
                  >
                    <Card className="h-full hover:shadow-lg transition-all border-2 hover:border-primary/50">
                      <CardHeader>
                        <div className="flex justify-center mb-4">
                          <div className="p-4 rounded-full bg-primary/10">
                            <MapPin className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        <CardTitle className="text-center text-xl">{branch.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <p className="text-sm">{address}</p>
                        </div>
                        {coordinates && <p className="text-xs text-muted-foreground mr-6">{coordinates}</p>}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <p className="text-sm">{phone}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-secondary/30 py-16 border-t">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
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
                  <p className="text-muted-foreground text-sm leading-relaxed">
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
                  <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                    الأخبار
                  </Link>
                  <Link href="/statements" className="text-muted-foreground hover:text-primary transition-colors">
                    البيانات الصادرة
                  </Link>
                  <Link href="/constitution" className="text-muted-foreground hover:text-primary transition-colors">
                  النظام الرئيسي
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">روابط هامة</h3>
                <div className="flex flex-col gap-2">
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

            <div className="border-t pt-8 text-center border-card">
              <p className="text-sm text-muted-foreground">© 2025 حزب نماء. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
