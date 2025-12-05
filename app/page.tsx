import { getPartyStatistics, getPageContent } from "@/lib/pages-storage"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import HomeClient from "./home-client"

async function fetchData() {
  const supabase = await createServerSupabase()

  // Fetch hero image and video from database
  let heroImage = "/images/hero-event.jpg"
  let heroVideo = null
  try {
    const { data } = await supabase.from("page_content").select("hero_image, hero_video").eq("page_id", "home").maybeSingle()

    if (data?.hero_image) {
      heroImage = data.hero_image
    }
    if (data?.hero_video) {
      heroVideo = data.hero_video
    }
  } catch (error) {
    console.error("[v0] Error fetching hero media:", error)
  }

  // Fetch about content
  let aboutContent =
    "حزب نماء حزب سياسي وطني أردني يقوم على رؤية اقتصادية عميقة تهدف إلى تمكين المجتمع وبناء اقتصاد وطني قوي ومنتج يرفع مناعة الدولة ويعزز قدرتها على مواجهة التحديات. يؤمن الحزب بأن التنمية الاقتصادية والعدالة الاجتماعية وجهان لنهضة الأردن، لذلك يركز على دعم القطاعات الإنتاجية، وتمكين الشركات الصغيرة والمتوسطة، وتحفيز الابتكار والاقتصاد الرقمي، وربط التعليم بسوق العمل.\n\nويتبنّى الحزب منهجية مؤسسية قائمة على الحوكمة والشفافية وسيادة القانون، مع إعطاء مساحة واسعة لمشاركة الشباب والمرأة في قيادة المبادرات وصنع القرار. كما يسعى حزب نماء إلى بناء شراكات محلية وإقليمية تسهم في تحسين جودة الحياة وتعزيز الدور الوطني للدولة الأردنية.\n\nالحزب يطرح حلولاً عملية قابلة للتنفيذ ويحشد الطاقات الوطنية من أجل مستقبل أكثر استقراراً ونماءً."

  try {
    const pageData = await getPageContent("home")
    if (pageData?.sections) {
      const aboutSection = pageData.sections.find((s) => s.title === "عن حزب نماء")
      if (aboutSection?.content) {
        aboutContent = aboutSection.content
      }
    }
  } catch (error) {
    console.error("[v0] Error fetching page content:", error)
  }

  // Fetch party statistics
  const stats = await getPartyStatistics()

  return { heroImage, heroVideo, aboutContent, stats }
}

export default async function Home() {
  const { heroImage, heroVideo, aboutContent, stats } = await fetchData()

  return <HomeClient heroImage={heroImage} heroVideo={heroVideo} homeContent={aboutContent} statistics={stats} />
}
