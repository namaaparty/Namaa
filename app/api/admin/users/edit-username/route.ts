import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { userId, newUsername } = await request.json()

    if (!userId || !newUsername) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (newUsername.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[v0] Missing Supabase environment variables for edit-username route")
      return NextResponse.json({ error: "Supabase credentials are not configured." }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: existingUser } = await supabase.from("admins").select("id").eq("username", newUsername).maybeSingle()

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json({ error: "اسم المستخدم موجود بالفعل" }, { status: 400 })
    }

    // تحديث اسم المستخدم
    const { error } = await supabase.from("admins").update({ username: newUsername }).eq("id", userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error editing username:", error)
    return NextResponse.json({ error: "Failed to edit username" }, { status: 500 })
  }
}
