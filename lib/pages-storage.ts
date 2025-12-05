import { supabase } from "./supabase"

export interface PageSection {
  id: string
  title: string
  content: string
  image?: string
  order: number
}

export interface Leader {
  id: string
  name: string
  position: string
  isMain: boolean
  image?: string | null
  order?: number
  bio?: string
  email?: string
  phone?: string
}

export interface PageContent {
  id: string
  title: string
  heroImage?: string
  sections: PageSection[]
  leaders?: Leader[]
  lastModified?: string
}

export interface PartyStatistics {
  id: string
  total_members: number
  female_members: number
  male_members: number
  youth_members: number
  last_updated: string
}

const STORAGE_KEY = "namaa_pages_content"
const IMAGES_KEY = "namaa_pages_images"
const ALLOWED_VISION_SECTION_TITLES = new Set([
  "عنوان الغلاف",
  "النص الفرعي للغلاف",
  "عنوان المقدمة",
  "نص المقدمة",
  "الرؤية",
  "الرسالة",
  "عنوان أهداف الحزب",
  "قائمة أهداف الحزب",
  "عنوان بطاقة المبادئ",
  "عنوان فقرة المبادئ",
  "نص فقرة المبادئ",
  "قائمة المبادئ",
])
export const DEFAULT_PAGES: PageContent[] = [
  {
    id: "home",
    title: "الصفحة الرئيسية",
    heroImage: "/images/hero-event.jpg",
    sections: [
      {
        id: "home-1",
        title: "عن حزب نماء",
        content:
          "حزب نماء حزب سياسي وطني أردني يقوم على رؤية اقتصادية عميقة تهدف إلى تمكين المجتمع وبناء اقتصاد وطني قوي ومنتج يرفع مناعة الدولة ويعزز قدرتها على مواجهة التحديات. يؤمن الحزب بأن التنمية الاقتصادية والعدالة الاجتماعية وجهان لنهضة الأردن، لذلك يركز على دعم القطاعات الإنتاجية، وتمكين الشركات الصغيرة والمتوسطة، وتحفيز الابتكار والاقتصاد الرقمي، وربط التعليم بسوق العمل.\n\nويتبنّى الحزب منهجية مؤسسية قائمة على الحوكمة والشفافية وسيادة القانون، مع إعطاء مساحة واسعة لمشاركة الشباب والمرأة في قيادة المبادرات وصنع القرار. كما يسعى حزب نماء إلى بناء شراكات محلية وإقليمية تسهم في تحسين جودة الحياة وتعزيز الدور الوطني للدولة الأردنية.\n\nالحزب يطرح حلولاً عملية قابلة للتنفيذ ويحشد الطاقات الوطنية من أجل مستقبل أكثر استقراراً ونماءً.",
        order: 1,
      },
      {
        id: "home-2",
        title: "النص الرئيسي",
        content: "حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة",
        order: 2,
      },
    ],
    leaders: [],
  },
  {
    id: "vision",
    title: "رؤية الحزب",
    heroImage: "/images/hero-event.jpg",
    sections: [
      {
        id: "vision-hero-title",
        title: "عنوان الغلاف",
        content: "رؤية الحزب",
        order: -5,
      },
      {
        id: "vision-hero-subtitle",
        title: "النص الفرعي للغلاف",
        content: "نحو اقتصاد وطني قوي يمكّن المجتمع ويعزز منعة الدولة",
        order: -4,
      },
      {
        id: "vision-intro-title",
        title: "عنوان المقدمة",
        content: "رؤية ورسالة وأهداف الحزب",
        order: -3,
      },
      {
        id: "vision-intro-description",
        title: "نص المقدمة",
        content: "نعمل على بناء مستقبل اقتصادي مزدهر للأردن من خلال تمكين المجتمع وتعزيز المنعة الوطنية",
        order: -2,
      },
      {
        id: "vision-vision-card",
        title: "الرؤية",
        content: "تمكين المجتمع الأردني لبناء اقتصاد وطني قوي بما يعزز المنعة السياسية للمملكة.",
        order: 1,
      },
      {
        id: "vision-mission-card",
        title: "الرسالة",
        content: "شحذ الهمم وتكاتف الجهود على أساس المواطنة لتمكين المجتمع الأردني وتحقيق نهضته وفقا لقيم ثوابت الأمة.",
        order: 2,
      },
      {
        id: "vision-goals-card-title",
        title: "عنوان أهداف الحزب",
        content: "أهداف الحزب",
        order: 30,
      },
      {
        id: "vision-goals-list",
        title: "قائمة أهداف الحزب",
        content:
          "رفع معدل النمو الاقتصادي من خلال استخدام أدوات جديدة لتحفيز النمو.\nتطوير منظومة اقتصادية شاملة للقطاعات كافة ممنهجة على أساس علمي ومهني تنهض بالاقتصاد الوطني، أساسها التنمية وغايتها النهضة، تحقق التنمية المستدامة، وتخلق مناخاً استثمارياً مميزاً وجاذباً.\nالسعي نحو أمن غذائي وطني ودعم القطاع الزراعي ليساهم بشكل أكبر في النمو الاقتصادي.\nوضع برامج من شأنها الاستغلال الأمثل للثروات والمصادر الطبيعية وبما يضمن التوزيع العادل للثروة ومنع الاستغلال الجائر والمحافظة على البيئة.\nالسعي لتطوير كافة مؤسسات التعليم وتعزيز دورها الأكاديمي والمجتمعي والبحثي ودعم المواهب والإبداع والأدب والثقافة والفنون.\nتمكين الشباب من التعلم والعمل والمشاركة السياسية وحمايتهم من مظاهر التعصب والتطرف والسلبية والانحلال وتعزيز القيم الوطنية لديهم.\nتمكين المرأة وتعزيز دورها في كافة المجالات السياسية والاقتصادية والاجتماعية، فهي مجتمع بأكمله وتمكينها على كافة المستويات مسؤولية وطنية.\nالسعي لتطوير دور النقابات والاتحادات ومؤسسات المجتمع المدني ومؤسسات العمل التطوعي.\nالمشاركة في الانتخابات وتشكيل الحكومات.",
        order: 31,
      },
      {
        id: "vision-principles-card-title",
        title: "عنوان بطاقة المبادئ",
        content: "مبادئ الحزب",
        order: 32,
      },
      {
        id: "vision-principles-intro-title",
        title: "عنوان فقرة المبادئ",
        content: "المبادئ والمنطلقات",
        order: 33,
      },
      {
        id: "vision-principles-intro-description",
        title: "نص فقرة المبادئ",
        content: "ينطلق الحزب في رؤيته ورسالته من المبادئ التالية:",
        order: 34,
      },
      {
        id: "vision-principles-list",
        title: "قائمة المبادئ",
        content:
          "إعداد برنامج اقتصادي شامل منطقي وواقعي وقابل للتنفيذ.\nتحسين مستوى الدخل الفردي للمواطن الأردني.\nحق المواطن في العيش الكريم والحصول على جميع الخدمات الأساسية وأهمها التعليم والصحة.\nتفعيل مبدأ الديمقراطية والشفافية والكفاءة في إدارة شؤون الحزب.\nتعزيز الترابط الوثيق بين القطاعات الاقتصادية من جهة، والسياسية والاجتماعية من جهة أخرى.",
        order: 35,
      },
    ],
    leaders: [],
  },
  {
    id: "goals",
    title: "أهدافنا",
    sections: [
      {
        id: "goals-1",
        title: "التنمية الاقتصادية الشاملة",
        content:
          "تطوير منظومة اقتصادية شاملة للقطاعات كافة، ممنهجة على أساس علمي ومهني متدرجة عبر حزمة من البرامج المتسلسلة تنهض بالاقتصاد الوطني",
        order: 1,
      },
      {
        id: "goals-2",
        title: "بناء الدولة الديمقراطية الحديثة",
        content: "تسخير إمكانيات الحزب كافة للإسهام في بناء الدولة الأردنية الديمقراطية الحديثة",
        order: 2,
      },
      {
        id: "goals-3",
        title: "حماية الأمن الوطني",
        content: "تتظافر جهود الحزب ويتكاتف أعضاؤه مع أي جهود وطنية تسعى للتصدي لأي محاولة لاستهداف أمن الوطن",
        order: 3,
      },
      {
        id: "goals-4",
        title: "المشاركة في الحكومات",
        content: "المشاركة في تشكيل الحكومات وصنع القرار السياسي",
        order: 4,
      },
      {
        id: "goals-5",
        title: "محاربة الفساد",
        content: "تعزيز أدوات النزاهة ومحاربة الفساد على جميع المستويات",
        order: 5,
      },
      {
        id: "goals-6",
        title: "تمكين الشباب",
        content: "تمكين الشباب من التعلم والعمل والمشاركة السياسية وحمايتهم من مظاهر التعصب والتطرف",
        order: 6,
      },
      {
        id: "goals-7",
        title: "تمكين المرأة",
        content: "تمكين المرأة وتعزيز دورها في المجتمع والحياة السياسية",
        order: 7,
      },
    ],
    leaders: [],
  },
  {
    id: "activities",
    title: "النشاطات",
    sections: [
      {
        id: "activities-1",
        title: "المؤتمرات والندوات",
        content: "عقد المؤتمرات والندوات الحوارية لمناقشة القضايا الوطنية والاقتصادية والاجتماعية",
        order: 1,
      },
      {
        id: "activities-2",
        title: "البرامج التدريبية",
        content: "تنظيم برامج تدريبية وتثقيفية لتطوير قدرات الأعضاء والشباب",
        order: 2,
      },
      {
        id: "activities-3",
        title: "الحملات المجتمعية",
        content: "إطلاق حملات توعوية ومجتمعية لخدمة المواطنين والمجتمع المحلي",
        order: 3,
      },
      {
        id: "activities-4",
        title: "اللقاءات الميدانية",
        content: "تنظيم لقاءات ميدانية في المحافظات للتواصل مع المواطنين والاستماع لاحتياجاتهم",
        order: 4,
      },
    ],
    leaders: [],
  },
  {
    id: "leadership",
    title: "القيادات التنفيذية",
    sections: [
      {
        id: "leadership-1",
        title: "الأمين العام",
        content: "يرأس الحزب ويمثله أمام الجهات الرسمية وله صلاحيات تنفيذية واسعة",
        order: 1,
      },
      {
        id: "leadership-2",
        title: "نواب الأمين العام",
        content: "ينوبون عن الأمين العام في الأمور المفوضة ويساعدونه في إدارة شؤون الحزب",
        order: 2,
      },
      {
        id: "leadership-3",
        title: "الأمانة العامة",
        content: "الهيئة التنفيذية العليا للحزب وتتكون من 15 عضو يشرفون على الدوائر والقطاعات",
        order: 3,
      },
      {
        id: "leadership-4",
        title: "المجلس المركزي",
        content: "يتكون من 150 عضو ينتخبون من المجلس الوطني ويشرفون على البرامج والسياسات",
        order: 4,
      },
      {
        id: "leadership-5",
        title: "المجلس الوطني",
        content: "الهيئة العليا للحزب ويضم 350 عضو يمثلون جميع محافظات المملكة",
        order: 5,
      },
    ],
    leaders: [
      {
        id: "leader-1",
        name: "محمد عقله عبد الرحمن الرواشده",
        position: "الامين العام",
        isMain: true,
        order: 1,
      },
      {
        id: "leader-2",
        name: "فاديه كاين مرزوق ابراهيم",
        position: "نائب الامين العام",
        isMain: true,
        order: 2,
      },
      {
        id: "leader-3",
        name: "سداد عوني محمود الرجوب",
        position: "نائب الامين العام",
        isMain: true,
        order: 3,
      },
      {
        id: "leader-4",
        name: "عاهد محمد عاهد السخن",
        position: "مساعد الامين العام لشؤون التخطيط",
        isMain: false,
        order: 4,
      },
      {
        id: "leader-5",
        name: "محمد توفيق احمد الخالدى",
        position: "مساعد الامين العام للشؤون السياسية",
        isMain: false,
        order: 5,
      },
      {
        id: "leader-6",
        name: "عبد الله نويفع فالح الشديفات",
        position: "مساعد الامين العام لشؤون الخدمات المساندة",
        isMain: false,
        order: 6,
      },
      {
        id: "leader-7",
        name: "احمد نظمي عوده التلهوني",
        position: "مساعد الامين العام لشؤون النقل",
        isMain: false,
        order: 7,
      },
      {
        id: "leader-8",
        name: "هيثم احمد موسى خصاونه",
        position: "مساعد الامين العام لشؤون العمل والعمال",
        isMain: false,
        order: 8,
      },
      {
        id: "leader-9",
        name: "علي عبد الله محمد ابو دلو",
        position: "مساعد الامين العام لشؤون الصناعة والتجارة",
        isMain: false,
        order: 9,
      },
      {
        id: "leader-10",
        name: "محمد حسين محمد مصطفى",
        position: "مساعد الامين العام لشؤون السياحة",
        isMain: false,
        order: 10,
      },
      {
        id: "leader-11",
        name: "ضيف الله خليف افليح بني خالد",
        position: "مساعد الامين العام لشؤون الصحة والبيئة",
        isMain: false,
        order: 11,
      },
      {
        id: "leader-12",
        name: "فايز عبد الكريم سالم الدعجه",
        position: "مساعد الامين العام للشؤون الادارية",
        isMain: false,
        order: 12,
      },
      {
        id: "leader-13",
        name: "نايف عبد الله عقله الرواشده",
        position: "مساعد الامين العام لشؤون الادارة المحلية والنقابات",
        isMain: false,
        order: 13,
      },
      {
        id: "leader-14",
        name: "علي سليمان محمد الغزاوى",
        position: "مساعد الامين العام لشؤون الزراعة والمياه",
        isMain: false,
        order: 14,
      },
      {
        id: "leader-15",
        name: "جميل عبد اللطيف محمد الحوامده",
        position: "مساعد الامين العام لشؤون الاستثمار",
        isMain: false,
        order: 15,
      },
      {
        id: "leader-16",
        name: "طلال عواد عجاج العليمات",
        position: "مساعد الأمين العام لشؤون التدريب والتأهيل",
        isMain: false,
        order: 16,
      },
      {
        id: "leader-17",
        name: "عامر عبد اللطيف محمود المكحل",
        position: "مساعد الامين العام لشؤون الامانه العامه",
        isMain: false,
        order: 17,
      },
      {
        id: "leader-18",
        name: "لينا شاهر محمد الطراونه",
        position: "مساعد الامين العام لشؤون المرأة",
        isMain: false,
        order: 18,
      },
      {
        id: "leader-19",
        name: "رشاد محمد رشاد ابراهيم ال خطاب",
        position: "مساعد الامين العام لشؤون مجالس الفروع",
        isMain: false,
        order: 19,
      },
      {
        id: "leader-20",
        name: "ايمن محمد رمضان احمد الخطيب",
        position: "مساعد الامين العام لشؤون المغتربين",
        isMain: false,
        order: 20,
      },
      {
        id: "leader-21",
        name: "محمد سلامه ضيف الله ابوجريبان",
        position: "مساعد الأمين العام لشؤون الرقابه والمتابعه",
        isMain: false,
        order: 21,
      },
      {
        id: "leader-22",
        name: "سند متعب محمد الرواشده",
        position: "مساعد الامين العام لشؤون الشباب",
        isMain: false,
        order: 22,
      },
      {
        id: "leader-23",
        name: "اسراء علي محمد العمرى",
        position: "مساعد الامين العام لشؤون التعليم",
        isMain: false,
        order: 23,
      },
      {
        id: "leader-24",
        name: "صخر محمد سلامه الصرايره",
        position: "مساعد الامين العام لشؤون الطاقة و الثروات المعدنية",
        isMain: false,
        order: 24,
      },
      {
        id: "leader-25",
        name: "اسماعيل علي عقل الشوابكه",
        position: "مساعد الامين العام لشؤون الثقافة الحزبية",
        isMain: false,
        order: 25,
      },
      {
        id: "leader-26",
        name: "محمد حسن سعيد الطراونه",
        position: "مساعد الامين العام للشؤون الاجتماعية",
        isMain: false,
        order: 26,
      },
      {
        id: "leader-27",
        name: "قصي موفق عبد الحميد الابراهيم",
        position: "مساعد الامين العام للشؤون القانونية",
        isMain: false,
        order: 27,
      },
    ],
  },
  {
    id: "localDevelopment",
    title: "البرنامج الاقتصادي",
    sections: [
      {
        id: "local-1",
        title: "منهجيتنا في التنمية المحلية",
        content:
          "نهج شامل للتنمية المحلية المستدامة يركز على تمكين المجتمعات المحلية وتعزيز قدراتها الاقتصادية والاجتماعية",
        order: 1,
      },
      {
        id: "local-2",
        title: "المشاريع التنموية",
        content: "تنفيذ مشاريع تنموية محلية في مختلف المحافظات تساهم في تحسين مستوى المعيشة وخلق فرص العمل",
        order: 2,
      },
      {
        id: "local-3",
        title: "الشراكة المجتمعية",
        content: "بناء شراكات فعالة مع المجتمع المحلي والمؤسسات لتحقيق التنمية المستدامة",
        order: 3,
      },
    ],
    leaders: [],
  },
  {
    id: "branches",
    title: "فروع الحزب",
    sections: [
      {
        id: "branches-1",
        title: "فرع العاصمة",
        content: "فرع عمان - المقر الرئيسي\nالعنوان: عمان، الأردن\nالهاتف: 0770449644",
        order: 1,
      },
      {
        id: "branches-2",
        title: "فرع إربد",
        content: "فرع محافظة إربد\nالعنوان: إربد\nالهاتف: 0770449644",
        order: 2,
      },
      {
        id: "branches-3",
        title: "فرع الزرقاء",
        content: "فرع محافظة الزرقاء\nالعنوان: الزرقاء\nالهاتف: 0770449644",
        order: 3,
      },
      {
        id: "branches-4",
        title: "فرع العقبة",
        content: "فرع محافظة العقبة\nالعنوان: العقبة\nالهاتف: 0770449644",
        order: 4,
      },
      {
        id: "branches-5",
        title: "فرع الكرك",
        content: "فرع محافظة الكرك\nالعنوان: الكرك\nالهاتف: 0770449644",
        order: 5,
      },
      {
        id: "branches-6",
        title: "فروع أخرى",
        content: "يتم افتتاح فروع جديدة في جميع محافظات المملكة تباعاً",
        order: 6,
      },
    ],
    leaders: [],
  },
]

