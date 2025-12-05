import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nationalId = searchParams.get("nationalId")

    if (!nationalId || nationalId.trim().length !== 10) {
      return NextResponse.json({ exists: false })
    }

    const supabase = await createServerSupabase()

    const { data, error } = await supabase
      .from("join_applications")
      .select("id")
      .eq("national_id", nationalId.trim())
      .maybeSingle()

    if (error) {
      console.error("[check-national-id] Error:", error)
      return NextResponse.json({ exists: false })
    }

    return NextResponse.json({ exists: !!data })
  } catch (error) {
    console.error("[check-national-id] Unexpected error:", error)
    return NextResponse.json({ exists: false })
  }
}

