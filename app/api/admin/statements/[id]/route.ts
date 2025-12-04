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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
      .update({
        title,
        description,
        content,
        image,
        date: dateValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select("*")
      .single()

    if (error) {
      console.error("[v0] Failed to update statement:", error)
      return NextResponse.json({ error: "تعذر حفظ التعديلات" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Unexpected PUT /admin/statements error:", error)
    return NextResponse.json({ error: "تعذر حفظ التعديلات" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getServiceClient()
    const { error } = await supabase.from("statements").delete().eq("id", params.id)

    if (error) {
      console.error("[v0] Failed to delete statement:", error)
      return NextResponse.json({ error: "تعذر حذف البيان" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Unexpected DELETE /admin/statements error:", error)
    return NextResponse.json({ error: "تعذر حذف البيان" }, { status: 500 })
  }
}