async function cleanupVisionSections() {
  try {
    const { data, error } = await supabase.from("page_sections").select("id,title").eq("page_id", "vision")

    if (error || !data) {
      if (error) {
        console.error("[v0] Error fetching vision sections for cleanup:", error)
      }
      return
    }

    const idsToDelete = data.filter((section: any) => !ALLOWED_VISION_SECTION_TITLES.has(section.title)).map((section: any) => section.id)

    if (idsToDelete.length > 0) {
      await supabase.from("page_sections").delete().in("id", idsToDelete)
    }
  } catch (error) {
    console.error("[v0] Error cleaning up vision sections:", error)
  }
}

export async function getAllSections(pageId: string) {
  try {
    console.log("[v0] Fetching sections for page:", pageId)

    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page_id", pageId)
      .order("order_number", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching sections from Supabase:", error)
      return []
    }

    if (!data) {
      console.log("[v0] No sections found for page:", pageId)
      return []
    }

    return data.map((s: any) => ({
      id: s.id.toString(),
      title: s.title,
      content: s.content,
      image: s.image,
      order_number: s.order_number,
    }))
  } catch (error) {
    console.error("[v0] Error in getAllSections:", error)
    return []
  }
}

export async function getPageContent(pageId: string): Promise<PageContent | null> {
  try {
    if (pageId === "vision") {
      await cleanupVisionSections()
    }
    console.log("[v0] Fetching page content for:", pageId)

    const { data: pageData, error: pageError } = await supabase
      .from("page_content")
      .select("*")
      .eq("page_id", pageId)
      .maybeSingle()

    if (pageError) {
      console.error("[v0] Error fetching page content from Supabase:", pageError)
      return getDefaultPageContent(pageId)
    }

    if (!pageData) {
      console.log("[v0] No page data found for:", pageId)
      return getDefaultPageContent(pageId)
    }

    // Fetch sections and leaders in parallel
    const [sectionsResult, leadersResult] = await Promise.all([
      supabase.from("page_sections").select("*").eq("page_id", pageId).order("order_number", { ascending: true }),
      pageId === "leadership"
        ? supabase.from("leaders").select("*").order("order_number", { ascending: true })
        : Promise.resolve({ data: [], error: null }),
    ])

    if (sectionsResult.error) {
      console.error("[v0] Error fetching sections:", sectionsResult.error)
    }

    if (leadersResult.error) {
      console.error("[v0] Error fetching leaders:", leadersResult.error)
    }

    const sections: PageSection[] =
      sectionsResult.data?.map((s: any) => ({
        id: s.id.toString(),
        title: s.title,
        content: s.content,
        image: s.image,
        order: s.order_number,
      })) || []

    const leaders: Leader[] =
      leadersResult.data?.map((l: any) => ({
        id: l.id.toString(),
        name: l.name,
        position: l.position,
        isMain: l.is_main,
        image: l.image,
        order: l.order_number,
      })) || []

    return {
      id: pageData.page_id,
      title: pageData.page_title,
      heroImage: pageData.hero_image,
      sections,
      leaders,
    }
  } catch (error) {
    console.error("[v0] Error in getPageContent:", error)
    return getDefaultPageContent(pageId)
  }
}

