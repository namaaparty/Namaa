-- Seed default pages with initial data
-- This script populates the database with the default pages structure

-- Insert home page
INSERT INTO public.page_content (page_id, page_title, hero_image, last_modified)
VALUES (
  'home',
  'الصفحة الرئيسية',
  '/images/hero-event.jpg',
  NOW()
) ON CONFLICT (page_id) DO UPDATE SET
  page_title = EXCLUDED.page_title,
  hero_image = EXCLUDED.hero_image,
  last_modified = NOW();

-- Insert home page sections
INSERT INTO public.page_sections (page_id, title, content, image, order_number)
VALUES 
  ('home', 'عن حزب نماء', 'حزب نماء حزب سياسي وطني أردني يقوم على رؤية اقتصادية عميقة تهدف إلى تمكين المجتمع وبناء اقتصاد وطني قوي ومنتج يرفع مناعة الدولة ويعزز قدرتها على مواجهة التحديات. يؤمن الحزب بأن التنمية الاقتصادية والعدالة الاجتماعية وجهان لنهضة الأردن، لذلك يركز على دعم القطاعات الإنتاجية، وتمكين الشركات الصغيرة والمتوسطة، وتحفيز الابتكار والاقتصاد الرقمي، وربط التعليم بسوق العمل.', NULL, 1),
  ('home', 'النص الرئيسي', 'حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة', NULL, 2)
ON CONFLICT DO NOTHING;

-- Insert vision page
INSERT INTO public.page_content (page_id, page_title, hero_image, last_modified)
VALUES (
  'vision',
  'رؤية الحزب',
  '/images/hero-event.jpg',
  NOW()
) ON CONFLICT (page_id) DO UPDATE SET
  page_title = EXCLUDED.page_title,
  hero_image = EXCLUDED.hero_image,
  last_modified = NOW();

-- Insert vision page sections (hero, intro, vision, mission, goals, principles)
INSERT INTO public.page_sections (page_id, title, content, image, order_number)
VALUES 
  ('vision', 'عنوان الغلاف', 'رؤية الحزب', NULL, -5),
  ('vision', 'النص الفرعي للغلاف', 'نحو اقتصاد وطني قوي يمكّن المجتمع ويعزز منعة الدولة', NULL, -4),
  ('vision', 'عنوان المقدمة', 'رؤية ورسالة وأهداف الحزب', NULL, -3),
  ('vision', 'نص المقدمة', 'نعمل على بناء مستقبل اقتصادي مزدهر للأردن من خلال تمكين المجتمع وتعزيز المنعة الوطنية', NULL, -2),
  ('vision', 'الرؤية', 'تمكين المجتمع الأردني لبناء اقتصاد وطني قوي بما يعزز المنعة السياسية للمملكة.', NULL, 1),
  ('vision', 'الرسالة', 'شحذ الهمم وتكاتف الجهود على أساس المواطنة لتمكين المجتمع الأردني وتحقيق نهضته وفقا لقيم ثوابت الأمة.', NULL, 2),
  ('vision', 'عنوان أهداف الحزب', 'أهداف الحزب', NULL, 30),
  (
    'vision',
    'قائمة أهداف الحزب',
    E'رفع معدل النمو الاقتصادي من خلال استخدام أدوات جديدة لتحفيز النمو.\nتطوير منظومة اقتصادية شاملة للقطاعات كافة ممنهجة على أساس علمي ومهني تنهض بالاقتصاد الوطني، أساسها التنمية وغايتها النهضة، تحقق التنمية المستدامة، وتخلق مناخاً استثمارياً مميزاً وجاذباً.\nالسعي نحو أمن غذائي وطني ودعم القطاع الزراعي ليساهم بشكل أكبر في النمو الاقتصادي.\nوضع برامج من شأنها الاستغلال الأمثل للثروات والمصادر الطبيعية وبما يضمن التوزيع العادل للثروة ومنع الاستغلال الجائر والمحافظة على البيئة.\nالسعي لتطوير كافة مؤسسات التعليم وتعزيز دورها الأكاديمي والمجتمعي والبحثي ودعم المواهب والإبداع والأدب والثقافة والفنون.\nتمكين الشباب من التعلم والعمل والمشاركة السياسية وحمايتهم من مظاهر التعصب والتطرف والسلبية والانحلال وتعزيز القيم الوطنية لديهم.\nتمكين المرأة وتعزيز دورها في كافة المجالات السياسية والاقتصادية والاجتماعية، فهي مجتمع بأكمله وتمكينها على كافة المستويات مسؤولية وطنية.\nالسعي لتطوير دور النقابات والاتحادات ومؤسسات المجتمع المدني ومؤسسات العمل التطوعي.\nالمشاركة في الانتخابات وتشكيل الحكومات.',
    NULL,
    31
  ),
  ('vision', 'عنوان بطاقة المبادئ', 'مبادئ الحزب', NULL, 32),
  ('vision', 'عنوان فقرة المبادئ', 'المبادئ والمنطلقات', NULL, 33),
  ('vision', 'نص فقرة المبادئ', 'ينطلق الحزب في رؤيته ورسالته من المبادئ التالية:', NULL, 34),
  (
    'vision',
    'قائمة المبادئ',
    E'إعداد برنامج اقتصادي شامل منطقي وواقعي وقابل للتنفيذ.\nتحسين مستوى الدخل الفردي للمواطن الأردني.\nحق المواطن في العيش الكريم والحصول على جميع الخدمات الأساسية وأهمها التعليم والصحة.\nتفعيل مبدأ الديمقراطية والشفافية والكفاءة في إدارة شؤون الحزب.\nتعزيز الترابط الوثيق بين القطاعات الاقتصادية من جهة، والسياسية والاجتماعية من جهة أخرى.',
    NULL,
    35
  )
