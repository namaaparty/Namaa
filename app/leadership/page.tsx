import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

type SupabaseServerClient = Awaited<ReturnType<typeof createServerSupabase>>

interface Leader {
  id: string
  name: string
  position: string
  is_main: boolean
  image: string | null
  order_number: number
}

const isInlineLeaderImage = (value?: string | null) => {
  if (!value) return false
  return value.startsWith("data:") || value.startsWith("http")
}

async function resolveLeaderImages(leaders: Leader[], supabase: SupabaseServerClient): Promise<Leader[]> {
  const legacyKeys = leaders
    .filter((leader) => leader.image && !isInlineLeaderImage(leader.image))
    .map((leader) => leader.image as string)

  if (legacyKeys.length === 0) {
    return leaders
  }

  const { data, error } = await supabase
    .from("page_content")
    .select("page_id, hero_image")
    .in("page_id", legacyKeys)

  if (error) {
    console.error("Error resolving legacy leader images:", error)
    return leaders
  }

  const imageMap = new Map<string, string>()
  data?.forEach((row) => {
    if (row.hero_image) {
      imageMap.set(row.page_id, row.hero_image)
    }
  })

  return leaders.map((leader) => {
    if (leader.image && imageMap.has(leader.image)) {
      return { ...leader, image: imageMap.get(leader.image) || leader.image }
    }
    return leader
  })
}

async function getHeroImage(supabase: SupabaseServerClient): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("hero_image")
      .eq("page_id", "leadership")
      .maybeSingle()

    if (error) {
      console.error("Error loading hero image:", error)
      return "/images/leadership.jpg" // صورة افتراضية
    }

    return data?.hero_image || "/images/leadership.jpg"
  } catch (error) {
    console.error("Error in getHeroImage:", error)
    return "/images/leadership.jpg"
  }
}

async function getLeaders(supabase: SupabaseServerClient): Promise<Leader[]> {
  try {
    const { data, error } = await supabase.from("leaders").select("*").order("order_number", { ascending: true })

    if (error) {
      console.error("Error loading leaders:", error)
      return []
    }

    if (data) {
      // إزالة المكررات
      const uniqueLeaders = data.filter(
        (leader, index, self) =>
          index === self.findIndex((l) => l.name === leader.name && l.position === leader.position),
      )
      const resolvedLeaders = await resolveLeaderImages(uniqueLeaders as Leader[], supabase)
      return resolvedLeaders
    }

    return []
  } catch (error) {
    console.error("Error in getLeaders:", error)
    return []
  }
}

export default async function LeadershipPage() {
  const supabase = await createServerSupabase()
  const [heroImage, leaders] = await Promise.all([getHeroImage(supabase), getLeaders(supabase)])
  const mainLeaders = leaders.filter((l) => l.is_main)
  const assistantLeaders = leaders.filter((l) => !l.is_main)

  return (
    <main dir="rtl" className="min-h-screen bg-background relative">
      <SiteNavbar />
      <div className="relative z-10 mt-20">
        <section className="relative w-full h-[80vh] overflow-hidden">
          <Image
            src={heroImage || "/placeholder.svg"}
            alt="القيادات التنفيذية"
            fill
            className="object-cover"
            priority
            key={heroImage} // إضافة key لإعادة تحميل الصورة عند تغييرها
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)' }}>القيادات التنفيذية</h1>
              <p className="text-xl lg:text-2xl text-white/95 drop-shadow-lg">
                القادة الذين يعملون على تحقيق رؤية حزب نماء
              </p>
            </div>
          </div>
        </section>

        <section className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/10 py-6">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">القيادات التنفيذية</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                القادة الذين يعملون على تحقيق رؤية حزب نماء
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {leaders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد قيادات متاحة حالياً</p>
            </div>
          ) : (
            <>
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">الأمين العام</h2>
                <div className="flex justify-center gap-8">
                    {mainLeaders.map((leader) => (
                      <div key={leader.id} className="w-full md:w-80">
                        <Card className="h-full hover:shadow-xl transition-all border-2 hover:border-primary/50 bg-gradient-to-br from-background to-primary/5">
                          <CardHeader>
                            <div className="flex justify-center mb-4">
                              {leader.image ? (
                                <div className="relative w-32 h-40 rounded-lg overflow-hidden border-2 border-primary/20">
                                  <img
                                    src={leader.image || "/placeholder.svg"}
                                    alt={leader.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-32 h-40 rounded-lg bg-primary/10 border-2 border-primary/20" />
                              )}
                            </div>
                            <CardTitle className="text-center text-xl">{leader.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-center text-primary font-bold text-lg">{leader.position}</p>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8 text-center">مساعدو الأمين العام</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assistantLeaders.map((leader) => (
                    <div key={leader.id}>
                      <Card className="h-full hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-3">
                            {leader.image ? (
                              <div className="relative w-16 h-20 rounded overflow-hidden border border-primary/20 flex-shrink-0">
                                <img
                                  src={leader.image || "/placeholder.svg"}
                                  alt={leader.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-20 rounded bg-primary/10 border border-primary/20 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-2">{leader.name}</h3>
                              <p className="text-muted-foreground text-sm">{leader.position}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <SiteFooter />
      </div>
    </main>
  )
}
