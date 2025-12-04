import { NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createServerSupabase()
    const { error } = await supabase.auth.signOut()

    if (error) {
      if ((error as { message?: string }).message === "Auth session missing!") {
        return NextResponse.json({ success: true })
      }
      console.error("[v0] Error signing out on server:", error)
      return NextResponse.json({ error: "فشل تسجيل الخروج" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Unexpected error in POST /api/auth/signout:", error)
    return NextResponse.json({ error: "فشل تسجيل الخروج" }, { status: 500 })
  }
}

