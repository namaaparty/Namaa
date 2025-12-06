import StatementsClient from "./statements-client"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { getStatements } from "@/lib/statements-storage"

export const revalidate = 30 // Cache for 30 seconds

export default async function StatementsPage() {
  const supabase = await createServerSupabase()
  const statements = await getStatements()

  let heroImage = "/images/hero-event.jpg"
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("hero_image")
      .eq("page_id", "statements")
      .maybeSingle()

    if (!error && data?.hero_image) {
      heroImage = data.hero_image
    }
  } catch (err) {
    console.error("[v0] Failed to load hero image:", err)
  }

  return <StatementsClient statements={Array.isArray(statements) ? statements : []} heroImage={heroImage} />
}