export async function getAllPages(): Promise<PageContent[]> {
  try {
    await cleanupVisionSections()
    const { data: pagesData, error } = await supabase.from("page_content").select("*")

    if (error) {
      console.error("[v0] Error fetching all pages from Supabase:", error)
      return DEFAULT_PAGES
    }

    if (!pagesData || pagesData.length === 0) {
      return DEFAULT_PAGES
    }

    // جلب جميع الأقسام والقيادات في استعلامات منفصلة
    const [sectionsResult, leadersResult] = await Promise.all([
      supabase.from("page_sections").select("*").order("order_number", { ascending: true }),
      supabase.from("leaders").select("*").order("order_number", { ascending: true }),
    ])

    const allSections = sectionsResult.data || []
    const allLeaders = leadersResult.data || []

    const mappedPages: PageContent[] = pagesData.map((page: any) => {
      const pageSections = allSections
        .filter((s: any) => s.page_id === page.page_id)
        .map((s: any) => ({
          id: s.id.toString(),
          title: s.title,
          content: s.content,
          image: s.image,
          order: s.order_number,
        }))

      const pageLeaders =
        page.page_id === "leadership"
          ? allLeaders.map((l: any) => ({
              id: l.id.toString(),
              name: l.name,
              position: l.position,
              isMain: l.is_main,
              image: l.image,
              order: l.order_number,
              bio: l.bio,
              email: l.email,
              phone: l.phone,
            }))
          : []

      return {
        id: page.page_id,
        title: page.page_title,
        heroImage: page.hero_image,
        sections: pageSections,
        leaders: pageLeaders,
        lastModified: page.last_modified,
      } as PageContent
    })

    const existingIds = new Set(mappedPages.map((page) => page.id))
    DEFAULT_PAGES.forEach((defaultPage) => {
      if (!existingIds.has(defaultPage.id)) {
        mappedPages.push(defaultPage)
      }
    })

    return mappedPages
  } catch (error) {
    console.error("[v0] Error in getAllPages:", error)
    return DEFAULT_PAGES
  }
}

