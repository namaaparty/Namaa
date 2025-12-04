import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerSupabase()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError || !profile || profile.role !== "admin") {
      return NextResponse.json({ error: "ليس لديك صلاحية الوصول" }, { status: 403 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const queryClient =
      supabaseUrl && serviceRoleKey ? createServiceClient(supabaseUrl, serviceRoleKey) : supabase

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn(
        "[constitution-documents] SUPABASE_SERVICE_ROLE_KEY not provided, falling back to session client"
      )
    }

    const { data, error } = await queryClient
      .from("constitution_documents")
      .select("id,title,file_url,file_size,uploaded_at")
      .order("uploaded_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("[constitution-documents] Error fetching documents:", error)
      return NextResponse.json({ error: "تعذر جلب الوثائق" }, { status: 500 })
    }

    return NextResponse.json(data ?? null)
  } catch (error) {
    console.error("[constitution-documents] Unexpected error:", error)
    return NextResponse.json({ error: "تعذر جلب الوثائق" }, { status: 500 })
  }
}


