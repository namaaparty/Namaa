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
      from: "حزب نماء <info@namaaparty.com>",
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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 30px 15px; }
        .container { max-width: 550px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .logo-section { background: #fff; padding: 20px; text-align: center; border-bottom: 2px solid #10b981; }
        .logo { max-width: 160px; height: auto; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .content { padding: 25px; color: #333; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; color: #10b981; margin: 0 0 15px 0; }
        .app-card { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 2px solid #10b981; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; box-shadow: 0 4px 12px rgba(16,185,129,0.2); }
        .app-number { font-size: 28px; font-weight: 900; color: #059669; letter-spacing: 2px; margin: 8px 0; }
        .info-box { background: #f8fafc; border-right: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 6px; font-size: 14px; }
        .contact { background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 13px; color: #475569; }
        .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <img src="https://gavnfdnutmczdtcemzhj.supabase.co/storage/v1/object/public/images/home/logo-horizontal.png" alt="حزب نماء" class="logo" />
        </div>
        
        <div class="header">
          <h1>✉️ تم استلام طلبك بنجاح</h1>
        </div>
        
        <div class="content">
          <p class="greeting">عزيزي/عزيزتي ${applicantName}</p>
          <p style="margin:0 0 15px 0; font-size:15px;">شكراً لتقديم طلب الانتساب لعضوية حزب نماء.</p>
          
          <div class="app-card">
            <div style="font-size:12px; color:#059669; font-weight:600;">رقم الطلب</div>
            <div class="app-number">${applicationNumber}</div>
            <div style="font-size:11px; color:#047857;">احتفظ بهذا الرقم</div>
          </div>

          <div class="info-box">
            <strong style="color:#10b981; display:block; margin-bottom:8px;">ماذا بعد؟</strong>
            سيتم مراجعة طلبك والرد عليك خلال 3-7 أيام عمل عبر البريد الإلكتروني.
          </div>

          <div class="contact">
            <strong style="color:#10b981; display:block; margin-bottom:8px;">📞 للتواصل</strong>
            الهاتف: <strong>0770449644</strong> | البريد: <strong>info@namaaparty.com</strong>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin:0 0 8px 0; font-weight:600;">حزب نماء</p>
          <p style="margin:0; font-size:11px;">© 2025 جميع الحقوق محفوظة</p>
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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 30px 15px; }
        .container { max-width: 550px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .logo-section { background: #fff; padding: 20px; text-align: center; border-bottom: 2px solid #10b981; }
        .logo { max-width: 160px; height: auto; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .content { padding: 25px; color: #333; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; color: #10b981; margin: 0 0 15px 0; }
        .success-card { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 2px solid #10b981; border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center; box-shadow: 0 4px 12px rgba(16,185,129,0.2); }
        .success-icon { font-size: 48px; margin-bottom: 12px; }
        .success-card h2 { color: #047857; font-size: 20px; margin: 10px 0; }
        .info-box { background: #f8fafc; border-right: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 6px; font-size: 14px; }
        .contact { background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 13px; color: #475569; }
        .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <img src="https://gavnfdnutmczdtcemzhj.supabase.co/storage/v1/object/public/images/home/logo-horizontal.png" alt="حزب نماء" class="logo" />
        </div>
        
        <div class="header">
          <h1>🎉 مبارك! تم قبول طلبك</h1>
        </div>
        
        <div class="content">
          <p class="greeting">عزيزي/عزيزتي ${applicantName}</p>
          
          <div class="success-card">
            <div class="success-icon">✅</div>
            <h2>أهلاً بك في عائلة حزب نماء</h2>
            <p style="color:#059669; font-size:15px; margin:8px 0 0 0;">تمت الموافقة على طلب انتسابك</p>
          </div>

          <div class="info-box">
            <strong style="color:#10b981;">ماذا الآن؟</strong><br/>
            سيتواصل معك فريق الحزب قريباً لإطلاعك على النشاطات القادمة ودورك في الحزب.
          </div>

          <div class="contact">
            <strong style="color:#10b981;">📞 للتواصل:</strong><br/>
            الهاتف: <strong>0770449644</strong> | البريد: <strong>info@namaaparty.com</strong>
          </div>

          <p style="margin-top:20px; font-size:15px; color:#10b981; font-weight:600; text-align:center;">معاً نحو اقتصاد وطني قوي 🇯🇴</p>
        </div>
        
        <div class="footer">
          <p style="margin:0 0 5px 0; font-weight:600;">حزب نماء - حزب سياسي وطني</p>
          <p style="margin:0; font-size:11px;">© 2025 جميع الحقوق محفوظة</p>
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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 30px 15px; }
        .container { max-width: 550px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .logo-section { background: #fff; padding: 20px; text-align: center; border-bottom: 2px solid #64748b; }
        .logo { max-width: 160px; height: auto; }
        .header { background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 30px 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .content { padding: 25px; color: #333; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; color: #64748b; margin: 0 0 15px 0; }
        .reason-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .reason-box strong { color: #d97706; font-size: 14px; display: block; margin-bottom: 8px; }
        .info-box { background: #f8fafc; border-right: 4px solid #64748b; padding: 15px; margin: 15px 0; border-radius: 6px; font-size: 14px; }
        .contact { background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 13px; color: #475569; }
        .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <img src="https://gavnfdnutmczdtcemzhj.supabase.co/storage/v1/object/public/images/home/logo-horizontal.png" alt="حزب نماء" class="logo" />
        </div>
        
        <div class="header">
          <h1>📨 حول طلب الانتساب</h1>
        </div>
        
        <div class="content">
          <p class="greeting">عزيزي/عزيزتي ${applicantName}</p>
          <p style="margin:0 0 15px 0; font-size:15px;">نشكرك على اهتمامك بالانضمام إلى حزب نماء.</p>
          
          ${
            reason
              ? `<div class="reason-box">
            <strong>📝 ملاحظة:</strong>
            <p style="margin:0; color:#92400e; font-size:14px;">${reason}</p>
          </div>`
              : ""
          }

          <div class="info-box">
            نعتذر عن عدم التمكن من قبول طلبك حالياً. نتمنى لك التوفيق في مساعيك القادمة.
          </div>

          <div class="contact">
            <strong style="color:#64748b;">📞 للاستفسارات:</strong><br/>
            الهاتف: <strong>0770449644</strong> | البريد: <strong>info@namaaparty.com</strong>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin:0 0 5px 0; font-weight:600;">حزب نماء - حزب سياسي وطني</p>
          <p style="margin:0; font-size:11px;">© 2025 جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `
}

