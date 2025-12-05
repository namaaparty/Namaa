import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured, skipping email send")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "حزب نماء <onboarding@resend.dev>", // Replace with your verified domain later
      to,
      subject,
      html,
    })

    if (error) {
      console.error("[email] Send error:", error)
      return { success: false, error: error.message }
    }

    console.log("[email] Email sent successfully:", data?.id)
    return { success: true, data }
  } catch (error) {
    console.error("[email] Unexpected error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export function getApplicationSubmittedEmail(applicantName: string, applicationNumber: string): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 40px 30px; color: #333; line-height: 1.8; }
        .content p { margin: 15px 0; }
        .app-number { background: #0ea5e915; border: 2px solid #0ea5e9; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .app-number .number { font-size: 32px; font-weight: bold; color: #0ea5e9; margin: 10px 0; letter-spacing: 2px; }
        .highlight { background: #0ea5e915; border-right: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f9fafb; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📝 تم استلام طلبك بنجاح</h1>
        </div>
        <div class="content">
          <p><strong>عزيزي/عزيزتي ${applicantName}،</strong></p>
          <p>شكراً لك على تقديم طلب الانتساب لعضوية <strong>حزب نماء</strong>.</p>
          
          <div class="app-number">
            <p style="margin:0; font-size:14px; color:#64748b;">رقم الطلب الخاص بك</p>
            <div class="number">${applicationNumber}</div>
            <p style="margin:0; font-size:13px; color:#64748b;">احتفظ بهذا الرقم للمتابعة</p>
          </div>

          <div class="highlight">
            <p style="margin:0;"><strong>ماذا بعد؟</strong></p>
            <p style="margin:10px 0 0 0;">سيتم مراجعة طلبك من قبل فريق الحزب. سنرسل لك إشعاراً عبر البريد الإلكتروني فور اتخاذ القرار.</p>
          </div>

          <p><strong>معلومات مهمة:</strong></p>
          <ul style="margin:10px 0; padding-right:20px;">
            <li>مدة المراجعة: من 3 إلى 7 أيام عمل</li>
            <li>تأكد من مراجعة بريدك الإلكتروني بانتظام</li>
            <li>للاستفسار: اتصل على 0770449644</li>
          </ul>
          
          <p><strong>للتواصل معنا:</strong></p>
          <p>📞 الهاتف: 0770449644<br>
          📧 البريد: info@namaaparty.com</p>

          <p>مع أطيب التحيات،<br><strong>حزب نماء</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 حزب نماء - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getApplicationApprovedEmail(applicantName: string): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 40px 30px; color: #333; line-height: 1.8; }
        .content p { margin: 15px 0; }
        .highlight { background: #10b98115; border-right: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f9fafb; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #e5e7eb; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ تم قبول طلب انتسابك</h1>
        </div>
        <div class="content">
          <p><strong>عزيزي/عزيزتي ${applicantName}،</strong></p>
          <p>يسعدنا إبلاغك بأن طلب انتسابك لعضوية <strong>حزب نماء</strong> قد تمت الموافقة عليه!</p>
          
          <div class="highlight">
            <p style="margin:0;"><strong>مرحباً بك في عائلة حزب نماء</strong></p>
            <p style="margin:10px 0 0 0;">نتطلع للعمل معك من أجل مستقبل اقتصادي مزدهر للأردن.</p>
          </div>

          <p>سيتم التواصل معك قريباً من قبل فريق الحزب لإطلاعك على الخطوات التالية والنشاطات القادمة.</p>
          
          <p><strong>للتواصل معنا:</strong></p>
          <p>📞 الهاتف: 0770449644<br>
          📧 البريد: info@namaaparty.com</p>

          <p>مع أطيب التحيات،<br><strong>حزب نماء</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 حزب نماء - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getApplicationRejectedEmail(applicantName: string, reason?: string): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 40px 30px; color: #333; line-height: 1.8; }
        .content p { margin: 15px 0; }
        .highlight { background: #f1f5f9; border-right: 4px solid #64748b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f9fafb; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>حول طلب الانتساب</h1>
        </div>
        <div class="content">
          <p><strong>عزيزي/عزيزتي ${applicantName}،</strong></p>
          <p>نشكرك على اهتمامك بالانضمام إلى <strong>حزب نماء</strong> وعلى الوقت الذي خصصته لتقديم طلب الانتساب.</p>
          
          ${
            reason
              ? `<div class="highlight">
            <p style="margin:0;"><strong>سبب الاعتذار:</strong></p>
            <p style="margin:10px 0 0 0;">${reason}</p>
          </div>`
              : ""
          }

          <p>بعد دراسة طلبك، نعتذر عن عدم التمكن من قبوله في الوقت الحالي. نتمنى لك التوفيق في مساعيك المستقبلية.</p>
          
          <p>يمكنك التواصل معنا في حال كان لديك أي استفسارات:</p>
          <p>📞 الهاتف: 0770449644<br>
          📧 البريد: info@namaaparty.com</p>

          <p>مع أطيب التحيات،<br><strong>حزب نماء</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 حزب نماء - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `
}

