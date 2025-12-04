import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase configuration missing on server")
  }

  return createServiceClient(supabaseUrl, serviceRoleKey)
}

export async function GET() {
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase.from("statements").select("*").order("date", { ascending: false })

    if (error) {
      console.error("[v0] Failed to load statements:", error)
      return NextResponse.json({ error: "تعذر تحميل البيانات" }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    console.error("[v0] Unexpected GET /admin/statements error:", error)
    return NextResponse.json({ error: "تعذر تحميل البيانات" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getServiceClient()
    const body = await request.json()
    const { title, description, content, image } = body

    if (!title || !description || !content || !image) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    const dateValue = body.date || new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("statements")
      .insert({
        title,
        description,
        content,
        image,
        date: dateValue,
        views: 0,
      })
      .select("*")
      .single()

    if (error) {
      console.error("[v0] Failed to add statement:", error)
      return NextResponse.json({ error: "تعذر إضافة البيان" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Unexpected POST /admin/statements error:", error)
    return NextResponse.json({ error: "تعذر إضافة البيان" }, { status: 500 })
  }
}

