import { getNews } from "@/lib/news-storage"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import NewsClient from "./news-client"

export const revalidate = 30 // Cache for 30 seconds for faster loads

export default async function NewsPage() {
  const supabase = await createServerSupabase()
  const articles = await getNews()

  let heroImage = "/images/public-event.jpg"
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("hero_image")
      .eq("page_id", "news")
      .maybeSingle()

    if (!error && data?.hero_image) {
      heroImage = data.hero_image
    }
  } catch (err) {
    console.error("[v0] Failed to load hero image:", err)
  }

  return <NewsClient articles={articles} heroImage={heroImage} />
}
