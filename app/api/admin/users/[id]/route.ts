import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 })
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!serviceRoleKey || !supabaseUrl) {
      console.error("[v0] Missing Supabase env vars for admin deletion")
      return NextResponse.json({ error: "Supabase configuration missing on server" }, { status: 500 })
    }

    const supabase = createServiceClient(supabaseUrl, serviceRoleKey)

    // Delete from Supabase Auth (ignoring error if user already missing)
    const { error: authError } = await supabase.auth.admin.deleteUser(id)
    if (authError && authError?.message !== "User not found") {
      console.error("[v0] Error deleting auth user:", authError)
      return NextResponse.json({ error: "فشل حذف المستخدم من Supabase Auth" }, { status: 500 })
    }

    const { error: profilesError } = await supabase.from("profiles").delete().eq("id", id)
    if (profilesError) {
      console.error("[v0] Error deleting profile:", profilesError)
      return NextResponse.json({ error: "فشل حذف الملف الشخصي للمستخدم" }, { status: 500 })
    }

    const { error: adminsError } = await supabase.from("admins").delete().eq("id", id)
    if (adminsError) {
      console.error("[v0] Error deleting admin entry:", adminsError)
      return NextResponse.json({ error: "فشل حذف المستخدم من جدول الإدارة" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting admin user:", error)
    return NextResponse.json({ error: "فشل حذف المستخدم" }, { status: 500 })
  }
}