export async function updatePageContent(pageId: string, content: Partial<PageContent>): Promise<void> {
  try {
    console.log("[v0] updatePageContent called with:", { pageId, content })

    const { data: existingPage } = await supabase.from("page_content").select("*").eq("page_id", pageId).maybeSingle()
    console.log("[v0] Existing page data:", existingPage)

    const updates: any = {
      page_id: pageId,
      last_modified: new Date().toISOString(),
    }

    if (content.title) {
      updates.page_title = content.title
    } else if (existingPage?.page_title) {
      updates.page_title = existingPage.page_title
    } else {
      updates.page_title = pageId
    }

    if (content.heroImage !== undefined) {
      updates.hero_image = content.heroImage
      console.log("[v0] Using heroImage (camelCase):", content.heroImage)
    } else if ((content as any).hero_image !== undefined) {
      updates.hero_image = (content as any).hero_image
      console.log("[v0] Using hero_image (underscore):", (content as any).hero_image)
    }

    console.log("[v0] Final updates to be saved:", updates)

    const { error } = await supabase.from("page_content").upsert(updates, {
      onConflict: "page_id",
    })

    if (error) {
      console.error("[v0] Error updating page content in Supabase:", error.message)
      throw error
    }

    console.log("[v0] Page content updated successfully for:", pageId)

    const { data: verifyData } = await supabase.from("page_content").select("hero_image").eq("page_id", pageId).single()
    console.log("[v0] Verified hero_image after update:", verifyData?.hero_image)
  } catch (error) {
    console.error("[v0] Error in updatePageContent:", error)
    throw error
  }
}

