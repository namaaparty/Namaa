"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Home, Pencil, Trash2, Save, ArrowRight, X, FileText, LogOut, Lock, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAdminAccess } from "@/hooks/use-admin-access"
import { ConfirmDialog } from "@/components/confirm-dialog"

import type React from "react"
import {
  getAllPages,
  updateSection,
  addSection,
  deleteSection,
  getImage,
  updateLeader,
  addLeader,
  deleteLeader,
  updatePageContent,
  deleteImageFromStorage, // Added import
  uploadImageToStorage, // Added import
  upsertSectionByTitle,
  type PageContent,
  type PageSection,
  type Leader,
} from "@/lib/pages-storage"
import Link from "next/link"

type DeleteContext =
  | { type: "section"; id: string; title: string; pageId: string }
  | { type: "leader"; id: string; title: string; pageId: string }

const VISION_DEFAULTS = {
  heroTitle: "رؤية الحزب",
  heroSubtitle: "نحو اقتصاد وطني قوي يمكّن المجتمع ويعزز منعة الدولة",
  introTitle: "رؤية ورسالة وأهداف الحزب",
  introDescription: "نعمل على بناء مستقبل اقتصادي مزدهر للأردن من خلال تمكين المجتمع وتعزيز المنعة الوطنية",
  visionText: "تمكين المجتمع الأردني لبناء اقتصاد وطني قوي بما يعزز المنعة السياسية للمملكة.",
  missionText:
    "شحذ الهمم وتكاتف الجهود على أساس المواطنة لتمكين المجتمع الأردني وتحقيق نهضته وفقا لقيم ثوابت الأمة.",
  goalsTitle: "أهداف الحزب",
  goalsList: [
    "رفع معدل النمو الاقتصادي من خلال استخدام أدوات جديدة لتحفيز النمو.",
    "تطوير منظومة اقتصادية شاملة للقطاعات كافة ممنهجة على أساس علمي ومهني تنهض بالاقتصاد الوطني، أساسها التنمية وغايتها النهضة، تحقق التنمية المستدامة، وتخلق مناخاً استثمارياً مميزاً وجاذباً.",
    "السعي نحو أمن غذائي وطني ودعم القطاع الزراعي ليساهم بشكل أكبر في النمو الاقتصادي.",
    "وضع برامج من شأنها الاستغلال الأمثل للثروات والمصادر الطبيعية وبما يضمن التوزيع العادل للثروة ومنع الاستغلال الجائر والمحافظة على البيئة.",
    "السعي لتطوير كافة مؤسسات التعليم وتعزيز دورها الأكاديمي والمجتمعي والبحثي ودعم المواهب والإبداع والأدب والثقافة والفنون.",
    "تمكين الشباب من التعلم والعمل والمشاركة السياسية وحمايتهم من مظاهر التعصب والتطرف والسلبية والانحلال وتعزيز القيم الوطنية لديهم.",
    "تمكين المرأة وتعزيز دورها في كافة المجالات السياسية والاقتصادية والاجتماعية، فهي مجتمع بأكمله وتمكينها على كافة المستويات مسؤولية وطنية.",
    "السعي لتطوير دور النقابات والاتحادات ومؤسسات المجتمع المدني ومؤسسات العمل التطوعي.",
    "المشاركة في الانتخابات وتشكيل الحكومات.",
  ].join("\n"),
  principlesCardTitle: "مبادئ الحزب",
  principlesIntroTitle: "المبادئ والمنطلقات",
  principlesIntroDescription: "ينطلق الحزب في رؤيته ورسالته من المبادئ التالية:",
  principlesList: [
    "إعداد برنامج اقتصادي شامل منطقي وواقعي وقابل للتنفيذ.",
    "تحسين مستوى الدخل الفردي للمواطن الأردني.",
    "حق المواطن في العيش الكريم والحصول على جميع الخدمات الأساسية وأهمها التعليم والصحة.",
    "تفعيل مبدأ الديمقراطية والشفافية والكفاءة في إدارة شؤون الحزب.",
    "تعزيز الترابط الوثيق بين القطاعات الاقتصادية من جهة، والسياسية والاجتماعية من جهة أخرى.",
  ].join("\n"),
}

