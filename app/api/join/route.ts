import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const formData = await request.formData()

    // Helper to convert empty strings to null for optional fields
    const getFieldOrNull = (key: string): string | null => {
      const value = formData.get(key) as string | null
      return value && value.trim() !== "" ? value : null
    }

    // Check for duplicate national_id
    const nationalId = formData.get("nationalId") as string
    if (nationalId) {
      const { data: existing } = await supabase
        .from("join_applications")
        .select("id")
        .eq("national_id", nationalId)
        .maybeSingle()

      if (existing) {
        return NextResponse.json(
          { error: "تم تقديم طلب سابق بنفس الرقم الوطني. يرجى الانتظار حتى تتم مراجعة طلبك السابق." },
          { status: 400 },
        )
      }
    }

    // Extract form fields
    const applicationData = {
      national_id: formData.get("nationalId") as string,
      phone: formData.get("phone") as string,
      title: getFieldOrNull("title"),
      full_name: formData.get("fullName") as string,
      birth_date: getFieldOrNull("birthDate"),
      gender: getFieldOrNull("gender"),
      marital_status: getFieldOrNull("maritalStatus"),
      id_expiry: getFieldOrNull("idExpiry"),
      email: getFieldOrNull("email"),
      governorate: getFieldOrNull("governorate"),
      district: getFieldOrNull("district"),
      election_district: getFieldOrNull("electionDistrict"),
      address: getFieldOrNull("address"),
      qualification: getFieldOrNull("qualification"),
      major: getFieldOrNull("major"),
      university: getFieldOrNull("university"),
      graduation_year: getFieldOrNull("graduationYear"),
      profession: getFieldOrNull("profession"),
      workplace: getFieldOrNull("workplace"),
      job_title: getFieldOrNull("jobTitle"),
      experience: getFieldOrNull("experience"),
      party_membership: getFieldOrNull("partyMembership"),
      previous_party: getFieldOrNull("previousParty"),
      resignation_date: getFieldOrNull("resignationDate"),
    }

    // Upload files to Supabase Storage
    const uploadFile = async (file: File | null, prefix: string): Promise<string | null> => {
      if (!file) return null

      const fileName = `${prefix}-${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from("join-applications").upload(fileName, file, {
        upsert: false,
      })

      if (uploadError) {
        console.error(`[join] Error uploading ${prefix}:`, JSON.stringify(uploadError, null, 2))
        throw new Error(`فشل رفع ${prefix}: ${uploadError.message || uploadError.error || "unknown"}`)
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("join-applications").getPublicUrl(fileName)

      return publicUrl
    }

    const idFrontFile = formData.get("idFrontFile") as File | null
    const idBackFile = formData.get("idBackFile") as File | null
    const resignationFile = formData.get("resignationFile") as File | null
    const clearanceFile = formData.get("clearanceFile") as File | null
    const photoFile = formData.get("photoFile") as File | null

    const [idFrontUrl, idBackUrl, resignationUrl, clearanceUrl, photoUrl] = await Promise.all([
      uploadFile(idFrontFile, "id-front"),
      uploadFile(idBackFile, "id-back"),
      uploadFile(resignationFile, "resignation"),
      uploadFile(clearanceFile, "clearance"),
      uploadFile(photoFile, "photo"),
    ])

    // Insert application into database
    const insertData = {
      ...applicationData,
      id_front_url: idFrontUrl,
      id_back_url: idBackUrl,
      resignation_url: resignationUrl,
      clearance_url: clearanceUrl,
      photo_url: photoUrl,
      status: "pending",
    }
    
    console.log("[join] Attempting to insert application data:", JSON.stringify(insertData, null, 2))
    
    const { data: insertedApplication, error: insertError } = await supabase
      .from("join_applications")
      .insert(insertData)
      .select("application_number, email, full_name")
      .single()

    if (insertError) {
      console.error("[join] Error inserting application:", JSON.stringify(insertError, null, 2))
      throw new Error(`فشل حفظ الطلب: ${insertError.message || insertError.code || "unknown"}`)
    }

    // Send notification email to admin
    try {
      const { sendEmail } = await import("@/lib/email")
      const adminEmail = "info@namaaparty.com"
      
      const adminNotificationHtml = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head><meta charset="UTF-8"><style>body{font-family:Arial;padding:20px;background:#f5f5f5;} .card{max-width:600px;margin:0 auto;background:white;border-radius:12px;padding:30px;box-shadow:0 4px 12px rgba(0,0,0,0.1);} h1{color:#10b981;margin:0 0 20px 0;} .info{background:#f0fdf4;padding:15px;border-radius:8px;margin:15px 0;} .info strong{color:#059669;}</style></head>
        <body>
          <div class="card">
            <h1>📝 طلب انتساب جديد</h1>
            <p>تم استلام طلب انتساب جديد يتطلب المراجعة:</p>
            <div class="info">
              <strong>رقم الطلب:</strong> ${insertedApplication.application_number}<br/>
              <strong>الاسم:</strong> ${insertedApplication.full_name}<br/>
              <strong>تاريخ التقديم:</strong> ${new Date().toLocaleDateString("en-GB")}
            </div>
            <p>يرجى مراجعة الطلب في لوحة الإدارة.</p>
            <a href="https://namaaparty.com/admin/join-applications" style="display:inline-block;background:#10b981;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;margin-top:15px;">مراجعة الطلب</a>
          </div>
        </body>
        </html>
      `
      
      await sendEmail({
        to: adminEmail,
        subject: `طلب انتساب جديد - ${insertedApplication.full_name} (${insertedApplication.application_number})`,
        html: adminNotificationHtml,
      })
      console.log("[join] Admin notification sent to:", adminEmail)
    } catch (emailError) {
      console.error("[join] Error sending admin notification:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "تم إرسال طلب الانتساب بنجاح",
      applicationNumber: insertedApplication?.application_number,
    })
  } catch (error) {
    console.error("[join] Error processing application:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال الطلب" },
      { status: 500 },
    )
  }
}