export async function updateSection(pageId: string, sectionId: string, updates: Partial<PageSection>): Promise<void> {
  try {
    const dbUpdates: any = {}
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.content !== undefined) dbUpdates.content = updates.content
    if (updates.image !== undefined) dbUpdates.image = updates.image
    if (updates.order !== undefined) dbUpdates.order_number = updates.order

    const { error } = await supabase.from("page_sections").update(dbUpdates).eq("id", sectionId).eq("page_id", pageId)

    if (error) {
      console.error("[v0] Error updating section in Supabase:", error)
      throw error
    }

    // Update page last_modified
    await supabase.from("page_content").update({ last_modified: new Date().toISOString() }).eq("page_id", pageId)
  } catch (error) {
    console.error("[v0] Error in updateSection:", error)
    throw error
  }
}

type NewSectionInput = {
  title: string
  content: string
  image?: string | null
  order?: number
}

export async function addSection(pageId: string, section: NewSectionInput): Promise<void> {
  try {
    // Get current max order
    const { data: sections } = await supabase
      .from("page_sections")
      .select("order_number")
      .eq("page_id", pageId)
      .order("order_number", { ascending: false })
      .limit(1)

    const maxOrder = sections && sections.length > 0 ? sections[0].order_number : 0
    const desiredOrder =
      typeof section.order === "number" && !Number.isNaN(section.order) && section.order > 0
        ? section.order
        : maxOrder + 1

    // Remove id from input data as Supabase uses UUID automatically
    const { error } = await supabase.from("page_sections").insert([
      {
        page_id: pageId,
        title: section.title,
        content: section.content,
        image: section.image || null,
        order_number: desiredOrder,
      },
    ])

    if (error) {
      console.error("[v0] Error adding section to Supabase:", error)
      throw error
    }

    // Update page last_modified
    await supabase.from("page_content").update({ last_modified: new Date().toISOString() }).eq("page_id", pageId)
  } catch (error) {
    console.error("[v0] Error in addSection:", error)
    throw error
  }
}

