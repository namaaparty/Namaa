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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); margin: 0; padding: 40px 20px; }
        .container { max-width: 650px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.12); }
        .logo-section { background: #ffffff; padding: 30px; text-align: center; border-bottom: 3px solid #10b981; }
        .logo { width: 180px; height: auto; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 50px 40px; text-align: center; position: relative; }
        .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0 L1200,0 L1200,60 Q600,120 0,60 Z" fill="rgba(255,255,255,0.1)"/></svg>') no-repeat bottom; background-size: cover; opacity: 0.3; }
        .header-icon { font-size: 48px; margin-bottom: 15px; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 800; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .content { padding: 50px 40px; color: #1f2937; line-height: 1.9; }
        .content p { margin: 18px 0; font-size: 16px; }
        .greeting { font-size: 20px; font-weight: 600; color: #10b981; margin-bottom: 25px; }
        .card { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #10b981; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; box-shadow: 0 4px 12px rgba(16,185,129,0.15); }
        .card-label { font-size: 13px; color: #059669; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .card-value { font-size: 40px; font-weight: 900; color: #10b981; margin: 15px 0; letter-spacing: 3px; text-shadow: 0 2px 4px rgba(16,185,129,0.2); font-family: 'Courier New', monospace; }
        .card-note { font-size: 14px; color: #047857; margin-top: 12px; }
        .info-box { background: #f8fafc; border-right: 5px solid #10b981; padding: 20px 25px; margin: 25px 0; border-radius: 8px; }
        .info-box strong { color: #10b981; font-size: 18px; display: block; margin-bottom: 10px; }
        .checklist { list-style: none; padding: 0; margin: 20px 0; }
        .checklist li { padding: 12px 20px; margin: 8px 0; background: #f0fdf4; border-radius: 8px; display: flex; align-items: center; gap: 12px; }
        .checklist li::before { content: '✓'; background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; flex-shrink: 0; }
        .contact-section { background: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; }
        .contact-section strong { color: #10b981; font-size: 16px; display: block; margin-bottom: 12px; }
        .contact-item { margin: 8px 0; color: #475569; }
        .footer { background: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 13px; }
        .footer-links { margin: 15px 0; }
        .footer-links a { color: #10b981; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <svg class="logo" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
            <text x="100" y="50" text-anchor="middle" font-size="36" font-weight="bold" fill="#10b981">حزب نماء</text>
          </svg>
        </div>
        
        <div class="header">
          <div class="header-icon">✉️</div>
          <h1>تم استلام طلبك بنجاح</h1>
        </div>
        
        <div class="content">
          <p class="greeting">السلام عليكم ${applicantName}</p>
          
          <p>نشكرك على اهتمامك بالانضمام إلى <strong style="color:#10b981;">حزب نماء</strong> وعلى ثقتك بمسيرتنا الوطنية.</p>
          
          <div class="card">
            <div class="card-label">رقم طلبك</div>
            <div class="card-value">${applicationNumber}</div>
            <div class="card-note">⚠️ احتفظ بهذا الرقم للمراجعة والمتابعة</div>
          </div>

          <div class="info-box">
            <strong>📋 الخطوات التالية</strong>
            <p style="margin:10px 0 0 0; color:#475569;">سيقوم فريق القبول بمراجعة طلبك والتحقق من المستندات المرفقة. سنرسل لك إشعاراً فور اتخاذ القرار النهائي.</p>
          </div>

          <ul class="checklist">
            <li>مدة المراجعة المتوقعة: 3-7 أيام عمل</li>
            <li>تحقق من بريدك الإلكتروني بانتظام (بما في ذلك البريد المزعج)</li>
            <li>في حال وجود أي استفسار، تواصل معنا مباشرة</li>
          </ul>

          <div class="contact-section">
            <strong>📞 معلومات التواصل</strong>
            <div class="contact-item">الهاتف: <strong style="color:#10b981;">0770449644</strong></div>
            <div class="contact-item">البريد الإلكتروني: <strong style="color:#10b981;">info@namaaparty.com</strong></div>
            <div class="contact-item">العنوان: عمان - لواء بيادر وادي السير - شارع أم السماق</div>
          </div>

          <p style="margin-top:30px; color:#64748b; font-size:15px;">نتطلع للعمل معك من أجل مستقبل أفضل للأردن.</p>
        </div>
        
        <div class="footer">
          <p style="font-size:14px; color:#d1d5db; margin:0 0 10px 0;"><strong>حزب نماء</strong></p>
          <p style="margin:0;">حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة</p>
          <div class="footer-links">
            <a href="https://namaaparty.com">الموقع الرسمي</a> |
            <a href="https://www.facebook.com/namaaparty">فيسبوك</a>
          </div>
          <p style="margin-top:15px; font-size:12px;">© 2025 حزب نماء - جميع الحقوق محفوظة</p>
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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); margin: 0; padding: 40px 20px; }
        .container { max-width: 650px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.12); }
        .logo-section { background: #ffffff; padding: 30px; text-align: center; border-bottom: 3px solid #10b981; }
        .logo { width: 180px; height: auto; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 50px 40px; text-align: center; position: relative; }
        .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0 L1200,0 L1200,60 Q600,120 0,60 Z" fill="rgba(255,255,255,0.1)"/></svg>') no-repeat bottom; background-size: cover; opacity: 0.3; }
        .header-icon { font-size: 64px; margin-bottom: 15px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
        .header h1 { margin: 0; font-size: 34px; font-weight: 800; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.15); }
        .content { padding: 50px 40px; color: #1f2937; line-height: 1.9; }
        .content p { margin: 18px 0; font-size: 16px; }
        .greeting { font-size: 22px; font-weight: 600; color: #10b981; margin-bottom: 25px; border-bottom: 2px solid #d1fae5; padding-bottom: 15px; }
        .success-card { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 3px solid #10b981; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center; box-shadow: 0 6px 20px rgba(16,185,129,0.2); }
        .success-card-icon { font-size: 72px; margin-bottom: 20px; }
        .success-card h2 { color: #047857; font-size: 26px; margin: 15px 0; }
        .success-card p { color: #059669; font-size: 17px; margin: 12px 0; }
        .info-box { background: #f8fafc; border-right: 5px solid #10b981; padding: 20px 25px; margin: 25px 0; border-radius: 8px; }
        .contact-section { background: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0; }
        .contact-section strong { color: #10b981; font-size: 16px; display: block; margin-bottom: 12px; }
        .contact-item { margin: 8px 0; color: #475569; }
        .footer { background: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 13px; }
        .footer-links { margin: 15px 0; }
        .footer-links a { color: #10b981; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <svg class="logo" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
            <text x="100" y="50" text-anchor="middle" font-size="36" font-weight="bold" fill="#10b981">حزب نماء</text>
          </svg>
        </div>
        
        <div class="header">
          <div class="header-icon">🎉</div>
          <h1>مبارك! تم قبول طلبك</h1>
        </div>
        
        <div class="content">
          <p class="greeting">عزيزي/عزيزتي ${applicantName}</p>
          
          <div class="success-card">
            <div class="success-card-icon">✅</div>
            <h2>أهلاً بك في عائلة حزب نماء</h2>
            <p>تمت الموافقة على طلب انتسابك لعضوية الحزب</p>
          </div>

          <div class="info-box">
            <strong style="color:#10b981; font-size:18px;">🎯 ماذا الآن؟</strong>
            <p style="margin:10px 0 0 0; color:#475569; font-size:15px;">سيتواصل معك فريق الحزب خلال الأيام القادمة لإطلاعك على:</p>
            <ul style="margin:10px 0 0 20px; color:#475569; font-size:15px;">
              <li style="margin:8px 0;">النشاطات والفعاليات القادمة</li>
              <li style="margin:8px 0;">دورك في الحزب وكيفية المساهمة</li>
              <li style="margin:8px 0;">الاجتماعات التنظيمية والتدريبية</li>
            </ul>
          </div>

          <div class="contact-section">
            <strong>📱 تواصل معنا</strong>
            <div class="contact-item">📞 الهاتف: <strong style="color:#10b981;">0770449644</strong></div>
            <div class="contact-item">✉️ البريد: <strong style="color:#10b981;">info@namaaparty.com</strong></div>
            <div class="contact-item">📍 العنوان: عمان / لواء بيادر وادي السير – شارع أم السماق</div>
          </div>

          <p style="margin-top:35px; font-size:16px; color:#10b981; font-weight:600; text-align:center;">معاً نحو اقتصاد وطني قوي 🇯🇴</p>
        </div>
        
        <div class="footer">
          <p style="font-size:15px; color:#d1d5db; margin:0 0 12px 0; font-weight:600;">حزب نماء</p>
          <p style="margin:5px 0;">حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة</p>
          <div class="footer-links">
            <a href="https://namaaparty.com">الموقع الرسمي</a> |
            <a href="https://www.facebook.com/namaaparty">فيسبوك</a>
          </div>
          <p style="margin-top:18px; font-size:12px; color:#6b7280;">© 2025 حزب نماء - جميع الحقوق محفوظة</p>
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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); margin: 0; padding: 40px 20px; }
        .container { max-width: 650px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.12); }
        .logo-section { background: #ffffff; padding: 30px; text-align: center; border-bottom: 3px solid #64748b; }
        .logo { width: 180px; height: auto; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 50px 40px; text-align: center; position: relative; }
        .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0 L1200,0 L1200,60 Q600,120 0,60 Z" fill="rgba(255,255,255,0.1)"/></svg>') no-repeat bottom; background-size: cover; opacity: 0.3; }
        .header-icon { font-size: 56px; margin-bottom: 15px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
        .header h1 { margin: 0; font-size: 32px; font-weight: 800; position: relative; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.15); }
        .content { padding: 50px 40px; color: #1f2937; line-height: 1.9; }
        .content p { margin: 18px 0; font-size: 16px; }
        .greeting { font-size: 22px; font-weight: 600; color: #64748b; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; }
        .reason-box { background: #fff7ed; border: 2px solid #fb923c; border-radius: 12px; padding: 25px; margin: 25px 0; }
        .reason-box strong { color: #ea580c; font-size: 17px; display: block; margin-bottom: 12px; }
        .reason-box p { color: #9a3412; font-size: 15px; margin: 0; line-height: 1.7; }
        .info-box { background: #f8fafc; border-right: 5px solid #64748b; padding: 20px 25px; margin: 25px 0; border-radius: 8px; }
        .contact-section { background: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0; }
        .contact-section strong { color: #64748b; font-size: 16px; display: block; margin-bottom: 12px; }
        .contact-item { margin: 8px 0; color: #475569; }
        .footer { background: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 13px; }
        .footer-links { margin: 15px 0; }
        .footer-links a { color: #64748b; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <svg class="logo" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
            <text x="100" y="50" text-anchor="middle" font-size="36" font-weight="bold" fill="#64748b">حزب نماء</text>
          </svg>
        </div>
        
        <div class="header">
          <div class="header-icon">📨</div>
          <h1>حول طلب الانتساب</h1>
        </div>
        
        <div class="content">
          <p class="greeting">عزيزي/عزيزتي ${applicantName}</p>
          
          <p>نشكرك على اهتمامك بالانضمام إلى <strong style="color:#64748b;">حزب نماء</strong> وعلى الوقت الذي خصصته لتقديم طلب الانتساب.</p>
          
          ${
            reason
              ? `<div class="reason-box">
            <strong>📝 ملاحظة من فريق المراجعة:</strong>
            <p>${reason}</p>
          </div>`
              : ""
          }

          <div class="info-box">
            <p style="margin:0; color:#475569; font-size:15px;">بعد المراجعة الدقيقة لطلبك، نعتذر عن عدم التمكن من قبوله في الوقت الحالي. نقدر اهتمامك ونتمنى لك التوفيق في مساعيك القادمة.</p>
          </div>

          <div class="contact-section">
            <strong>📞 للاستفسارات</strong>
            <div class="contact-item">الهاتف: <strong style="color:#64748b;">0770449644</strong></div>
            <div class="contact-item">البريد: <strong style="color:#64748b;">info@namaaparty.com</strong></div>
            <div class="contact-item">العنوان: عمان - لواء بيادر وادي السير - شارع أم السماق</div>
          </div>

          <p style="margin-top:30px; color:#64748b; font-size:15px; text-align:center;">نتمنى لك كل التوفيق</p>
        </div>
        
        <div class="footer">
          <p style="font-size:15px; color:#d1d5db; margin:0 0 12px 0; font-weight:600;">حزب نماء</p>
          <p style="margin:5px 0;">حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة</p>
          <div class="footer-links">
            <a href="https://namaaparty.com">الموقع الرسمي</a> |
            <a href="https://www.facebook.com/namaaparty">فيسبوك</a>
          </div>
          <p style="margin-top:18px; font-size:12px; color:#6b7280;">© 2025 حزب نماء - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `
}

