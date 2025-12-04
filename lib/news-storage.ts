// Client-side storage for news articles using Supabase with backup
import { supabase } from "./supabase"

const NEWS_STORAGE_KEY = "namaa_news_articles"
const NEWS_BACKUP_KEY = "namaa_news_backup"
const NEWS_LAST_BACKUP = "namaa_news_last_backup"
const INITIAL_NEWS: NewsArticle[] = [
  {
    id: "1",
    title: "حزب نماء يعقد مؤتمراً حاشداً في عمّان",
    description: "اجتماع القيادة لمناقشة البرنامج الانتخابي الجديد",
    content:
      "عقد حزب نماء مؤتماً حاشداً في قاعة الأمل بعمّان لمناقشة البرنامج الانتخابي الجديد وأهداف الحزب للعام الجديد.",
    image: "/images/meeting.jpg",
    date: "2025-01-15",
    category: "أخبار",
    views: 234,
  },
  {
    id: "2",
    title: "برنامج تدريبي للكوادر الحزبية",
    description: "تدريب الكوادر على المهارات السياسية والتنظيمية",
    content: "أطلق حزب نماء برنامجاً تدريبياً شاملاً لتطوير مهارات كوادره في المجالات السياسية والتنظيمية والاجتماعية.",
    image: "/images/leadership.jpg",
    date: "2025-01-10",
    category: "تدريب",
    views: 156,
  },
]

export interface NewsArticle {
  id: string
  title: string
  description: string
  content: string
  image: string
  date: string
  category: string
  views: number
}

export async function getNews(): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase.from("news_articles").select("*").order("date", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching news from Supabase:", error)
      return INITIAL_NEWS
    }

    if (!data || data.length === 0) {
      console.log("[v0] No news in Supabase, returning initial news")
      return INITIAL_NEWS
    }

    return data.map((article) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.image,
      date: article.date,
      category: article.category,
      views: article.views,
    }))
  } catch (error) {
    console.error("[v0] Error in getNews:", error)
    return INITIAL_NEWS
  }
}

export async function addNews(article: Omit<NewsArticle, "id" | "views">): Promise<NewsArticle | null> {
  try {
    const { data, error } = await supabase
      .from("news_articles")
      .insert([
        {
          title: article.title,
          description: article.description,
          content: article.content,
          image: article.image,
          date: article.date,
          category: article.category,
          views: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding news to Supabase:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image,
      date: data.date,
      category: data.category,
      views: data.views,
    }
  } catch (error) {
    console.error("[v0] Error in addNews:", error)
    return null
  }
}

export async function updateNews(id: string, updates: Partial<NewsArticle>): Promise<NewsArticle | null> {
  try {
    const { data, error } = await supabase.from("news_articles").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Error updating news in Supabase:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image,
      date: data.date,
      category: data.category,
      views: data.views,
    }
  } catch (error) {
    console.error("[v0] Error in updateNews:", error)
    return null
  }
}

export async function deleteNews(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("news_articles").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting news from Supabase:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Error in deleteNews:", error)
    return false
  }
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  try {
    const { data, error } = await supabase.from("news_articles").select("*").eq("id", id).single()

    if (error) {
      console.error("[v0] Error fetching news by ID from Supabase:", error)
      return null
    }

    // Increment views
    await supabase
      .from("news_articles")
      .update({ views: data.views + 1 })
      .eq("id", id)

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image,
      date: data.date,
      category: data.category,
      views: data.views + 1,
    }
  } catch (error) {
    console.error("[v0] Error in getNewsById:", error)
    return null
  }
}

// Export and import functions remain for backup purposes
export async function exportNewsToFile(): Promise<void> {
  const news = await getNews()
  const dataStr = JSON.stringify(news, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = `namaa-news-backup-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function importNewsFromFile(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const articles = JSON.parse(e.target?.result as string)
        if (Array.isArray(articles)) {
          // Insert all articles into Supabase
          for (const article of articles) {
            await addNews(article)
          }
          resolve(true)
        } else {
          resolve(false)
        }
      } catch {
        resolve(false)
      }
    }
    reader.onerror = () => resolve(false)
    reader.readAsText(file)
  })
}
