"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import { UploadIcon, CheckCircleIcon, AlertCircle, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { SiteNavbar } from "@/components/site-navbar"

export default function JoinPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const [formData, setFormData] = useState({
    // البيانات الشخصية
    nationalId: "",
    phone: "",
    title: "",
    fullName: "",
    birthDate: "",
    gender: "",
    maritalStatus: "",
    idExpiry: "",
    email: "",
    governorate: "",
    district: "",
    electionDistrict: "",
    address: "",
    // التعليم والوظيفة
    qualification: "",
    major: "",
    university: "",
    graduationYear: "",
    profession: "",
    workplace: "",
    jobTitle: "",
    experience: "",
    // الانتماء الحزبي
    partyMembership: "",
    previousParty: "",
    resignationDate: "",
    // المرفقات
    idFrontFile: null as File | null,
    idBackFile: null as File | null,
    resignationFile: null as File | null,
    clearanceFile: null as File | null,
    photoFile: null as File | null,
  })
  const { toast } = useToast()

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (file) {
      // التحقق من حجم الملف (5 ميجابايت)
      if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "تنبيه",
        description: "حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت.",
      })
        return
      }

      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }))
    }
  }

  const handleRemoveFile = (fieldName: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }))
  }

  const getFilePreview = (file: File | null) => {
    if (!file) return null
    return URL.createObjectURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // محاكاة إرسال النموذج
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus("success")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/images/leadership.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <SiteNavbar />
        <div className="h-20" />

        {/* Main Content */}
        <div>
          <main className="container mx-auto px-4 max-w-5xl py-6">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">طلب الانتساب</h1>
              <p className="text-lg text-muted-foreground">انضم إلى حزب نماء وكن جزءاً من التغيير</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 right-0 left-0 h-1 bg-muted -z-10">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                  />
                </div>

                {/* Steps */}
                {[
                  { number: 1, title: "الشروط والأحكام" },
                  { number: 2, title: "البيانات الشخصية" },
                  { number: 3, title: "التعليم والوظيفة" },
                  { number: 4, title: "المرفقات" },
                ].map((step) => (
                  <div key={step.number} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        currentStep >= step.number
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "bg-background text-muted-foreground border-2 border-muted"
                      }`}
                    >
                      {currentStep > step.number ? <CheckCircle2 className="w-5 h-5" /> : step.number}
                    </div>
                    <span
                      className={`text-xs font-medium text-center max-w-[100px] ${
                        currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-t-lg">
                <CardTitle className="text-2xl text-center">
                  {currentStep === 1 && "الشروط والأحكام"}
                  {currentStep === 2 && "البيانات الشخصية"}
                  {currentStep === 3 && "التعليم والوظيفة"}
                  {currentStep === 4 && "المرفقات المطلوبة"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Terms and Conditions */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-primary mb-4">
                          قبل البدء بتقديم طلب الانتساب لعضوية حزب نماء، يرجى مراعاة الشروط التالية:
                        </h3>
                        <ul className="space-y-4 text-slate-700">
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>
                              قراءة{" "}
                              <Link
                                href="/principles"
                                target="_blank"
                                className="text-primary hover:text-primary/80 underline font-bold"
                              >
                                مبادئ حزب نماء والنظام الأساسي
                              </Link>{" "}
                              بشكل كامل
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>أن يكون عمر المتقدم 18 سنة أو أكثر</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>أن يكون المتقدم أردني الجنسية</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>
                              في حال كان المتقدم عضواً في حزب أردني آخر، يجب الاستقالة من الحزب السابق وإرفاق صورة عن
                              الاستقالة
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>
                              في حال وجود قضايا منظورة لدى المحاكم الأردنية، يجب إحضار شهادة عدم محكومية وإرفاقها
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>أن تكون الهوية الشخصية سارية المفعول وواضحة لإرفاقها على الوجهين</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-secondary mb-3">معلومات مهمة:</h3>
                        <p className="text-foreground leading-relaxed mb-3">
                          بعد انعقاد المؤتمر التأسيسي للحزب، أصبح بإمكان المواطن/المواطنة المقيم خارج الوطن أو من لم يمضِ
                          على حصوله على الجنسية الأردنية 10 سنوات التقدم بطلب الانتساب لعضوية حزب نماء.
                        </p>
                        <p className="text-foreground leading-relaxed font-medium">
                          لم يعد هناك فرق بين العضو المؤسس والعضو الجديد، حيث أصبح الجميع يُسمى "عضو عامل".
                        </p>
                      </div>

                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                        <p className="text-destructive font-medium">
                          <strong>تنويه:</strong> لا يعني تقديم طلب الانتساب ضمان الحصول على عضوية حزب نماء. سيتم دراسة
                          الطلب والرد عليه بالموافقة أو الاعتذار المسبب خلال فترة زمنية مناسبة.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Checkbox
                          id="terms"
                          checked={acceptedTerms}
                          onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                        />
                        <Label htmlFor="terms" className="text-base font-medium cursor-pointer">
                          أقر بأنني قرأت جميع الشروط والأحكام وأوافق عليها، وأرغب في المتابعة لتقديم طلب الانتساب
                        </Label>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Personal Information */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <p className="text-sm text-destructive font-medium">* يرجى تعبئة الطلب باللغة العربية فقط</p>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="nationalId" className="required">
                            الرقم الوطني *
                          </Label>
                          <Input
                            id="nationalId"
                            placeholder="أدخل الرقم الوطني"
                            maxLength={10}
                            required
                            className="text-right"
                            value={formData.nationalId}
                            onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="required">
                            رقم الهاتف *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="07XXXXXXXX"
                            maxLength={10}
                            required
                            className="text-right"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="title" className="required">
                            اللقب *
                          </Label>
                          <Select
                            required
                            onValueChange={(value) => setFormData({ ...formData, title: value })}
                            value={formData.title}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر اللقب" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mr">السيد</SelectItem>
                              <SelectItem value="mrs">السيدة</SelectItem>
                              <SelectItem value="miss">الآنسة</SelectItem>
                              <SelectItem value="dr">الدكتور</SelectItem>
                              <SelectItem value="eng">المهندس</SelectItem>
                              <SelectItem value="prof">الأستاذ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="required">
                            الاسم الرباعي *
                          </Label>
                          <Input
                            id="fullName"
                            placeholder="الاسم الكامل"
                            required
                            className="text-right"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="birthDate" className="required">
                            تاريخ الميلاد *
                          </Label>
                          <Input
                            id="birthDate"
                            type="date"
                            required
                            className="text-right"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="required">الجنس *</Label>
                          <RadioGroup
                            defaultValue="male"
                            className="flex gap-6"
                            onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            value={formData.gender}
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">ذكر</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">أنثى</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="maritalStatus" className="required">
                            الحالة الاجتماعية *
                          </Label>
                          <Select
                            required
                            onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
                            value={formData.maritalStatus}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الحالة الاجتماعية" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">أعزب/عزباء</SelectItem>
                              <SelectItem value="married">متزوج/متزوجة</SelectItem>
                              <SelectItem value="divorced">مطلق/مطلقة</SelectItem>
                              <SelectItem value="widowed">أرمل/أرملة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="idExpiry" className="required">
                            تاريخ انتهاء الهوية *
                          </Label>
                          <Input
                            id="idExpiry"
                            type="date"
                            required
                            className="text-right"
                            value={formData.idExpiry}
                            onChange={(e) => setFormData({ ...formData, idExpiry: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="email">البريد الإلكتروني</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            className="text-right"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-bold text-foreground mb-4">العنوان</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="governorate" className="required">
                              المحافظة *
                            </Label>
                            <Select
                              required
                              onValueChange={(value) => setFormData({ ...formData, governorate: value })}
                              value={formData.governorate}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="اختر المحافظة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="amman">عمان</SelectItem>
                                <SelectItem value="irbid">إربد</SelectItem>
                                <SelectItem value="zarqa">الزرقاء</SelectItem>
                                <SelectItem value="balqa">البلقاء</SelectItem>
                                <SelectItem value="madaba">مادبا</SelectItem>
                                <SelectItem value="karak">الكرك</SelectItem>
                                <SelectItem value="tafilah">الطفيلة</SelectItem>
                                <SelectItem value="maan">معان</SelectItem>
                                <SelectItem value="aqaba">العقبة</SelectItem>
                                <SelectItem value="jerash">جرش</SelectItem>
                                <SelectItem value="ajloun">عجلون</SelectItem>
                                <SelectItem value="mafraq">المفرق</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="district" className="required">
                              اللواء *
                            </Label>
                            <Input
                              id="district"
                              placeholder="أدخل اللواء"
                              required
                              className="text-right"
                              value={formData.district}
                              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="electionDistrict">رقم الدائرة الانتخابية</Label>
                            <Input
                              id="electionDistrict"
                              placeholder="رقم الدائرة الانتخابية"
                              className="text-right"
                              value={formData.electionDistrict}
                              onChange={(e) => setFormData({ ...formData, electionDistrict: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">عنوان السكن</Label>
                            <Input
                              id="address"
                              placeholder="عنوان السكن التفصيلي"
                              className="text-right"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Education and Employment */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-bold text-foreground mb-4">المؤهل العلمي</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="qualification" className="required">
                              المؤهل العلمي *
                            </Label>
                            <Select
                              required
                              onValueChange={(value) => setFormData({ ...formData, qualification: value })}
                              value={formData.qualification}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="اختر المؤهل العلمي" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="highschool">ثانوية عامة</SelectItem>
                                <SelectItem value="diploma">دبلوم</SelectItem>
                                <SelectItem value="bachelor">بكالوريوس</SelectItem>
                                <SelectItem value="master">ماجستير</SelectItem>
                                <SelectItem value="phd">دكتوراه</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="major">التخصص</Label>
                            <Input
                              id="major"
                              placeholder="التخصص الدراسي"
                              className="text-right"
                              value={formData.major}
                              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="university">الجامعة/المؤسسة التعليمية</Label>
                            <Input
                              id="university"
                              placeholder="اسم الجامعة أو المؤسسة"
                              className="text-right"
                              value={formData.university}
                              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="graduationYear">سنة التخرج</Label>
                            <Input
                              id="graduationYear"
                              type="number"
                              placeholder="سنة التخرج"
                              min="1950"
                              max="2025"
                              className="text-right"
                              value={formData.graduationYear}
                              onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-b pb-6">
                        <h3 className="text-lg font-bold text-foreground mb-4">الوظيفة والعمل</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="profession">المهنة</Label>
                            <Input
                              id="profession"
                              placeholder="المهنة الحالية"
                              className="text-right"
                              value={formData.profession}
                              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="workplace">جهة العمل</Label>
                            <Input
                              id="workplace"
                              placeholder="اسم جهة العمل"
                              className="text-right"
                              value={formData.workplace}
                              onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="jobTitle">المسمى الوظيفي</Label>
                            <Input
                              id="jobTitle"
                              placeholder="المسمى الوظيفي"
                              className="text-right"
                              value={formData.jobTitle}
                              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="experience">سنوات الخبرة</Label>
                            <Input
                              id="experience"
                              type="number"
                              placeholder="عدد سنوات الخبرة"
                              min="0"
                              className="text-right"
                              value={formData.experience}
                              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-4">الانتماء الحزبي</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>هل أنت عضو في حزب آخر حالياً؟</Label>
                            <RadioGroup
                              defaultValue="no"
                              className="flex gap-6"
                              onValueChange={(value) => setFormData({ ...formData, partyMembership: value })}
                              value={formData.partyMembership}
                            >
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="no" id="no-party" />
                                <Label htmlFor="no-party">لا</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="yes" id="yes-party" />
                                <Label htmlFor="yes-party">نعم</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="previousParty">اسم الحزب السابق (إن وجد)</Label>
                              <Input
                                id="previousParty"
                                placeholder="اسم الحزب"
                                className="text-right"
                                value={formData.previousParty}
                                onChange={(e) => setFormData({ ...formData, previousParty: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="resignationDate">تاريخ الاستقالة</Label>
                              <Input
                                id="resignationDate"
                                type="date"
                                className="text-right"
                                value={formData.resignationDate}
                                onChange={(e) => setFormData({ ...formData, resignationDate: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                            <p className="text-sm text-foreground">
                              <strong>ملاحظة:</strong> في حال كنت عضواً في حزب آخر، يجب إرفاق صورة عن الاستقالة في الخطوة
                              التالية
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Attachments */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-bold text-primary mb-3">المرفقات المطلوبة:</h3>
                        <ul className="space-y-2 text-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>صورة الهوية الشخصية (الوجه الأمامي)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>صورة الهوية الشخصية (الوجه الخلفي)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>صورة شخصية حديثة</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>صورة عن الاستقالة من الحزب السابق (إن وجد)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>شهادة عدم محكومية (في حال وجود قضايا منظورة)</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idFront" className="required">
                          صورة الهوية (الوجه الأمامي) *
                        </Label>
                        {!formData.idFrontFile ? (
                          <div
                            className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-primary/5"
                            onClick={() => document.getElementById("idFront")?.click()}
                          >
                            <UploadIcon className="w-10 h-10 text-primary mx-auto mb-3" />
                            <p className="text-sm text-foreground mb-2">اضغط للرفع أو اسحب الملف هنا</p>
                            <p className="text-xs text-muted-foreground">
                              الصيغ المدعومة: JPG, PNG, PDF (حد أقصى 5 ميجابايت)
                            </p>
                            <Input
                              id="idFront"
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "idFrontFile")}
                              required
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium">{formData.idFrontFile.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile("idFrontFile")}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            {formData.idFrontFile.type.startsWith("image/") && (
                              <div className="relative w-full h-40 mt-2 rounded-lg overflow-hidden">
                                <Image
                                  src={getFilePreview(formData.idFrontFile) || ""}
                                  alt="معاينة الهوية الأمامية"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idBack" className="required">
                          صورة الهوية (الوجه الخلفي) *
                        </Label>
                        {!formData.idBackFile ? (
                          <div
                            className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-primary/5"
                            onClick={() => document.getElementById("idBack")?.click()}
                          >
                            <UploadIcon className="w-10 h-10 text-primary mx-auto mb-3" />
                            <p className="text-sm text-foreground mb-2">اضغط للرفع أو اسحب الملف هنا</p>
                            <p className="text-xs text-muted-foreground">
                              الصيغ المدعومة: JPG, PNG, PDF (حد أقصى 5 ميجابايت)
                            </p>
                            <Input
                              id="idBack"
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "idBackFile")}
                              required
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium">{formData.idBackFile.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile("idBackFile")}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            {formData.idBackFile.type.startsWith("image/") && (
                              <div className="relative w-full h-40 mt-2 rounded-lg overflow-hidden">
                                <Image
                                  src={getFilePreview(formData.idBackFile) || ""}
                                  alt="معاينة الهوية الخلفية"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="photo" className="required">
                          صورة شخصية حديثة *
                        </Label>
                        {!formData.photoFile ? (
                          <div
                            className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-primary/5"
                            onClick={() => document.getElementById("photo")?.click()}
                          >
                            <UploadIcon className="w-10 h-10 text-primary mx-auto mb-3" />
                            <p className="text-sm text-foreground mb-2">اضغط للرفع أو اسحب الملف هنا</p>
                            <p className="text-xs text-muted-foreground">
                              الصيغ المدعومة: JPG, PNG (حد أقصى 5 ميجابايت)
                            </p>
                            <Input
                              id="photo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "photoFile")}
                              required
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium">{formData.photoFile.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile("photoFile")}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="relative w-32 h-40 mx-auto mt-2 rounded-lg overflow-hidden">
                              <Image
                                src={getFilePreview(formData.photoFile) || ""}
                                alt="معاينة الصورة الشخصية"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="resignation">صورة الاستقالة من الحزب السابق (إن وجد)</Label>
                        {!formData.resignationFile ? (
                          <div
                            className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-primary/5"
                            onClick={() => document.getElementById("resignation")?.click()}
                          >
                            <UploadIcon className="w-10 h-10 text-primary mx-auto mb-3" />
                            <p className="text-sm text-foreground mb-2">اضغط للرفع أو اسحب الملف هنا</p>
                            <p className="text-xs text-muted-foreground">
                              الصيغ المدعومة: JPG, PNG, PDF (حد أقصى 5 ميجابايت)
                            </p>
                            <Input
                              id="resignation"
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "resignationFile")}
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium">{formData.resignationFile.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile("resignationFile")}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clearance">شهادة عدم محكومية (إن وجدت قضايا منظورة)</Label>
                        {!formData.clearanceFile ? (
                          <div
                            className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-primary/5"
                            onClick={() => document.getElementById("clearance")?.click()}
                          >
                            <UploadIcon className="w-10 h-10 text-primary mx-auto mb-3" />
                            <p className="text-sm text-foreground mb-2">اضغط للرفع أو اسحب الملف هنا</p>
                            <p className="text-xs text-muted-foreground">
                              الصيغ المدعومة: JPG, PNG, PDF (حد أقصى 5 ميجابايت)
                            </p>
                            <Input
                              id="clearance"
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "clearanceFile")}
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon className="w-5 h-5 text-primary" />
                                <span className="text-sm font-medium">{formData.clearanceFile.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile("clearanceFile")}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                      className="gap-2 bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      السابق
                    </Button>

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={currentStep === 1 && !acceptedTerms}
                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        التالي
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      >
                        {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                        {isSubmitting ? (
                          <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Submission Status */}
            {submitStatus === "success" && (
              <div className="mt-8 p-6 bg-green-100 border border-green-400 text-green-800 rounded-lg flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6" />
                <p className="font-medium">تم إرسال طلب الانتساب بنجاح! سيتم مراجعة طلبك والرد عليك في أقرب وقت.</p>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mt-8 p-6 bg-red-100 border border-red-400 text-red-800 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <p className="font-medium">حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.</p>
              </div>
            )}

            {/* Help Section */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-2">هل تواجه مشكلة في تقديم الطلب؟</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <a href="tel:0791234567" className="text-primary hover:underline">
                  {"اتصل بنا: 0770449644"}
                </a>
                <span className="text-muted-foreground">|</span>
                <a href="mailto:info@namaaparty.jo" className="text-primary hover:underline">
                  info@namaaparty.jo
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
