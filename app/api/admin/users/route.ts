import { NextResponse } from "next/server"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

const roleMap: Record<string, "admin" | "news_statements" | "activities"> = {
  super_admin: "admin",
  pages_admin: "admin",
  news_admin: "news_statements",
  activities_admin: "activities",
}

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from("admins")
      .select("id, username, full_name, email, role, created_at")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching admins:", error)
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceRoleKey) {
      console.error("[v0] Missing Supabase env vars for admin creation")
      return NextResponse.json({ error: "Supabase configuration missing on server" }, { status: 500 })
    }

    const body = await request.json()
    const { username, password, full_name, email, role } = body
    const mappedRole = roleMap[role]

    console.log("[v0] Adding new user:", { username, full_name, email, role })

    if (!username || !password || !full_name || !email || !role) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 })
    }

    if (!mappedRole) {
      return NextResponse.json({ error: "صلاحية غير مدعومة للمستخدم الجديد" }, { status: 400 })
    }

    const supabase = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey)

    const { data: existingUser } = await supabase
      .from("admins")
      .select("username")
      .eq("username", username)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json({ error: "اسم المستخدم موجود بالفعل" }, { status: 409 })
    }

    // 1) Create user in Supabase Auth using service role
    const {
      data: createUserData,
      error: createUserError,
    } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        username,
      },
    })

    if (createUserError || !createUserData.user) {
      console.error("[v0] Error creating auth user:", createUserError)
      return NextResponse.json({ error: "فشل إنشاء حساب المستخدم في Supabase Auth" }, { status: 500 })
    }

    const userId = createUserData.user.id

    // 2) Assign role in profiles to drive access + trigger admin sync
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: userId, role: mappedRole }, { onConflict: "id" })

    if (profileError) {
      console.error("[v0] Error assigning profile role:", profileError)
      return NextResponse.json({ error: "تم إنشاء المستخدم لكن تعذر حفظ صلاحياته" }, { status: 500 })
    }

    // 3) Attempt to read back the synced admin row (falls back to constructed response)
    const { data: adminRow } = await supabase
      .from("admins")
      .select("id, username, full_name, email, role, created_at")
      .eq("id", userId)
      .maybeSingle()

    const responsePayload =
      adminRow ??
      {
        id: userId,
        username,
        full_name,
        email,
        role,
        created_at: new Date().toISOString(),
      }

    return NextResponse.json(responsePayload, { status: 201 })
  } catch (error) {
    console.error("[v0] Error adding admin:", error)
    return NextResponse.json({ error: "فشل إضافة المستخدم" }, { status: 500 })
  }
}
