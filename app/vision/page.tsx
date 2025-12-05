import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Facebook, Target, TrendingUp, BookOpen, FileText } from "lucide-react"
import Image from "next/image"
import { getPageContent } from "@/lib/pages-storage"
import { SiteNavbar } from "@/components/site-navbar"

interface Section {
  id: string
  title: string
  content: string
  order_number: number
}

const FALLBACKS = {
  heroTitle: "رؤية الحزب",
  heroSubtitle: "نحو اقتصاد وطني قوي يمكّن المجتمع ويعزز منعة الدولة",
  introTitle: "رؤية ورسالة وأهداف الحزب",
  introDescription: "نعمل على بناء مستقبل اقتصادي مزدهر للأردن من خلال تمكين المجتمع وتعزيز المنعة الوطنية",
  strategicGoalsTitle: "أهداف الحزب",
  strategicGoalsList: [
    "رفع معدل النمو الاقتصادي من خلال استخدام أدوات جديدة لتحفيز النمو.",
    "تطوير منظومة اقتصادية شاملة للقطاعات كافة ممنهجة على أساس علمي ومهني تنهض بالاقتصاد الوطني، أساسها التنمية وغايتها النهضة، تحقق التنمية المستدامة، وتخلق مناخاً استثمارياً مميزاً وجاذباً.",
    "السعي نحو أمن غذائي وطني ودعم القطاع الزراعي ليساهم بشكل أكبر في النمو الاقتصادي.",
    "وضع برامج من شأنها الاستغلال الأمثل للثروات والمصادر الطبيعية وبما يضمن التوزيع العادل للثروة ومنع الاستغلال الجائر والمحافظة على البيئة.",
    "السعي لتطوير كافة مؤسسات التعليم وتعزيز دورها الأكاديمي والمجتمعي والبحثي ودعم المواهب والإبداع والأدب والثقافة والفنون.",
    "تمكين الشباب من التعلم والعمل والمشاركة السياسية وحمايتهم من مظاهر التعصب والتطرف والسلبية والانحلال وتعزيز القيم الوطنية لديهم.",
    "تمكين المرأة وتعزيز دورها في كافة المجالات السياسية والاقتصادية والاجتماعية، فهي مجتمع بأكمله وتمكينها على كافة المستويات مسؤولية وطنية.",
    "السعي لتطوير دور النقابات والاتحادات ومؤسسات المجتمع المدني ومؤسسات العمل التطوعي.",
    "المشاركة في الانتخابات وتشكيل الحكومات.",
  ],
  principlesCardTitle: "مبادئ الحزب",
  principlesIntroTitle: "المبادئ والمنطلقات",
  principlesIntroDescription: "ينطلق الحزب في رؤيته ورسالته من المبادئ التالية:",
  principlesList: [
    "إعداد برنامج اقتصادي شامل منطقي وواقعي وقابل للتنفيذ.",
    "تحسين مستوى الدخل الفردي للمواطن الأردني.",
    "حق المواطن في العيش الكريم والحصول على جميع الخدمات الأساسية وأهمها التعليم والصحة.",
    "تفعيل مبدأ الديمقراطية والشفافية والكفاءة في إدارة شؤون الحزب.",
    "تعزيز الترابط الوثيق بين القطاعات الاقتصادية من جهة، والسياسية والاجتماعية من جهة أخرى.",
  ],
}

const splitList = (value: string | undefined | null, fallbackList: string[]) => {
  if (!value || !value.trim()) {
    return fallbackList
  }

  const items = value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)

  return items.length > 0 ? items : fallbackList
}

const pickSectionContent = (sections: Section[] | undefined, title: string) => {
  return sections?.find((section) => section.title === title)?.content?.trim()
}