export async function deleteSection(pageId: string, sectionId: string): Promise<void> {
  try {
    const { error } = await supabase.from("page_sections").delete().eq("id", sectionId).eq("page_id", pageId)

    if (error) {
      console.error("[v0] Error deleting section from Supabase:", error)
      throw error
    }

    // Update page last_modified
    await supabase.from("page_content").update({ last_modified: new Date().toISOString() }).eq("page_id", pageId)
  } catch (error) {
    console.error("[v0] Error in deleteSection:", error)
    throw error
  }
}

export async function upsertSectionByTitle(
  pageId: string,
  title: string,
  content: string,
  orderNumber = 0,
  image?: string | null,
): Promise<void> {
  try {
    const { data: existingSection } = await supabase
      .from("page_sections")
      .select("id")
      .eq("page_id", pageId)
      .eq("title", title)
      .maybeSingle()

    if (existingSection?.id) {
      const { error } = await supabase
        .from("page_sections")
        .update({ content, image: image || null, order_number: orderNumber })
        .eq("id", existingSection.id)

      if (error) {
        console.error("[v0] Error updating section by title:", error)
        throw error
      }
    } else {
      const { error } = await supabase.from("page_sections").insert([
        {
          page_id: pageId,
          title,
          content,
          image: image || null,
          order_number: orderNumber,
        },
      ])

      if (error) {
        console.error("[v0] Error inserting section by title:", error)
        throw error
      }
    }

    await supabase.from("page_content").update({ last_modified: new Date().toISOString() }).eq("page_id", pageId)
  } catch (error) {
    console.error("[v0] Error in upsertSectionByTitle:", error)
    throw error
  }
}

