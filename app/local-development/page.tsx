import { Card } from "@/components/ui/card"
import Link from "next/link"
import { TrendingUp, GraduationCap, MapPin, Facebook } from "lucide-react"
import Image from "next/image"
import { getAllSections } from "@/lib/pages-storage"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { SiteNavbar } from "@/components/site-navbar"

interface Section {
  id: string
  title: string
  content: string
  order_number: number
}

async function fetchPageData() {
  const supabase = await createServerSupabase()
  const sectionsData = await getAllSections("localDevelopment")

  // جلب صورة Hero من page_content
  const { data: pageData } = await supabase
    .from("page_content")
    .select("hero_image")
    .eq("page_id", "localDevelopment")
    .maybeSingle()

  return {
    sections: sectionsData || [],
    heroImage: pageData?.hero_image || "/images/meeting.jpg",
  }
}

export default async function LocalDevelopmentPage() {
  const { sections, heroImage } = await fetchPageData()

  const sortedSections = [...sections].sort((a: Section, b: Section) => a.order_number - b.order_number)
  const mainPillars = sortedSections

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="h-20" />

      {/* Hero Section with Background Image */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image src={heroImage || "/placeholder.svg"} alt="البرنامج الاقتصادي" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">البرنامج الاقتصادي</div>
            <div className="text-xl lg:text-2xl text-white/95 drop-shadow-lg">
              نحو تنمية مستدامة وازدهار اقتصادي شامل
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative pb-0">
        {/* Introduction Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 mt-5">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="text-3xl lg:text-4xl font-bold mb-6">رؤيتنا للنمو الاقتصادي</div>
            <div className="text-lg text-muted-foreground leading-relaxed">
              نؤمن بأن التنمية الحقيقية تبدأ من المجتمعات المحلية، ونعمل على تمكين المواطنين في كل منطقة لتحقيق النمو
              الاقتصادي المستدام من خلال برنامج اقتصادي شامل يرتكز على ثلاثة محاور رئيسية
            </div>
          </div>

          <div className="space-y-16">
            <div className="text-center mb-12">
              <div className="text-3xl lg:text-4xl font-bold mb-4">المحاور الرئيسية للبرنامج الاقتصادي</div>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>

            {mainPillars.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-lg text-muted-foreground">لا توجد بيانات لعرضها</div>
              </div>
            ) : (
              mainPillars.map((pillar, idx) => {
                const icons = [MapPin, TrendingUp, GraduationCap]
                const Icon = icons[idx] || MapPin

                return (
                  <div key={pillar.id} className="text-center mb-12">
                    <Card className="overflow-hidden hover:shadow-xl transition-all border-2">
                      <div className="grid lg:grid-cols-[200px_1fr] gap-0">
                        {/* Image / Number Column */}
                        <div className="relative min-h-[200px]">
                          {pillar.image ? (
                            <>
                              <Image
                                src={pillar.image || "/placeholder.svg"}
                                alt={pillar.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" aria-hidden />
                          )}
                          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4 py-6">
                            <div className="text-4xl lg:text-5xl font-bold opacity-80 mb-2">{pillar.order_number}</div>
                            {!pillar.image && <Icon className="w-10 h-10 lg:w-12 lg:h-12 mb-2" />}
                            <div className="text-lg lg:text-xl font-bold text-center">{pillar.title}</div>
                          </div>
                        </div>

                        {/* Content Column */}
                        <div className="p-6 lg:p-8">
                          <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap text-right">
                            {pillar.content}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              })
            )}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="relative bg-secondary/30 py-8 border-t">
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
                <p className="text-muted-foreground font-semibold">حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة</p>
                <p className="text-muted-foreground font-semibold">نهضة تنموية اقتصادية شاملة</p>
                <p className="text-muted-foreground text-sm">نمو – عدالة – تأهيل – تشغيل – تطوير</p>
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
                    عمان / لواء بيادر وادي السير – شارع أم السماق امتداد شارع مكة – مجمع الفيصل – عمارة رقم (4) – الطابق
                    (1)
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
          <div className="border-t pt-4 text-center border-card">
            <p className="text-sm text-muted-foreground">© 2025 حزب نماء. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