export default async function VisionPage() {
  const pageData = await getPageContent("vision")

  const heroImage = pageData?.heroImage || "/images/hero-event.jpg"
  const sections = pageData?.sections

  const heroTitle = pickSectionContent(sections, "عنوان الغلاف") || FALLBACKS.heroTitle
  const heroSubtitle = pickSectionContent(sections, "النص الفرعي للغلاف") || FALLBACKS.heroSubtitle
  const introTitle = pickSectionContent(sections, "عنوان المقدمة") || FALLBACKS.introTitle
  const introDescription = pickSectionContent(sections, "نص المقدمة") || FALLBACKS.introDescription
  const strategicGoalsTitle =
    pickSectionContent(sections, "عنوان أهداف الحزب") || FALLBACKS.strategicGoalsTitle
  const strategicGoalsList = splitList(pickSectionContent(sections, "قائمة أهداف الحزب"), FALLBACKS.strategicGoalsList)
  const principlesCardTitle =
    pickSectionContent(sections, "عنوان بطاقة المبادئ") || FALLBACKS.principlesCardTitle
  const principlesIntroTitle =
    pickSectionContent(sections, "عنوان فقرة المبادئ") || FALLBACKS.principlesIntroTitle
  const principlesIntroDescription =
    pickSectionContent(sections, "نص فقرة المبادئ") || FALLBACKS.principlesIntroDescription
  const principlesList = splitList(pickSectionContent(sections, "قائمة المبادئ"), FALLBACKS.principlesList)

  const visionSection = pageData?.sections?.find((s) => s.title === "الرؤية") || {
    title: "الرؤية",
    content: "تمكين المجتمع الأردني لبناء اقتصاد وطني قوي بما يعزز المنعة السياسية للمملكة.",
  }

  const missionSection = pageData?.sections?.find((s) => s.title === "الرسالة") || {
    title: "الرسالة",
    content: "شحذ الهمم وتكاتف الجهود على أساس المواطنة لتمكين المجتمع الأردني وتحقيق نهضته وفقا لقيم ثوابت الأمة",
  }

  const principlesBox = {
    introTitle: principlesIntroTitle,
    introDescription: principlesIntroDescription,
    principles: principlesList,
  }

  return (
    <main dir="rtl" className="min-h-screen bg-background relative">
      <SiteNavbar />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section with Background Image */}
        <section className="relative w-full h-[80vh] overflow-hidden">
          <Image
            src={heroImage || "/placeholder.svg"}
            alt="رؤيتنا ومبادئنا وأهدافنا"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-secondary/10 to-primary/25 border-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">{heroTitle}</h1>
              <p className="text-xl lg:text-2xl text-white/95 drop-shadow-lg">{heroSubtitle}</p>
            </div>
          </div>
        </section>

        {/* Content Section without Fixed Background */}
        <div className="py-0 text-card">
          <section className="relative shadow-none py-6 bg-muted">
            <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{introTitle}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{introDescription}</p>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="p-8 bg-background border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{visionSection.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">{visionSection.content}</p>
              </Card>

              <Card className="p-8 bg-background border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{missionSection.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">{missionSection.content}</p>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="p-8 bg-background border-secondary/20 hover:border-secondary/40 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold">{strategicGoalsTitle}</h2>
                </div>
                <ul className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  {strategicGoalsList.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary font-bold">{idx + 1}.</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-8 bg-background border-secondary/20 hover:border-secondary/40 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold">{principlesCardTitle}</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <div>
                    <h3 className="text-xl font-semibold text-primary">{principlesBox.introTitle}</h3>
                    <p className="mt-2">{principlesBox.introDescription}</p>
                    <ul className="space-y-2 mt-3 text-base">
                      {principlesBox.principles.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary font-bold">{idx + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-secondary/30 py-8 border-t">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <Link href="/" className="inline-block">
                  <Image
                    src="/logo-horizontal.png"
                    alt="حزب نماء"
                    width={200}
                    height={50}
                    className="h-14 w-auto object-contain"
                  />
                </Link>
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة
                  </p>
                  <p className="text-muted-foreground text-sm font-semibold">نهضة تنموية اقتصادية شاملة</p>
                  <p className="text-muted-foreground text-xs">نمو – عدالة – تأهيل – تشغيل – تطوير</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">روابط سريعة</h3>
                <div className="flex flex-col gap-2">
                  <Link href="/vision" className="text-muted-foreground hover:text-primary transition-colors">
                    رؤية الحزب
                  </Link>
                  <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                    الأخبار
                  </Link>
                <Link href="/statements" className="text-muted-foreground hover:text-primary transition-colors">
                  البيانات الصادرة
                </Link>
                  <Link href="/budgets" className="text-muted-foreground hover:text-primary transition-colors">
                    ميزانيات الحزب
                  </Link>
                <Link href="/constitution" className="text-muted-foreground hover:text-primary transition-colors">
                  النظام الرئيسي
                </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">روابط هامة</h3>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://iec.jo/ar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    الهيئة المستقلة للانتخاب
                  </a>
                  <a
                    href="https://jordan.gov.jo/AR/List/%D8%A7%D9%84%D8%AC%D9%87%D8%A7%D8%AA_%D8%A7%D9%84%D8%AD%D9%83%D9%88%D9%85%D9%8A%D8%A9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    موقع الحكومة الأردنية
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">تواصل معنا</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <a href="mailto:info@namaaparty.com" className="hover:text-primary transition-colors">
                      info@namaaparty.com
                    </a>
                  </p>
                  <p>
                    <a href="tel:+962770449644" className="hover:text-primary transition-colors">
                      رقم الهاتف: 0770449644
                    </a>
                  </p>
                  <p>
                    <a
                      href="https://wa.me/962770449644"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      واتساب: 0770449644
                    </a>
                  </p>
                  <p className="text-sm pt-2">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Ibrahim+Al+Naimat+Complex,+Um+Al+Summaq+St+4,+Amman"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      عمان / لواء بيادر وادي السير – شارع أم السماق امتداد شارع مكة – مجمع الفيصل – عمارة رقم (4) –
                      الطابق (1)
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <a
                    href="https://www.facebook.com/namaaparty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1877F2]/10 transition-colors group"
                  >
                    <Facebook className="w-5 h-5 text-[#1877F2]" />
                    <span className="text-sm text-muted-foreground group-hover:text-[#1877F2] transition-colors">
                      تابعنا على صفحتنا على الفيسبوك
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 text-center border-card">
              <p className="text-muted-foreground text-sm">© 2025 حزب نماء. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