// Image storage functions (kept for backward compatibility - can store in Supabase Storage later)
export async function saveImage(key: string, dataUrl: string): Promise<void> {
  if (typeof window === "undefined") return

  try {
    const pageId = key.replace("hero-", "")

    // Use upsert instead of update to create row if it doesn't exist
    await supabase.from("page_content").upsert(
      {
        page_id: pageId,
        hero_image: dataUrl,
        last_modified: new Date().toISOString(),
      },
      {
        onConflict: "page_id",
      },
    )

    // Also save to localStorage as cache
    const stored = localStorage.getItem(IMAGES_KEY)
    const images = stored ? JSON.parse(stored) : {}
    images[key] = dataUrl
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images))
  } catch (error) {
    console.error("[v0] Error saving image:", error)
  }
}

export function getImage(key: string): string | null {
  if (typeof window === "undefined") return null

  // Try localStorage first for quick access
  const stored = localStorage.getItem(IMAGES_KEY)
  const images = stored ? JSON.parse(stored) : {}
  return images[key] || null
}

export function deleteImage(key: string): void {
  if (typeof window === "undefined") return
  const stored = localStorage.getItem(IMAGES_KEY)
  const images = stored ? JSON.parse(stored) : {}
  delete images[key]
  localStorage.setItem(IMAGES_KEY, JSON.stringify(images))
}

