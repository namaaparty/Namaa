import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nationalId = searchParams.get("nationalId")

    if (!nationalId || nationalId.trim().length !== 10) {
      return NextResponse.json({ exists: false })
    }

    // Use anonymous client to bypass session requirements
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log("[check-national-id] Searching for:", nationalId.trim())

    const { data, error } = await supabase
      .from("join_applications")
      .select("id, national_id")
      .eq("national_id", nationalId.trim())
      .maybeSingle()

    console.log("[check-national-id] Query result - data:", data, "error:", error)

    if (error) {
      console.error("[check-national-id] Error:", error)
      return NextResponse.json({ exists: false })
    }

    const exists = !!data
    console.log("[check-national-id] Exists:", exists)
    
    return NextResponse.json({ exists })
  } catch (error) {
    console.error("[check-national-id] Unexpected error:", error)
    return NextResponse.json({ exists: false })
  }
}

