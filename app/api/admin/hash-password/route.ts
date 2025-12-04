import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)

    const isMatch = await bcrypt.compare(password, hash)

    console.log("[v0] Password hash generated:", {
      password,
      hash,
      testMatch: isMatch,
    })

    return NextResponse.json({
      hash,
      testMatch: isMatch,
    })
  } catch (error: any) {
    console.error("[v0] Hash generation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