export async function updateLeader(leaderId: string, updates: Partial<Leader>): Promise<void> {
  try {
    const dbUpdates: any = {}
    if (updates.name) dbUpdates.name = updates.name
    if (updates.position) dbUpdates.position = updates.position
    if (updates.isMain !== undefined) dbUpdates.is_main = updates.isMain
    if (updates.image !== undefined) dbUpdates.image = updates.image || null
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio || null
    if (updates.email !== undefined) dbUpdates.email = updates.email || null
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone || null
    if (updates.order) dbUpdates.order_number = updates.order

    const { error } = await supabase.from("leaders").update(dbUpdates).eq("id", leaderId)

    if (error) {
      console.error("[v0] Error updating leader in Supabase:", error)
      throw error
    }

    // Update page last_modified
    await supabase.from("page_content").update({ last_modified: new Date().toISOString() }).eq("page_id", "leadership")
  } catch (error) {
    console.error("[v0] Error in updateLeader:", error)
    throw error
  }
}

export async function addLeader(pageId: string, leader: Omit<Leader, "id" | "order">): Promise<void> {
  try {
    // Get current max order
    const { data: leaders } = await supabase
      .from("leaders")
      .select("order_number")
      .order("order_number", { ascending: false })
      .limit(1)

    const maxOrder = leaders && leaders.length > 0 ? leaders[0].order_number : 0

    const { error } = await supabase.from("leaders").insert([
      {
        name: leader.name,
        position: leader.position,
        is_main: leader.isMain,
        image: leader.image || null,
        order_number: maxOrder + 1,
        bio: leader.bio || null,
        email: leader.email || null,
        phone: leader.phone || null,
      },
    ])

    if (error) {
      console.error("[v0] Error adding leader to Supabase:", error)
      throw error
    }

    // Update page last_modified
    await supabase.from("page_content").update({ last_modified: new Date().toISOString() }).eq("page_id", pageId || "leadership")
  } catch (error) {
    console.error("[v0] Error in addLeader:", error)
    throw error
  }
}

export async function deleteLeader(pageId: string, leaderId: string): Promise<void> {
  try {
    const { error } = await supabase.from("leaders").delete().eq("id", leaderId)

    if (error) {
      console.error("[v0] Error deleting leader from Supabase:", error)
      throw error
    }

    // Update page last_modified
    await supabase.from("page_content").update({ last_modified: new Date().toISOString() }).eq("page_id", pageId || "leadership")
  } catch (error) {
    console.error("[v0] Error in deleteLeader:", error)
    throw error
  }
}

// Helper function to return default page content
function getDefaultPageContent(pageId: string): PageContent | null {
  return DEFAULT_PAGES.find((p) => p.id === pageId) || null
}

export async function getPartyStatistics(): Promise<PartyStatistics | null> {
  try {
    const { data, error } = await supabase
      .from("party_statistics")
      .select("*")
      .order("last_updated", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      if ((error as { code?: string }).code === "PGRST205") {
        return null
      }
      console.error("Error fetching party statistics:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getPartyStatistics:", error)
    return null
  }
}

export async function updatePartyStatistics(stats: {
  total_members: number
  female_members: number
  male_members: number
  youth_members: number
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("party_statistics")
      .insert({
      ...stats,
      last_updated: new Date().toISOString(),
    })
      .select()

    if (error) {
      const errorMessage =
        (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
          ? error.message
          : JSON.stringify(error)) || "Unknown Supabase error"
      console.error("Error updating party statistics:", errorMessage)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updatePartyStatistics:", error)
    return false
  }
}

export async function uploadImageToStorage(file: File, folder: string): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${folder}-${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabase.storage.from("hero-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("[v0] Error uploading image to storage:", error)
      return null
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("hero-images").getPublicUrl(filePath)

    console.log("[v0] Image uploaded successfully to:", publicUrl)
    return publicUrl
  } catch (error) {
    console.error("[v0] Error in uploadImageToStorage:", error)
    return null
  }
}

export async function deleteImageFromStorage(imageUrl: string): Promise<void> {
  try {
    if (!imageUrl || imageUrl.startsWith("data:") || imageUrl.startsWith("/")) {
      return
    }

    const url = new URL(imageUrl)
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/hero-images\/(.+)/)

    if (pathMatch && pathMatch[1]) {
      const path = pathMatch[1]
      const { error } = await supabase.storage.from("hero-images").remove([path])

      if (error) {
        console.error("[v0] Error deleting old image from storage:", error)
      } else {
        console.log("[v0] Old image deleted successfully from storage:", path)
      }
    }
  } catch (error) {
    console.error("[v0] Error in deleteImageFromStorage:", error)
  }
}
