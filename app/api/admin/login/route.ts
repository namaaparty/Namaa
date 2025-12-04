import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json()

    console.log("[v0] Login attempt:", { username, role })

    if (!username || !password || !role) {
      return NextResponse.json({ error: "اسم المستخدم وكلمة المرور والصلاحية مطلوبة" }, { status: 400 })
    }

    const supabase = await createClient()

    console.log("[v0] Supabase client created, querying database...")

    // جلب المستخدم من قاعدة البيانات
    const { data: user, error } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .eq("role", role)
      .maybeSingle()

    console.log("[v0] Database query result:", { user: user ? "found" : "not found", error })

    if (error || !user) {
      console.error("[v0] Login query error:", error)
      return NextResponse.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 })
    }

    console.log("[v0] User found, comparing password...")

    // التحقق من كلمة المرور باستخدام bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    console.log("[v0] Password comparison result:", isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 })
    }

    // إرجاع بيانات المستخدم (بدون كلمة المرور)
    const { password_hash, ...userWithoutPassword } = user

    console.log("[v0] Login successful for user:", username)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 })
  }
}
