import { NextResponse } from "next/server"
import { createClient as createServerSupabase } from "@/lib/supabase/server"

const REQUIRED_FIELDS = ["nationalId", "fullName", "phone", "email"] as const

const toNumberOrNull = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    for (const field of REQUIRED_FIELDS) {
      if (!body[field]) {
        return NextResponse.json({ error: "الرجاء تعبئة جميع الحقول المطلوبة." }, { status: 400 })
      }
    }

    const supabase = await createServerSupabase()

    const { error } = await supabase.from("membership_applications").insert({
      national_id: body.nationalId,
      phone: body.phone,
      title: body.title || null,
      full_name: body.fullName,
      birth_date: body.birthDate || null,
      gender: body.gender || null,
      marital_status: body.maritalStatus || null,
      id_expiry: body.idExpiry || null,
      email: body.email,
      governorate: body.governorate || null,
      district: body.district || null,
      election_district: body.electionDistrict || null,
      address: body.address || null,
      qualification: body.qualification || null,
      major: body.major || null,
      university: body.university || null,
      graduation_year: toNumberOrNull(body.graduationYear),
      profession: body.profession || null,
      workplace: body.workplace || null,
      job_title: body.jobTitle || null,
      experience_years: toNumberOrNull(body.experience),
      party_membership: Boolean(body.partyMembership),
      previous_party: body.previousParty || null,
      resignation_date: body.resignationDate || null,
      id_front_url: body.attachments?.idFront || null,
      id_back_url: body.attachments?.idBack || null,
      photo_url: body.attachments?.photo || null,
      resignation_file_url: body.attachments?.resignation || null,
      clearance_file_url: body.attachments?.clearance || null,
      notes: body.notes || null,
    })

    if (error) {
      console.error("[api/join] Supabase insert failed:", error)
      return NextResponse.json({ error: "تعذر حفظ الطلب، الرجاء المحاولة لاحقاً." }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("[api/join] Unexpected error:", error)
    return NextResponse.json({ error: "حدث خطأ غير متوقع أثناء إرسال الطلب." }, { status: 500 })
  }
}

