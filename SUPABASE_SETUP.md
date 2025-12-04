# إعداد Supabase للموقع

## الخطوات المطلوبة:

### 1. تشغيل SQL Scripts في Supabase Dashboard

قم بفتح Supabase Dashboard وانتقل إلى SQL Editor، ثم قم بتشغيل الملفات التالية بالترتيب:

#### أولاً: تشغيل `scripts/001-create-tables.sql`
هذا السكريبت سينشئ:
- جدول `news_articles` للأخبار
- جدول `statements` للبيانات الصادرة
- جدول `page_content` لمحتوى الصفحات
- جدول `page_sections` لأقسام الصفحات
- جدول `leaders` للقيادات التنفيذية
- Indexes لتحسين الأداء
- Triggers لتحديث updated_at تلقائياً
- Row Level Security (RLS) policies

#### ثانياً: تشغيل `scripts/002-seed-initial-data.sql`
هذا السكريبت سيضيف البيانات الأولية:
- خبرين للبداية
- 3 بيانات صادرة
- صفحة رئيسية
- 5 قيادات

#### ثالثاً: تشغيل `scripts/010-create-profiles-and-policies.sql`
هذا السكريبت سينشئ جدول `profiles` المرتبط بجدول `auth.users` ويضيف سياسات RLS خاصة به. هذا الجدول يستخدمه التطبيق لمعرفة صلاحيات كل مستخدم مدير (`admin`, `news_statements`, `activities`).

بعد تشغيل السكريبت، افتح تبويب Authentication في Supabase وانسخ الـ UUID الخاص بكل مستخدم ثم نفِّذ أمر التحديث التالي لكل مستخدم:

```sql
insert into public.profiles (id, role)
values ('<USER_ID>', '<ROLE>')
on conflict (id) do update set role = excluded.role;
```

الأدوار المطلوبة حالياً:
- `admin` : يمتلك كامل الصلاحيات (المستخدم الأول).
- `news_statements` : مسؤول الأخبار والبيانات.
- `activities` : مسؤول النشاطات.

### 2. التحقق من بيانات الاعتماد

تأكد من أن ملف `.env.local` يحتوي على:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://gavnfdnutmczdtcemzhj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### 3. إعادة تشغيل التطبيق

\`\`\`bash
npm run dev
\`\`\`

## ملاحظات مهمة:

### أمان البيانات
- تم تفعيل Row Level Security (RLS) على جميع الجداول
- القراءة متاحة للجميع (public read)
- الكتابة والتحديث والحذف متاح للمستخدمين المصادق عليهم فقط

### الترحيل من localStorage إلى Supabase
جميع الدوال الآن تستخدم Supabase:
- `getNews()` - الآن async وتجلب من Supabase
- `addNews()` - تضيف للـ Supabase
- `updateNews()` - تحدث في Supabase
- `deleteNews()` - تحذف من Supabase
- نفس الشيء لـ `statements` و `pages`

### التعامل مع الصور
- حالياً الصور لا تزال في localStorage (للتوافق المؤقت)
- يمكن لاحقاً نقلها إلى Supabase Storage

### استخدام الواجهات
جميع الدوال الآن تُرجع `Promise`، لذا يجب استخدام `async/await`:

\`\`\`tsx
// قبل (localStorage)
const news = getNews()

// بعد (Supabase)
const news = await getNews()
\`\`\`

## التحقق من نجاح الإعداد

1. افتح Supabase Dashboard
2. انتقل إلى Table Editor
3. تأكد من وجود جميع الجداول (5 جداول)
4. تحقق من وجود البيانات الأولية في كل جدول
5. جرب إضافة خبر من صفحة الإدارة
