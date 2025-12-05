import { Card } from "@/components/ui/card"
import Link from "next/link"
import { TrendingUp, GraduationCap, MapPin, Facebook } from "lucide-react"
import Image from "next/image"
import { getAllSections } from "@/lib/pages-storage"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

export const revalidate = 60 // Cache for 60 seconds

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
            <div className="text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)' }}>البرنامج الاقتصادي</div>
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

      <SiteFooter />
    </div>
  )
}
