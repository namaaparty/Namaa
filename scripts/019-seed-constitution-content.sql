-- Seed Constitution Page Content
-- This makes the constitution text content editable from admin panel

-- First, ensure the page exists
INSERT INTO page_content (page_id, page_title, hero_image)
VALUES ('constitution', 'النظام الأساسي', '/images/hero-event.jpg')
ON CONFLICT (page_id) DO UPDATE SET
page_title = EXCLUDED.page_title;

-- Add unique constraint if it doesn't exist (to allow ON CONFLICT)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'page_sections_page_id_title_key'
  ) THEN
    ALTER TABLE page_sections 
    ADD CONSTRAINT page_sections_page_id_title_key 
    UNIQUE (page_id, title);
  END IF;
END $$;

-- Add constitution content section (you can edit this from admin panel)
INSERT INTO page_sections (page_id, title, content, order_number) VALUES
('constitution', 'محتوى النظام الأساسي', 'محتوى النظام الأساسي سيتم تحديثه من لوحة الإدارة

بعد تشغيل هذا السكريبت:
1. اذهب إلى /admin/pages  
2. اختر صفحة "النظام الأساسي"
3. اضغط تعديل على قسم "محتوى النظام الأساسي"
4. انسخ المحتوى الكامل من الصفحة الحالية /constitution
5. الصقه هنا واحفظ', 1)
ON CONFLICT (page_id, title) DO UPDATE SET
content = EXCLUDED.content,
order_number = EXCLUDED.order_number;

-- Verify the data
SELECT page_id, title, LEFT(content, 100) as content_preview
FROM page_sections
WHERE page_id = 'constitution';
