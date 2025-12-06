import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const PAGE_TITLES: Record<string, string> = {
  home: "الصفحة الرئيسية",
  statements: "البيانات الصادرة",
  news: "أخبار الحزب",
  activities: "النشاطات",
  branches: "فروع الحزب",
  vision: "رؤية الحزب",
  leadership: "القيادات التنفيذية",
  "local-development": "البرنامج الاقتصادي",
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()
    const pageId = formData.get("pageId")?.toString()
    const file = formData.get("file") as File | null

    if (!pageId || !file) {
      return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 })
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${pageId}-${Date.now()}.${fileExt}`
    const filePath = `${pageId}/${fileName}`

    const { data: existingHero } = await supabase
      .from("page_content")
      .select("hero_image")
      .eq("page_id", pageId)
      .maybeSingle()

    const { error: uploadError } = await supabase.storage
      .from("hero-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      console.error("[v0] Hero upload failed:", uploadError)
      return NextResponse.json({ error: "تعذر رفع الصورة" }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("hero-images").getPublicUrl(filePath)

    const {
      data: existingPage,
      error: fetchError,
    } = await supabase.from("page_content").select("*").eq("page_id", pageId).maybeSingle()

    if (fetchError) {
      console.error("[v0] Failed to load page_content row:", fetchError)
      return NextResponse.json({ error: "تعذر حفظ صورة الخلفية" }, { status: 500 })
    }

    const pageTitle = existingPage?.page_title ?? PAGE_TITLES[pageId] ?? pageId

    const { error: updateError } = await supabase
      .from("page_content")
      .upsert(
        {
          page_id: pageId,
          page_title: pageTitle,
          hero_image: publicUrl,
          last_modified: new Date().toISOString(),
        },
        { onConflict: "page_id" },
      )

    if (updateError) {
      console.error("[v0] Failed to save hero image url:", updateError)
      return NextResponse.json({ error: "تعذر حفظ صورة الخلفية" }, { status: 500 })
    }

    if (existingHero?.hero_image && existingHero.hero_image.includes("/hero-images/")) {
      const match = existingHero.hero_image.split("/hero-images/")[1]
      if (match) {
        await supabase.storage.from("hero-images").remove([match])
      }
    }

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("[v0] Unexpected hero image error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء حفظ الصورة" }, { status: 500 })
  }
}

