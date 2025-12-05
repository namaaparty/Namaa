import BranchesClient from "./branches-client"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { getPageContent } from "@/lib/pages-storage"

export const revalidate = 60 // Cache for 60 seconds

interface Branch {
  id: string
  title: string
  content: string
  order_number: number
}

export default async function BranchesPage() {
  const supabase = await createServerSupabase()
  let branches: any[] = []
  const pageData = await getPageContent("branches")
  if (pageData?.sections) {
    branches = pageData.sections
  }

  let heroImage = "/images/public-event.jpg"
  try {
    const { data, error } = await supabase
      .from("page_content")
      .select("hero_image")
      .eq("page_id", "branches")
      .maybeSingle()

    if (!error && data?.hero_image) {
      heroImage = data.hero_image
    }
  } catch (err) {
    console.error("[v0] Failed to load hero image:", err)
  }

  return <BranchesClient branches={branches} heroImage={heroImage} />
}
