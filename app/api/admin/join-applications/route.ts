import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { sendEmail, getApplicationApprovedEmail, getApplicationRejectedEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()

    // Check authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "ليس لديك صلاحية الوصول" }, { status: 403 })
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Build query
    let query = supabase.from("join_applications").select("*").order("submitted_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("[join-applications] Error fetching applications:", error)
      return NextResponse.json({ error: "تعذر جلب الطلبات" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[join-applications] Unexpected error:", error)
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()

    // Check authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    // Check admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "ليس لديك صلاحية الوصول" }, { status: 403 })
    }

    const body = await request.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 })
    }

    const updates: any = {}
    if (status) updates.status = status
    if (notes !== undefined) updates.notes = notes
    if (Object.keys(updates).length > 0) {
      updates.reviewed_by = user.id
      updates.reviewed_at = new Date().toISOString()
    }

    console.log("[join-applications] Updating application:", id, "with:", updates)
    
    const { data: application, error } = await supabase
      .from("join_applications")
      .update(updates)
      .eq("id", id)
      .select("email, full_name, status")
      .single()

    if (error) {
      console.error("[join-applications] Error updating application:", JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: `تعذر تحديث الطلب: ${error.message || error.code || "unknown"}` 
      }, { status: 500 })
    }
    
    console.log("[join-applications] Update successful, application:", application)

    // Send email notification if status changed and email exists
    if (status && application?.email) {
      try {
        const emailSubject =
          status === "approved" ? "تم قبول طلب انتسابك - حزب نماء" : "حول طلب الانتساب - حزب نماء"

        const emailHtml =
          status === "approved"
            ? getApplicationApprovedEmail(application.full_name)
            : getApplicationRejectedEmail(application.full_name, notes)

        const emailResult = await sendEmail({
          to: application.email,
          subject: emailSubject,
          html: emailHtml,
        })

        if (!emailResult.success) {
          console.warn("[join-applications] Email send failed:", emailResult.error)
          // Don't fail the whole request if email fails, just log it
        } else {
          console.log("[join-applications] Notification email sent to:", application.email)
        }
      } catch (emailError) {
        console.error("[join-applications] Error sending email:", emailError)
        // Continue anyway - the status was updated successfully
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[join-applications] Unexpected error:", error)
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 })
  }
}

