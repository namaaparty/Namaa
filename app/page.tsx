import { getPartyStatistics, getPageContent } from "@/lib/pages-storage"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import HomeClient from "./home-client"

async function fetchData() {
  const supabase = await createServerSupabase()

  const defaultAboutContent =
    "حزب نماء حزب سياسي وطني أردني يقوم على رؤية اقتصادية عميقة تهدف إلى تمكين المجتمع وبناء اقتصاد وطني قوي ومنتج يرفع مناعة الدولة ويعزز قدرتها على مواجهة التحديات. يؤمن الحزب بأن التنمية الاقتصادية والعدالة الاجتماعية وجهان لنهضة الأردن، لذلك يركز على دعم القطاعات الإنتاجية، وتمكين الشركات الصغيرة والمتوسطة، وتحفيز الابتكار والاقتصاد الرقمي، وربط التعليم بسوق العمل.\n\nويتبنّى الحزب منهجية مؤسسية قائمة على الحوكمة والشفافية وسيادة القانون، مع إعطاء مساحة واسعة لمشاركة الشباب والمرأة في قيادة المبادرات وصنع القرار. كما يسعى حزب نماء إلى بناء شراكات محلية وإقليمية تسهم في تحسين جودة الحياة وتعزيز الدور الوطني للدولة الأردنية.\n\nالحزب يطرح حلولاً عملية قابلة للتنفيذ ويحشد الطاقات الوطنية من أجل مستقبل أكثر استقراراً ونماءً."

  // Parallel data fetching for better performance
  const [heroResult, aboutResult, stats] = await Promise.all([
    // Fetch hero media
    supabase.from("page_content").select("hero_image, hero_video").eq("page_id", "home").maybeSingle(),
    // Fetch only "عن حزب نماء" section
    supabase.from("page_sections").select("content").eq("page_id", "home").eq("title", "عن حزب نماء").maybeSingle(),
    // Fetch statistics
    getPartyStatistics(),
  ])

  const heroImage = heroResult.data?.hero_image || "/images/hero-event.jpg"
  const heroVideo = heroResult.data?.hero_video || null
  const aboutContent = aboutResult.data?.content || defaultAboutContent

  return { heroImage, heroVideo, aboutContent, stats }
}

export default async function Home() {
  const { heroImage, heroVideo, aboutContent, stats } = await fetchData()

  const safeStats = stats || {
    total_members: 0,
    female_members: 0,
    male_members: 0,
    youth_members: 0,
  }

  return <HomeClient heroImage={heroImage} heroVideo={heroVideo} homeContent={aboutContent} statistics={safeStats} />
}
