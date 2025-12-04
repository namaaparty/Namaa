import { createClient as createServerSupabase } from "@/lib/supabase/server"
import ActivitiesClient from "./activities-client"

export const revalidate = 0

type SupabaseServerClient = Awaited<ReturnType<typeof createServerSupabase>>

async function getHeroImage(supabase: SupabaseServerClient) {
  const { data } = await supabase
    .from("page_content")
    .select("hero_image")
    .eq("page_id", "activities")
    .maybeSingle()

  return data?.hero_image || "/images/public-event.jpg"
}

async function getActivities(supabase: SupabaseServerClient) {
  const { data, error } = await supabase.from("activities").select("*").order("date", { ascending: false })

  if (error) {
    if ((error as { code?: string }).code !== "PGRST205") {
    console.error("Error loading activities:", error)
    }
    return []
  }

  return data || []
}

export default async function ActivitiesPage() {
  const supabase = await createServerSupabase()
  const [heroImage, activitiesData] = await Promise.all([getHeroImage(supabase), getActivities(supabase)])

  const activities = activitiesData.map((item: any) => ({
    id: item.id,
    src: item.image || "/placeholder.svg",
    title: item.title,
    description: item.description,
    date: item.date,
    location: item.location,
    views: item.views || 0,
  }))

  return <ActivitiesClient heroImage={heroImage} activities={activities} />
}