ON CONFLICT DO NOTHING;

-- Insert activities page
INSERT INTO public.page_content (page_id, page_title, hero_image, last_modified)
VALUES (
  'activities',
  'النشاطات',
  '/images/public-event.jpg',
  NOW()
) ON CONFLICT (page_id) DO UPDATE SET
  page_title = EXCLUDED.page_title,
  last_modified = NOW();

-- Insert leadership page
INSERT INTO public.page_content (page_id, page_title, hero_image, last_modified)
VALUES (
  'leadership',
  'القيادات التنفيذية',
  '/images/leadership.jpg',
  NOW()
) ON CONFLICT (page_id) DO UPDATE SET
  page_title = EXCLUDED.page_title,
  last_modified = NOW();

-- Insert initial news
INSERT INTO public.news_articles (title, description, content, image, date, category, views)
VALUES 
  ('حزب نماء يعقد مؤتمراً حاشداً في عمّان', 'اجتماع القيادة لمناقشة البرنامج الانتخابي الجديد', 'عقد حزب نماء مؤتماً حاشداً في قاعة الأمل بعمّان لمناقشة البرنامج الانتخابي الجديد وأهداف الحزب للعام الجديد.', '/images/meeting.jpg', '2025-01-15', 'أخبار', 234),
  ('برنامج تدريبي للكوادر الحزبية', 'تدريب الكوادر على المهارات السياسية والتنظيمية', 'أطلق حزب نماء برنامجاً تدريبياً شاملاً لتطوير مهارات كوادره في المجالات السياسية والتنظيمية والاجتماعية.', '/images/leadership.jpg', '2025-01-10', 'تدريب', 156)
ON CONFLICT DO NOTHING;

-- Insert initial statements
INSERT INTO public.statements (title, description, content, image, date, views)
VALUES 
  ('بيان حزب نماء حول الإصلاح الاقتصادي', 'رؤية الحزب للإصلاح الاقتصادي الشامل', 'يؤكد حزب نماء على ضرورة تبني برنامج إصلاح اقتصادي شامل يركز على تحفيز النمو وخلق فرص العمل وتحسين مستوى المعيشة للمواطنين.', '/images/public-event.jpg', '2025-01-20', 312),
  ('بيان حول التنمية المحلية', 'برنامج التنمية المحلية الشاملة', 'يعلن حزب نماء عن إطلاق برنامج التنمية المحلية الذي يهدف إلى تمكين المجتمعات المحلية وتعزيز التنمية المستدامة.', '/images/meeting.jpg', '2025-01-12', 245)
ON CONFLICT DO NOTHING;

-- Insert initial leaders
INSERT INTO public.leaders (name, position, is_main, image, order_number)
VALUES 
  ('محمد عقله عبد الرحمن الرواشده', 'الامين العام', true, NULL, 1),
  ('فاديه كاين مرزوق ابراهيم', 'نائب الامين العام', true, NULL, 2),
  ('سداد عوني محمود الرجوب', 'نائب الامين العام', true, NULL, 3),
  ('عاهد محمد عاهد السخن', 'مساعد الامين العام لشؤون التخطيط', false, NULL, 4),
  ('محمد توفيق احمد الخالدى', 'مساعد الامين العام للشؤون السياسية', false, NULL, 5)
ON CONFLICT DO NOTHING;