export default function AdminPagesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { loading: authLoading, authorized, signOut } = useAdminAccess(["admin"])

  const [pageContents, setPageContents] = useState<PageContent[]>([])
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null)
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null)
  const [newSectionData, setNewSectionData] = useState({ title: "", content: "", image: "" })
  const [newLeaderData, setNewLeaderData] = useState({
    name: "",
    position: "",
    bio: "",
    isMain: false,
    image: "",
    email: "",
    phone: "",
  })
  const resetNewSectionForm = () => {
    setNewSectionData({ title: "", content: "", image: "" })
    setSectionImageFile(null)
  }

  const resetNewLeaderForm = () => {
    setNewLeaderData({
      name: "",
      position: "",
      bio: "",
      isMain: false,
      image: "",
      email: "",
      phone: "",
    })
  }
  const [showAddSection, setShowAddSection] = useState(false)
  const [showAddLeader, setShowAddLeader] = useState(false)
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)
  const [sectionImageFile, setSectionImageFile] = useState<File | null>(null)
  const [branchForm, setBranchForm] = useState({
    title: "",
    address: "",
    phone: "",
    coordinates: "",
  })
  const [branchSaving, setBranchSaving] = useState(false)
  const [showBranchForm, setShowBranchForm] = useState(false)
  const [economicProgramForm, setEconomicProgramForm] = useState({
    title: "",
    content: "",
    order: "",
    image: "",
    type: "pillar" as "pillar" | "goal",
  })
  const [programSaving, setProgramSaving] = useState(false)
  const [showEconomicProgramForm, setShowEconomicProgramForm] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  })
  const [leaderFormData, setLeaderFormData] = useState({
    name: "",
    position: "",
    bio: "",
    isMain: false,
    image: "",
    email: "",
    phone: "",
  })
  const [visionContentForm, setVisionContentForm] = useState({
    heroTitle: VISION_DEFAULTS.heroTitle,
    heroSubtitle: VISION_DEFAULTS.heroSubtitle,
    introTitle: VISION_DEFAULTS.introTitle,
    introDescription: VISION_DEFAULTS.introDescription,
    visionText: VISION_DEFAULTS.visionText,
    missionText: VISION_DEFAULTS.missionText,
    goalsTitle: VISION_DEFAULTS.goalsTitle,
    goalsList: VISION_DEFAULTS.goalsList,
    principlesCardTitle: VISION_DEFAULTS.principlesCardTitle,
    principlesIntroTitle: VISION_DEFAULTS.principlesIntroTitle,
    principlesIntroDescription: VISION_DEFAULTS.principlesIntroDescription,
    principlesList: VISION_DEFAULTS.principlesList,
  })
  const [savingVisionContent, setSavingVisionContent] = useState(false)

  const isInlineImageValue = (value?: string | null) => {
    if (!value) return false
    return value.startsWith("data:") || value.startsWith("http")
  }

  const resolveLeaderImageValue = (value?: string | null) => {
    if (!value) return null
    if (isInlineImageValue(value)) return value
    return getImage(value) || value
  }

  const getLeaderImagePreview = (value?: string | null) => {
    if (!value) return null
    if (isInlineImageValue(value)) return value
    return getImage(value)
  }
  const [heroImageData, setHeroImageData] = useState<string | null>(null) // Changed to allow null
  const [isSaving, setIsSaving] = useState(false) // Added state for saving

  const [viewMode, setViewMode] = useState<"sections" | "leaders">("sections")
  const [deleteContext, setDeleteContext] = useState<DeleteContext | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (authorized) {
      loadPages()
    }
  }, [authorized])

  useEffect(() => {
    if (!selectedPage || selectedPage.id !== "vision") {
      setVisionContentForm({
        heroTitle: VISION_DEFAULTS.heroTitle,
        heroSubtitle: VISION_DEFAULTS.heroSubtitle,
        introTitle: VISION_DEFAULTS.introTitle,
        introDescription: VISION_DEFAULTS.introDescription,
        visionText: VISION_DEFAULTS.visionText,
        missionText: VISION_DEFAULTS.missionText,
        goalsTitle: VISION_DEFAULTS.goalsTitle,
        goalsList: VISION_DEFAULTS.goalsList,
        principlesCardTitle: VISION_DEFAULTS.principlesCardTitle,
        principlesIntroTitle: VISION_DEFAULTS.principlesIntroTitle,
        principlesIntroDescription: VISION_DEFAULTS.principlesIntroDescription,
        principlesList: VISION_DEFAULTS.principlesList,
      })
      return
    }

    const getValue = (title: string, fallback: string) =>
      selectedPage.sections.find((section) => section.title === title)?.content || fallback

    setVisionContentForm({
      heroTitle: getValue("عنوان الغلاف", VISION_DEFAULTS.heroTitle),
      heroSubtitle: getValue("النص الفرعي للغلاف", VISION_DEFAULTS.heroSubtitle),
      introTitle: getValue("عنوان المقدمة", VISION_DEFAULTS.introTitle),
      introDescription: getValue("نص المقدمة", VISION_DEFAULTS.introDescription),
      visionText: getValue("الرؤية", VISION_DEFAULTS.visionText),
      missionText: getValue("الرسالة", VISION_DEFAULTS.missionText),
      goalsTitle: getValue("عنوان أهداف الحزب", VISION_DEFAULTS.goalsTitle),
      goalsList: getValue("قائمة أهداف الحزب", VISION_DEFAULTS.goalsList),
      principlesCardTitle: getValue("عنوان بطاقة المبادئ", VISION_DEFAULTS.principlesCardTitle),
      principlesIntroTitle: getValue("عنوان فقرة المبادئ", VISION_DEFAULTS.principlesIntroTitle),
      principlesIntroDescription: getValue("نص فقرة المبادئ", VISION_DEFAULTS.principlesIntroDescription),
      principlesList: getValue("قائمة المبادئ", VISION_DEFAULTS.principlesList),
    })
  }, [selectedPage])

  useEffect(() => {
    if (!selectedPage || selectedPage.id !== "branches") {
      setBranchForm({
        title: "",
        address: "",
        phone: "",
        coordinates: "",
      })
      setBranchSaving(false)
    }
  }, [selectedPage])

  const getPageDisplayName = (page: PageContent | null) => {
    if (!page) {
      return "إدارة محتوى الصفحات"
    }
    const title = page.title?.trim() || page.id
    return `إدارة محتوى ${title}`
  }

  const handleLogout = async () => {
    await signOut()
    setPageContents([])
    router.push("/admin/login")
  }

  const loadPages = async () => {
    try {
      console.log("[v0] Loading all pages from Supabase")
      const allPages = await getAllPages()

      // Sort pages to match navbar order
      const navbarOrder = ["home", "vision", "leadership", "localDevelopment", "statements", "branches"]
      
      const sortedPages = [...allPages].sort((a, b) => {
        const indexA = navbarOrder.indexOf(a.id)
        const indexB = navbarOrder.indexOf(b.id)
        
        // If both are in navbar, sort by navbar order
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB
        }
        // If only one is in navbar, prioritize it
        if (indexA !== -1) return -1
        if (indexB !== -1) return 1
        
        // Otherwise sort alphabetically
        const titleA = a.title?.trim() || a.id
        const titleB = b.title?.trim() || b.id
        return titleA.localeCompare(titleB, "ar", { sensitivity: "base" })
      })

      const filteredPages = sortedPages.filter(
        (page) => page.id !== "activities" && page.id !== "goals" && page.id !== "constitution" && page.id !== "news",
      )

      setPageContents(filteredPages)

      toast({
        title: "تم التحديث",
        description: "تم تحميل جميع الصفحات من Supabase",
      })

      return sortedPages
    } catch (error) {
      console.error("[v0] Error loading pages:", error)
      toast({
        title: "خطأ",
        description: "فشل تحميل الصفحات",
        variant: "destructive",
      })
      return []
    }
  }

  const handleRefresh = async () => {
    await loadPages()
  }

  const handleSelectPage = (page: PageContent) => {
    setSelectedPage(page)
    setEditingSection(null)
    setEditingLeader(null)
    setViewMode(page.id === "leadership" ? "leaders" : "sections")
    setShowAddSection(false)
    setNewSectionData({ title: "", content: "", image: "" })
    setSectionImageFile(null)
    if (page.heroImage) {
      // Assuming getImage can fetch data URLs directly or a placeholder if not found
      const heroImg = getImage(page.heroImage)
      setHeroImageData(heroImg || "") // Ensure it's a string
    } else {
      setHeroImageData("") // Ensure it's an empty string if no image
    }
  }

  const handleAddBranch = async () => {
    if (!selectedPage || selectedPage.id !== "branches") return
    if (!branchForm.title.trim() || !branchForm.address.trim()) {
      toast({
        variant: "destructive",
        title: "تنبيه",
        description: "يرجى إدخال اسم الفرع وعنوانه على الأقل.",
      })
      return
    }

    try {
      setBranchSaving(true)
      const parts = [branchForm.address.trim()]
      if (branchForm.phone.trim()) {
        parts.push(`هاتف: ${branchForm.phone.trim()}`)
      }
      if (branchForm.coordinates.trim()) {
        parts.push(branchForm.coordinates.trim())
      }
      const content = parts.join(" | ")

      await addSection("branches", {
        title: branchForm.title.trim(),
        content,
      })

      setBranchForm({
        title: "",
        address: "",
        phone: "",
        coordinates: "",
      })

      const updatedPages = await loadPages()
      const refreshed = updatedPages.find((p) => p.id === "branches")
      if (refreshed) {
        setSelectedPage(refreshed)
      }

      toast({
        title: "تم إضافة الفرع",
        description: "تمت إضافة الفرع الجديد إلى قائمة الفروع.",
      })
    } catch (error) {
      console.error("[v0] Error adding branch:", error)
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "تعذر إضافة الفرع، حاول مرة أخرى.",
      })
    } finally {
      setBranchSaving(false)
    }
  }

  const handleAddEconomicProgram = async () => {
    if (!selectedPage || selectedPage.id !== "localDevelopment") return
    if (!economicProgramForm.title.trim() || !economicProgramForm.content.trim()) {
      toast({
        variant: "destructive",
        title: "تنبيه",
        description: "يرجى إدخال عنوان ووصف للبرنامج الاقتصادي.",
      })
      return
    }

    const rawOrderValue = economicProgramForm.order.trim()
      ? Number(economicProgramForm.order.trim())
      : undefined

    if (rawOrderValue !== undefined && Number.isNaN(rawOrderValue)) {
      toast({
        variant: "destructive",
        title: "ترتيب غير صالح",
        description: "يرجى إدخال رقم صحيح لترتيب العرض.",
      })
      return
    }

    const isPillar = economicProgramForm.type === "pillar"
    let finalOrder: number

    if (rawOrderValue === undefined) {
      finalOrder = isPillar ? 1 : 4
    } else {
      finalOrder = Math.max(1, rawOrderValue)
    }

    if (isPillar && finalOrder > 3) {
      finalOrder = 3
    }

    if (!isPillar && finalOrder < 4) {
      finalOrder = 4
    }

    try {
      setProgramSaving(true)
      await addSection("localDevelopment", {
        title: economicProgramForm.title.trim(),
        content: economicProgramForm.content.trim(),
        image: economicProgramForm.image || "",
        order: finalOrder,
      })

      setEconomicProgramForm({
        title: "",
        content: "",
        order: "",
        image: "",
        type: "pillar",
      })

      const updatedPages = await loadPages()
      const refreshed = updatedPages.find((p) => p.id === "localDevelopment")
      if (refreshed) {
        setSelectedPage(refreshed)
      }

      toast({
        title: "تمت الإضافة",
        description: "تمت إضافة عنصر جديد إلى البرنامج الاقتصادي.",
      })
    } catch (error) {
      console.error("[v0] Error adding economic program section:", error)
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "تعذر إضافة البرنامج الاقتصادي، حاول مرة أخرى.",
      })
    } finally {
      setProgramSaving(false)
    }
  }

  const openAddSectionForm = () => {
    resetNewSectionForm()
    setEditingSection(null)
    setShowAddSection(true)
    setEditingLeader(null)
  }

  const openAddLeaderForm = () => {
    resetNewLeaderForm()
    setEditingLeader(null)
    setShowAddLeader(true)
    setShowAddSection(false)
  }

  const handleEditSection = (section: PageSection) => {
    setEditingSection(section)
    setFormData({
      title: section.title,
      content: section.content,
      image: section.image || "",
    })
  }

  const handleVisionFieldChange = (field: keyof typeof visionContentForm, value: string) => {
    setVisionContentForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveVisionContent = async () => {
    if (!selectedPage || selectedPage.id !== "vision") return

    try {
      setSavingVisionContent(true)
      await Promise.all([
        upsertSectionByTitle("vision", "عنوان الغلاف", visionContentForm.heroTitle, -5),
        upsertSectionByTitle("vision", "النص الفرعي للغلاف", visionContentForm.heroSubtitle, -4),
        upsertSectionByTitle("vision", "عنوان المقدمة", visionContentForm.introTitle, -3),
        upsertSectionByTitle("vision", "نص المقدمة", visionContentForm.introDescription, -2),
        upsertSectionByTitle("vision", "الرؤية", visionContentForm.visionText, 1),
        upsertSectionByTitle("vision", "الرسالة", visionContentForm.missionText, 2),
        upsertSectionByTitle("vision", "عنوان أهداف الحزب", visionContentForm.goalsTitle, 30),
        upsertSectionByTitle("vision", "قائمة أهداف الحزب", visionContentForm.goalsList, 31),
        upsertSectionByTitle("vision", "عنوان بطاقة المبادئ", visionContentForm.principlesCardTitle, 32),
        upsertSectionByTitle("vision", "عنوان فقرة المبادئ", visionContentForm.principlesIntroTitle, 33),
        upsertSectionByTitle("vision", "نص فقرة المبادئ", visionContentForm.principlesIntroDescription, 34),
        upsertSectionByTitle("vision", "قائمة المبادئ", visionContentForm.principlesList, 35),
      ])

      await loadPages()

      toast({
        title: "تم حفظ محتوى رؤية الحزب",
        description: "تم تحديث أقسام الرؤية، الرسالة، الأهداف والمبادئ على الصفحة العامة.",
      })
    } catch (error) {
      console.error("[v0] Error saving vision content:", error)
      toast({
        variant: "destructive",
        title: "خطأ في الحفظ",
        description: "تعذر حفظ تحديثات رؤية الحزب، حاول مرة أخرى.",
      })
    } finally {
      setSavingVisionContent(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result as string
        setFormData({ ...formData, image: dataUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (selectedPage && editingSection) {
      try {
        console.log("[v0] Saving section:", editingSection.id, "for page:", selectedPage.id)

        await updateSection(selectedPage.id, editingSection.id, {
          title: formData.title,
          content: formData.content,
          image: formData.image || undefined,
        })

        console.log("[v0] Section updated successfully")

        const updatedSections = selectedPage.sections.map((s) =>
          s.id === editingSection.id
            ? { ...s, title: formData.title, content: formData.content, image: formData.image || "" }
            : s,
        )

        setSelectedPage({
          ...selectedPage,
          sections: updatedSections,
        })

        setPageContents(pageContents.map((p) => (p.id === selectedPage.id ? { ...p, sections: updatedSections } : p)))

        setEditingSection(null)
        setFormData({ title: "", content: "", image: "" })

        const updatedPages = await loadPages()
        const refreshedPage = updatedPages.find((p) => p.id === selectedPage.id)
        if (refreshedPage) {
          setSelectedPage(refreshedPage)
        }

        toast({
          title: "تم الحفظ بنجاح",
          description: "تم حفظ التعديلات",
        })
      } catch (error) {
        console.error("[v0] Error saving section:", error)
        toast({
          title: "خطأ في الحفظ",
          description: "فشل حفظ التعديلات",
          variant: "destructive",
        })
      }
    }
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleAddSection = async () => {
    if (selectedPage && newSectionData.title && newSectionData.content) {
      try {
        let imageData = ""
        if (sectionImageFile) {
          imageData = await convertImageToBase64(sectionImageFile)
        }

        await addSection(selectedPage.id, {
          title: newSectionData.title,
          content: newSectionData.content,
          image: imageData || undefined,
        })

        setNewSectionData({ title: "", content: "", image: "" })
        setSectionImageFile(null)
        setShowAddSection(false)
        const updatedPages = await loadPages()
        const updatedPage = updatedPages.find((p) => p.id === selectedPage.id)
        if (updatedPage) setSelectedPage(updatedPage)

        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة القسم الجديد",
        })
      } catch (error) {
        console.error("[v0] Error adding section:", error)
        toast({
          title: "خطأ في الإضافة",
          description: "حدث خطأ أثناء إضافة القسم",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteSection = (section: PageSection) => {
    if (!selectedPage) return
    setDeleteContext({
      type: "section",
      id: section.id,
      title: section.title,
      pageId: selectedPage.id,
        })
  }

  const handleCancel = () => {
    setEditingSection(null)
    setFormData({ title: "", content: "", image: "" })
  }

  const handleBack = () => {
    setSelectedPage(null)
    setEditingSection(null)
    setEditingLeader(null)
  }

  const handleEditLeader = (leader: Leader) => {
    setEditingLeader(leader)
    setLeaderFormData({
      name: leader.name,
      position: leader.position,
      bio: leader.bio || "",
      isMain: leader.isMain,
      image: leader.image || "",
      email: leader.email || "",
      phone: leader.phone || "",
    })
  }

  const handleLeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result as string
        setLeaderFormData({ ...leaderFormData, image: dataUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNewLeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setNewLeaderData((prev) => ({ ...prev, image: "" }))
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      setNewLeaderData((prev) => ({ ...prev, image: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const handleSaveLeader = async () => {
    if (!editingLeader) return
    try {
      const resolvedImage = resolveLeaderImageValue(leaderFormData.image)
      await updateLeader(editingLeader.id, {
        name: leaderFormData.name,
        position: leaderFormData.position,
        bio: leaderFormData.bio,
        isMain: leaderFormData.isMain,
        image: resolvedImage ?? "",
        email: leaderFormData.email,
        phone: leaderFormData.phone,
      })

      setEditingLeader(null)
      setLeaderFormData({ name: "", position: "", bio: "", isMain: false, image: "", email: "", phone: "" })
      const updatedPages = await loadPages()
      const updatedPage = updatedPages.find((p) => p.id === selectedPage?.id)
      if (updatedPage) setSelectedPage(updatedPage)

      toast({
        title: "تم التحديث",
        description: "تم حفظ بيانات القيادي بنجاح",
      })
    } catch (error) {
      console.error("[v0] Error saving leader:", error)
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "تعذر حفظ بيانات القيادي",
      })
    }
  }

  const handleAddLeader = async () => {
    if (selectedPage && newLeaderData.name && newLeaderData.position && newLeaderData.bio) {
      try {
        const resolvedImage = resolveLeaderImageValue(newLeaderData.image)

        await addLeader(selectedPage.id, {
          name: newLeaderData.name,
          position: newLeaderData.position,
          bio: newLeaderData.bio,
          isMain: newLeaderData.isMain,
          image: resolvedImage || null,
          email: newLeaderData.email,
          phone: newLeaderData.phone,
        })

        setNewLeaderData({ name: "", position: "", bio: "", isMain: false, image: "", email: "", phone: "" })
        setShowAddLeader(false)
        const updatedPages = await loadPages()
        const updatedPage = updatedPages.find((p) => p.id === selectedPage.id)
        if (updatedPage) setSelectedPage(updatedPage)

        toast({
          title: "تمت الإضافة بنجاح",
          description: "تم إضافة القيادي الجديد",
        })
      } catch (error) {
        console.error("[v0] Error adding leader:", error)
        toast({
          title: "خطأ في الإضافة",
          description: "حدث خطأ أثناء إضافة القيادي",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteLeader = (leader: Leader) => {
    if (!selectedPage) return
    setDeleteContext({
      type: "leader",
      id: leader.id,
      title: leader.name,
      pageId: selectedPage.id,
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteContext) return
    setDeleteLoading(true)

    try {
      if (deleteContext.type === "section") {
        await deleteSection(deleteContext.pageId, deleteContext.id)
      } else {
        await deleteLeader(deleteContext.pageId, deleteContext.id)
      }

      const updatedPages = await loadPages()
      const updatedPage = updatedPages.find((p) => p.id === deleteContext.pageId)
      if (updatedPage) {
        setSelectedPage(updatedPage)
      }

        toast({
          title: "تم الحذف بنجاح",
        description:
          deleteContext.type === "section" ? "تم حذف القسم من الصفحة" : "تم حذف القيادي من قائمة القيادة",
        variant: "success",
        })
      } catch (error) {
      console.error("[v0] Error confirming delete:", error)
        toast({
          title: "خطأ في الحذف",
        description: "حدث خطأ أثناء تنفيذ طلب الحذف",
          variant: "destructive",
        })
    } finally {
      setDeleteLoading(false)
      setDeleteContext(null)
    }
  }

  const handleCancelLeader = () => {
    setEditingLeader(null)
    setLeaderFormData({ name: "", position: "", bio: "", isMain: false, image: "", email: "", phone: "" })
  }

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHeroImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result as string
        setHeroImageData(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveHeroImage = async () => {
    if (selectedPage && heroImageFile) {
      try {
        console.log("[v0] Saving hero image for page:", selectedPage.id)
        setIsSaving(true)

        if (
          selectedPage.heroImage &&
          !selectedPage.heroImage.startsWith("data:") &&
          !selectedPage.heroImage.startsWith("/")
        ) {
          await deleteImageFromStorage(selectedPage.heroImage)
        }

        const imageUrl = await uploadImageToStorage(heroImageFile, selectedPage.id)

        if (!imageUrl) {
          throw new Error("Failed to upload image")
        }

        await updatePageContent(selectedPage.id, { heroImage: imageUrl })

        console.log("[v0] Hero image saved successfully")

        const updatedPages = await loadPages()
        const updatedPage = updatedPages.find((p) => p.id === selectedPage.id)
        if (updatedPage) {
          setSelectedPage(updatedPage)
          setHeroImageData(updatedPage.heroImage || null) // Ensure it's string or null
        }

        setHeroImageFile(null)
        setIsSaving(false)

        toast({
          title: "تم الحفظ بنجاح",
          description: "تم تحميل الصورة إلى Supabase وتحديث العرض",
        })
      } catch (error) {
        console.error("[v0] Error saving hero image:", error)
        setIsSaving(false)
        toast({
          variant: "destructive",
          title: "خطأ في الحفظ",
          description: "حدث خطأ أثناء تحميل الصورة إلى Supabase",
        })
      }
    }
  }

  const resizeAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const MAX_WIDTH = 1920
          const MAX_HEIGHT = 1080
          let width = img.width
          let height = img.height

          // حساب الأبعاد الجديدة مع الحفاظ على النسبة
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width)
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height)
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)

          // ضغط الصورة بجودة 85%
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85)
          resolve(compressedDataUrl)
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHeroImageFile(file)
      try {
        const compressedDataUrl = await resizeAndCompressImage(file)
        setHeroImageData(compressedDataUrl)
        toast({
          title: "تم تحميل الصورة",
          description: "يمكنك الآن حفظ الصورة الجديدة",
        })
      } catch (error) {
        console.error("Error processing image:", error)
        toast({
          title: "خطأ",
          description: "فشل في معالجة الصورة",
          variant: "destructive",
        })
      }
    }
  }

  const handleNavigateToAdmin = (path: string) => {
    router.push(path)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">جاري التحقق من الصلاحيات...</p>
            </div>
          </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto">
            <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">صلاحية مطلوبة</h1>
            <p className="text-gray-600">لا تمتلك الصلاحية لإدارة الصفحات. يرجى تسجيل الدخول بحساب مسؤول.</p>
            </div>
          <div className="space-y-3">
            <Link href="/admin/login">
              <Button className="w-full">الانتقال إلى صفحة تسجيل الدخول</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
              العودة إلى الموقع الرئيسي
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex-shrink-0">
              <img src="/logo-horizontal.png" alt="حزب نماء" className="h-12 w-auto drop-shadow-lg" />
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <Link href="/" scroll={true}>
                <Button variant="ghost" size="sm">
                  الرئيسية
                </Button>
              </Link>
              <Link href="/vision" scroll={true}>
                <Button variant="ghost" size="sm">
                  رؤية الحزب
                </Button>
              </Link>
              <Link href="/leadership" scroll={true}>
                <Button variant="ghost" size="sm">
                  القيادات التنفيذية
                </Button>
              </Link>
              <Link href="/local-development" scroll={true}>
                <Button variant="ghost" size="sm">
                  البرنامج الاقتصادي
                </Button>
              </Link>
              <Link href="/news" scroll={true}>
                <Button variant="ghost" size="sm">
                  أخبار الحزب
                </Button>
              </Link>
              <Link href="/statements" scroll={true}>
                <Button variant="ghost" size="sm">
                  البيانات الصادرة
                </Button>
              </Link>
              <Link href="/activities" scroll={true}>
                <Button variant="ghost" size="sm">
                  النشاطات
                </Button>
              </Link>
              <Link href="/branches" scroll={true}>
                <Button variant="ghost" size="sm">
                  فروع الحزب
                </Button>
              </Link>
              <Link href="/join" scroll={true}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  طلب الانتساب
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
                </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="h-20" />

      <main className="container mx-auto px-4 py-12">
        {!selectedPage ? (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">اختر صفحة للتعديل</h1>
              <Link href="/admin">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowRight size={18} />
                  العودة إلى لوحة التحكم
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {pageContents.map((page) => (
                <Card
                  key={page.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelectPage(page)}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{page.title}</h3>
                  <p className="text-gray-600 mb-3">
                    {page.id === "leadership" && page.leaders
                      ? `${page.leaders?.length || 0} قيادي`
                      : `${page.sections?.length || 0} قسم`}
                  </p>
                  <div className="text-sm text-gray-500">
                    آخر تعديل:{" "}
                    {page.lastModified
                      ? new Date(page.lastModified).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "غير متوفر"}
                  </div>
                  {page.id === "home" && (
                    <div className="mt-3 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full inline-block">
                      الصفحة الرئيسية
                    </div>
                  )}
                </Card>
              ))}

            </div>
          </>
        ) : editingSection ? (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">تعديل القسم</h2>
              <Button variant="ghost" onClick={handleCancel} size="sm">
                <X size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">عنوان القسم</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">المحتوى</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-64"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">صورة (اختياري)</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {formData.image && (
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSave} className="flex-1 gap-2">
                  <Save size={16} />
                  حفظ التعديلات
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        ) : editingLeader ? (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">تعديل القيادي</h2>
              <Button variant="ghost" onClick={handleCancelLeader} size="sm">
                <X size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</Label>
                <Input
                  type="text"
                  value={leaderFormData.name}
                  onChange={(e) => setLeaderFormData({ ...leaderFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">المنصب</Label>
                <Input
                  type="text"
                  value={leaderFormData.position}
                  onChange={(e) => setLeaderFormData({ ...leaderFormData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">السيرة الذاتية</Label>
                <Textarea
                  value={leaderFormData.bio}
                  onChange={(e) => setLeaderFormData({ ...leaderFormData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-64"
                />
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  id="isMain"
                  checked={leaderFormData.isMain}
                  onChange={(e) => setLeaderFormData({ ...leaderFormData, isMain: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isMain" className="text-sm font-medium text-gray-700">
                  قيادة عليا (الأمين العام أو نوابه)
                </Label>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة شخصية (بحجم صورة جواز السفر)
                </Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLeaderImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {leaderFormData.image && (
                    <div className="relative w-40 h-48 border rounded-lg overflow-hidden mx-auto">
                      <img
                        src={getLeaderImagePreview(leaderFormData.image) || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={leaderFormData.email}
                  onChange={(e) => setLeaderFormData({ ...leaderFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</Label>
                <Input
                  type="tel"
                  value={leaderFormData.phone}
                  onChange={(e) => setLeaderFormData({ ...leaderFormData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => handleSaveLeader()} className="flex-1 gap-2">
                  <Save size={16} />
                  حفظ التعديلات
                </Button>
                <Button variant="outline" onClick={handleCancelLeader} className="flex-1 bg-transparent">
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
              <h1 className="text-4xl font-bold">{getPageDisplayName(selectedPage)}</h1>
              <div className="flex flex-wrap items-center gap-3 justify-end">
                {viewMode === "sections" && selectedPage.id !== "leadership" && selectedPage.id !== "home" && selectedPage.id !== "vision" && selectedPage.id !== "localDevelopment" && selectedPage.id !== "branches" && (
                  <Button onClick={openAddSectionForm} size="sm" className="gap-2">
                    <Plus size={16} />
                    إضافة قسم جديد
                  </Button>
                )}
                {selectedPage.id === "leadership" && viewMode === "leaders" && (
                  <Button onClick={openAddLeaderForm} size="sm" className="gap-2">
                    <Plus size={16} />
                    إضافة قيادي جديد
                  </Button>
                )}
                <Button onClick={handleBack} variant="outline" size="sm" className="gap-2 bg-transparent">
                  <ArrowRight size={16} />
                  العودة إلى إدارة المحتوى
                </Button>
                <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2 bg-transparent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                  تحديث
                </Button>
              </div>
            </div>

            {selectedPage.id === "vision" && (
              <Card className="p-6 mb-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">محتوى رؤية الحزب</h2>
                  <p className="text-sm text-muted-foreground">
                    يمكنك من هنا تعديل النصوص الأساسية (الرؤية، الرسالة، الأهداف، المبادئ) الظاهرة على صفحة رؤية الحزب. ضع
                    كل بند في سطر منفصل عند إدخال القوائم.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3 rounded-2xl border bg-white/80 p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">عنوان الغلاف</h3>
              <p className="text-sm text-muted-foreground">العبارة الرئيسية فوق صورة الخلفية.</p>
            </div>
            <Input
              value={visionContentForm.heroTitle}
              onChange={(e) => handleVisionFieldChange("heroTitle", e.target.value)}
            />
            <div className="space-y-2">
              <Label>النص الفرعي للغلاف</Label>
              <Input
                value={visionContentForm.heroSubtitle}
                onChange={(e) => handleVisionFieldChange("heroSubtitle", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border bg-white/80 p-4 shadow-sm">
            <div>
              <h3 className="text-lg font-semibold">قسم المقدمة</h3>
              <p className="text-sm text-muted-foreground">يظهر مباشرة أسفل صورة الغلاف.</p>
            </div>
            <div className="space-y-2">
              <Label>عنوان المقدمة</Label>
              <Input
                value={visionContentForm.introTitle}
                onChange={(e) => handleVisionFieldChange("introTitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>نص المقدمة</Label>
              <Textarea
                value={visionContentForm.introDescription}
                onChange={(e) => handleVisionFieldChange("introDescription", e.target.value)}
                className="min-h-[140px]"
              />
            </div>
          </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3 rounded-2xl border bg-white/80 p-4 shadow-sm">
                    <div>
                      <h3 className="text-lg font-semibold">الرؤية</h3>
                      <p className="text-sm text-muted-foreground">النص الذي يظهر تحت عنوان "الرؤية".</p>
                    </div>
                    <Textarea
                      value={visionContentForm.visionText}
                      onChange={(e) => handleVisionFieldChange("visionText", e.target.value)}
                      className="min-h-[160px]"
                    />
                  </div>

                  <div className="space-y-3 rounded-2xl border bg-white/80 p-4 shadow-sm">
                    <div>
                      <h3 className="text-lg font-semibold">الرسالة</h3>
                      <p className="text-sm text-muted-foreground">النص الذي يظهر تحت عنوان "الرسالة".</p>
                    </div>
                    <Textarea
                      value={visionContentForm.missionText}
                      onChange={(e) => handleVisionFieldChange("missionText", e.target.value)}
                      className="min-h-[160px]"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3 rounded-2xl border bg-white/80 p-4 shadow-sm">
                    <div>
                      <h3 className="text-lg font-semibold">أهداف الحزب</h3>
                      <p className="text-sm text-muted-foreground">بطاقة الأهداف والقائمة المرقمة.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>عنوان البطاقة</Label>
                      <Input
                        value={visionContentForm.goalsTitle}
                        onChange={(e) => handleVisionFieldChange("goalsTitle", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>قائمة الأهداف (سطر لكل هدف)</Label>
                      <Textarea
                        value={visionContentForm.goalsList}
                        onChange={(e) => handleVisionFieldChange("goalsList", e.target.value)}
                        className="min-h-[220px]"
                        placeholder="مثال:\n1. هدف أول\n2. هدف ثانٍ"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border bg-white/80 p-4 shadow-sm">
                    <div>
                      <h3 className="text-lg font-semibold">مبادئ الحزب</h3>
                      <p className="text-sm text-muted-foreground">يشمل العنوان والنص التعريفي وقائمة المبادئ.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>عنوان البطاقة</Label>
                      <Input
                        value={visionContentForm.principlesCardTitle}
                        onChange={(e) => handleVisionFieldChange("principlesCardTitle", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>عنوان الفقرة</Label>
                      <Input
                        value={visionContentForm.principlesIntroTitle}
                        onChange={(e) => handleVisionFieldChange("principlesIntroTitle", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>النص التعريفي</Label>
                      <Textarea
                        value={visionContentForm.principlesIntroDescription}
                        onChange={(e) => handleVisionFieldChange("principlesIntroDescription", e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>قائمة المبادئ (سطر لكل مبدأ)</Label>
                      <Textarea
                        value={visionContentForm.principlesList}
                        onChange={(e) => handleVisionFieldChange("principlesList", e.target.value)}
                        className="min-h-[180px]"
                        placeholder="مثال:\n1. مبدأ أول\n2. مبدأ ثانٍ"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveVisionContent} disabled={savingVisionContent} className="gap-2">
                    <Save size={16} />
                    {savingVisionContent ? "جاري الحفظ..." : "حفظ محتوى رؤية الحزب"}
              </Button>
            </div>
              </Card>
            )}

            {showAddSection && (
              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">إضافة قسم جديد</h2>
                  <Button variant="ghost" onClick={() => setShowAddSection(false)} size="sm">
                    <X size={20} />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">عنوان القسم</Label>
                    <Input
                      type="text"
                      value={newSectionData.title}
                      onChange={(e) => setNewSectionData({ ...newSectionData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">المحتوى</Label>
                    <Textarea
                      value={newSectionData.content}
                      onChange={(e) => setNewSectionData({ ...newSectionData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-64"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">صورة (اختياري)</Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setSectionImageFile(file)
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      {sectionImageFile && (
                        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(sectionImageFile) || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleAddSection} className="flex-1 gap-2">
                      <Save size={16} />
                      حفظ القسم
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddSection(false)}
                      className="flex-1 bg-transparent"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {showAddLeader && (
              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">إضافة قيادي جديد</h2>
                  <Button variant="ghost" onClick={() => setShowAddLeader(false)} size="sm">
                    <X size={20} />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</Label>
                    <Input
                      type="text"
                      value={newLeaderData.name}
                      onChange={(e) => setNewLeaderData({ ...newLeaderData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">المنصب</Label>
                    <Input
                      type="text"
                      value={newLeaderData.position}
                      onChange={(e) => setNewLeaderData({ ...newLeaderData, position: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">السيرة الذاتية</Label>
                    <Textarea
                      value={newLeaderData.bio}
                      onChange={(e) => setNewLeaderData({ ...newLeaderData, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-64"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="checkbox"
                      id="isMainLeader"
                      checked={newLeaderData.isMain}
                      onChange={(e) => setNewLeaderData({ ...newLeaderData, isMain: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isMainLeader" className="text-sm font-medium text-gray-700">
                      قيادة عليا (الأمين العام أو نوابه)
                    </Label>
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      صورة شخصية (بحجم صورة جواز السفر)
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleNewLeaderImageUpload}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      {newLeaderData.image && (
                        <div className="relative w-40 h-48 border rounded-lg overflow-hidden mx-auto">
                          <img
                            src={newLeaderData.image || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={newLeaderData.email}
                      onChange={(e) => setNewLeaderData({ ...newLeaderData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</Label>
                    <Input
                      type="tel"
                      value={newLeaderData.phone}
                      onChange={(e) => setNewLeaderData({ ...newLeaderData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleAddLeader} className="flex-1 gap-2">
                      <Save size={16} />
                      حفظ القيادي
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddLeader(false)} className="flex-1 bg-transparent">
                      إلغاء
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {selectedPage.id === "localDevelopment" && (
              <>
                <Card className="p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">صورة الخلفية العلوية</h2>
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        تغيير صورة الخلفية (الموصى به: 1920×1080 بكسل)
                      </Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    {heroImageData && (
                      <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                        <img
                          src={heroImageData || "/placeholder.svg"}
                          alt="صورة الخلفية"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {heroImageData && (
                      <Button onClick={handleSaveHeroImage} className="gap-2" disabled={isSaving}>
                        {isSaving ? "جاري الحفظ..." : "حفظ صورة الخلفية"}
                      </Button>
                    )}
                  </div>
                </Card>

                {!showEconomicProgramForm ? (
                  <div className="mb-6">
                    <Button onClick={() => setShowEconomicProgramForm(true)} className="gap-2">
                      <Plus size={16} />
                      إضافة عنصر للبرنامج الاقتصادي
                    </Button>
                  </div>
                ) : (
                  <Card className="p-6 mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">إضافة عنصر للبرنامج الاقتصادي</h2>
                        <p className="text-sm text-muted-foreground">
                          اختر إن كان العنصر محوراً رئيسياً أو هدفاً داعماً. يتم عرض المحاور في القسم العلوي والأهداف في القسم
                          السفلي تلقائياً وفقاً للنوع والترتيب الذي تحدده.
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => setShowEconomicProgramForm(false)} size="sm">
                        <X size={20} />
                      </Button>
                    </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>نوع العنصر</Label>
                    <select
                      value={economicProgramForm.type}
                      onChange={(e) =>
                        setEconomicProgramForm((prev) => ({ ...prev, type: e.target.value as "pillar" | "goal" }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary bg-white"
                    >
                      <option value="pillar">محور رئيسي</option>
                      <option value="goal">هدف داعم</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>عنوان المحور / الهدف</Label>
                    <Input
                      value={economicProgramForm.title}
                      onChange={(e) => setEconomicProgramForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="مثال: تمكين الاقتصاد المحلي"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ترتيب العرض</Label>
                    <Input
                      type="number"
                      min={1}
                      value={economicProgramForm.order}
                      onChange={(e) => setEconomicProgramForm((prev) => ({ ...prev, order: e.target.value }))}
                      placeholder="مثال: 1"
                    />
                    <p className="text-xs text-muted-foreground">
                      اترك الحقل فارغاً لإضافة العنصر في نهاية القائمة تلقائياً.
                    </p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>صورة مرافقة (اختياري)</Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (!file) return
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            const dataUrl = reader.result as string
                            setEconomicProgramForm((prev) => ({ ...prev, image: dataUrl }))
                          }
                          reader.readAsDataURL(file)
                        }}
                      />
                      {economicProgramForm.image && (
                        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                          <img
                            src={economicProgramForm.image || "/placeholder.svg"}
                            alt="صورة البرنامج الاقتصادي"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>الوصف التفصيلي</Label>
                  <Textarea
                    value={economicProgramForm.content}
                    onChange={(e) => setEconomicProgramForm((prev) => ({ ...prev, content: e.target.value }))}
                    className="min-h-[160px]"
                    placeholder="اشرح تفاصيل المحور أو الهدف الاقتصادي..."
                  />
                </div>
                    <div className="flex justify-end gap-2">
                      <Button onClick={handleAddEconomicProgram} disabled={programSaving} className="gap-2">
                        <Save size={16} />
                        {programSaving ? "جاري الإضافة..." : "إضافة البرنامج"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowEconomicProgramForm(false)
                          setEconomicProgramForm({
                            title: "",
                            content: "",
                            order: "",
                            image: "",
                            type: "pillar",
                          })
                        }} 
                        className="bg-transparent"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}

            {selectedPage.id === "branches" && (
              <>
                <Card className="p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">صورة الخلفية العلوية</h2>
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">
                        تغيير صورة الخلفية (الموصى به: 1920×1080 بكسل)
                      </Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    {heroImageData && (
                      <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                        <img
                          src={heroImageData || "/placeholder.svg"}
                          alt="صورة الخلفية"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {heroImageData && (
                      <Button onClick={handleSaveHeroImage} className="gap-2" disabled={isSaving}>
                        {isSaving ? "جاري الحفظ..." : "حفظ صورة الخلفية"}
                      </Button>
                    )}
                  </div>
                </Card>

                {!showBranchForm ? (
                  <div className="mb-6">
                    <Button onClick={() => setShowBranchForm(true)} className="gap-2">
                      <Plus size={16} />
                      إضافة فرع جديد
                    </Button>
                  </div>
                ) : (
                  <Card className="p-6 mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">إضافة فرع جديد</h2>
                        <p className="text-sm text-muted-foreground">
                          أدخل بيانات الفرع وسيتم عرضه فوراً ضمن صفحة فروع الحزب. يمكنك تضمين العنوان، رقم الهاتف، والإحداثيات إن وجدت.
                        </p>
                      </div>
                      <Button variant="ghost" onClick={() => setShowBranchForm(false)} size="sm">
                        <X size={20} />
                      </Button>
                    </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>اسم الفرع</Label>
                    <Input
                      value={branchForm.title}
                      onChange={(e) => setBranchForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="مثال: فرع العاصمة"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input
                      value={branchForm.phone}
                      onChange={(e) => setBranchForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="0770000000"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>العنوان الكامل</Label>
                    <Textarea
                      value={branchForm.address}
                      onChange={(e) => setBranchForm((prev) => ({ ...prev, address: e.target.value }))}
                      className="min-h-[120px]"
                      placeholder="المدينة / الحي / تفاصيل إضافية..."
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>الإحداثيات أو أي ملاحظة إضافية (اختياري)</Label>
                    <Input
                      value={branchForm.coordinates}
                      onChange={(e) => setBranchForm((prev) => ({ ...prev, coordinates: e.target.value }))}
                      placeholder="مثال: 31.9566° N, 35.9457° E"
                    />
                  </div>
                </div>
                    <div className="flex justify-end gap-2">
                      <Button onClick={handleAddBranch} disabled={branchSaving} className="gap-2">
                        <Save size={16} />
                        {branchSaving ? "جاري الإضافة..." : "حفظ الفرع"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowBranchForm(false)
                          setBranchForm({
                            title: "",
                            address: "",
                            phone: "",
                            coordinates: "",
                          })
                        }} 
                        className="bg-transparent"
                      >
                        إلغاء
                      </Button>
                    </div>
                  </Card>
                )}
              </>
            )}

            {selectedPage.id !== "localDevelopment" && selectedPage.id !== "branches" && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">صورة الخلفية العلوية</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      تغيير صورة الخلفية (الموصى به: 1920×1080 بكسل)
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  {heroImageData && (
                    <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                      <img
                        src={heroImageData || "/placeholder.svg"}
                        alt="صورة الخلفية"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {heroImageData && (
                    <Button onClick={handleSaveHeroImage} className="gap-2" disabled={isSaving}>
                      {isSaving ? "جاري الحفظ..." : "حفظ صورة الخلفية"}
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {viewMode === "leaders" && selectedPage.id === "leadership" && selectedPage.leaders ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">إدارة القيادات التنفيذية</h2>
                {selectedPage.leaders.map((leader) => (
                  <Card key={leader.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {leader.image ? (
                          <div className="relative w-24 h-32 rounded overflow-hidden border-2 border-primary/20">
                            <img
                              src={getLeaderImagePreview(leader.image) || "/placeholder.svg"}
                              alt={leader.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-32 rounded bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                            <Home size={40} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                          <p className="text-primary font-semibold mb-2">{leader.position}</p>
                          {leader.isMain && (
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                              قيادة عليا
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mr-4">
                        <Button size="sm" variant="outline" onClick={() => handleEditLeader(leader)} className="gap-2">
                          <Pencil size={16} />
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteLeader(leader)}
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPage.sections && selectedPage.sections.length > 0 ? (
                  (() => {
                    // For home page, sort so "النص الرئيسي" appears before "عن حزب نماء"
                    const sectionsToDisplay = selectedPage.id === "home"
                      ? [...selectedPage.sections].sort((a, b) => {
                          if (a.title === "النص الرئيسي") return -1
                          if (b.title === "النص الرئيسي") return 1
                          if (a.title === "عن حزب نماء") return 1
                          if (b.title === "عن حزب نماء") return -1
                          return 0
                        })
                      : selectedPage.sections
                    
                    return sectionsToDisplay.map((section) => (
                    <Card key={section.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                          <p className="text-gray-600 mb-3 whitespace-pre-wrap">{section.content}</p>
                          {section.image && (
                            <div className="mt-3">
                              <Home size={16} className="inline mr-2" />
                              <span className="text-sm text-gray-500">يحتوي على صورة</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mr-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSection(section)}
                            className="gap-2"
                          >
                            <Pencil size={16} />
                            تعديل
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSection(section)}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                  })()
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    لا توجد أقسام بعد. اضغط على "إضافة قسم جديد" لبدء الإضافة.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
      <ConfirmDialog
        open={Boolean(deleteContext)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteContext(null)
          }
        }}
        title={
          deleteContext?.type === "leader"
            ? "تأكيد حذف القيادي"
            : deleteContext?.type === "section"
              ? "تأكيد حذف القسم"
              : "تأكيد الحذف"
        }
        description={
          deleteContext
            ? `سيتم حذف "${deleteContext.title}" نهائياً من ${deleteContext.type === "leader" ? "قائمة القيادة" : "محتوى الصفحة"}.`
            : ""
        }
        confirmLabel="حذف نهائي"
        cancelLabel="تراجع"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
