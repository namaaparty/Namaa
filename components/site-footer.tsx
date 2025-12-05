import Link from "next/link"
import Image from "next/image"
import { Facebook } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-secondary/30 border-t py-8">
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
              <p className="text-muted-foreground text-sm leading-relaxed font-semibold">
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
              <Link
                href="/local-development"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                البرنامج الاقتصادي
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
              <Link href="/branches" className="text-muted-foreground hover:text-primary transition-colors">
                فروع الحزب
              </Link>
              <Link href="/leadership" className="text-muted-foreground hover:text-primary transition-colors">
                القيادات التنفيذية
              </Link>
              <Link href="/activities" className="text-muted-foreground hover:text-primary transition-colors">
                نشاطات الحزب
              </Link>
              <Link href="/join" className="text-muted-foreground hover:text-primary transition-colors">
                طلب الانتساب
              </Link>
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
            <div className="flex items-center gap-4 pt-4">
              <a
                href="https://www.facebook.com/namaaparty"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-[#1877F2]/10 transition-colors"
              >
                <Facebook className="w-5 h-5 text-[#1877F2]" />
              </a>
              <span className="text-sm text-muted-foreground">تابعنا على صفحتنا على الفيسبوك</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} حزب نماء. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}

