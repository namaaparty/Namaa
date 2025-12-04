import { supabase } from "./supabase"

const INITIAL_STATEMENTS: Statement[] = [
  {
    id: "1",
    title: "بيان حزب نماء حول الإصلاح الاقتصادي",
    description: "رؤية الحزب للإصلاح الاقتصادي الشامل",
    content:
      "يؤكد حزب نماء على ضرورة تبني برنامج إصلاح اقتصادي شامل يركز على تحفيز النمو وخلق فرص العمل وتحسين مستوى المعيشة للمواطنين.",
    image: "/images/public-event.jpg",
    background_image: "/images/background-public-event.jpg",
    date: "2025-01-20",
    views: 312,
  },
  {
    id: "2",
    title: "بيان حول التنمية المحلية",
    description: "برنامج التنمية المحلية الشاملة",
    content:
      "يعلن حزب نماء عن إطلاق برنامج التنمية المحلية الذي يهدف إلى تمكين المجتمعات المحلية وتعزيز التنمية المستدامة.",
    image: "/images/meeting.jpg",
    background_image: "/images/background-meeting.jpg",
    date: "2025-01-12",
    views: 245,
  },
]

export interface Statement {
  id: string
  title: string
  description: string
  content: string
  image: string
  background_image?: string
  date: string
  views: number
}

export async function getStatements(): Promise<Statement[]> {
  try {
    const { data, error } = await supabase.from("statements").select("*").order("date", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching statements from Supabase:", error)
      return INITIAL_STATEMENTS
    }

    if (!data || data.length === 0) {
      console.log("[v0] No statements in Supabase, returning initial statements")
      return INITIAL_STATEMENTS
    }

    return data.map((statement) => ({
      id: statement.id,
      title: statement.title,
      description: statement.description,
      content: statement.content,
      image: statement.image,
      background_image: statement.background_image,
      date: statement.date,
      views: statement.views,
    }))
  } catch (error) {
    console.error("[v0] Error in getStatements:", error)
    return INITIAL_STATEMENTS
  }
}

export async function addStatement(statement: Omit<Statement, "id" | "views">): Promise<Statement | null> {
  try {
    const { data, error } = await supabase
      .from("statements")
      .insert([
        {
          title: statement.title,
          description: statement.description,
          content: statement.content,
          image: statement.image,
          background_image: statement.background_image,
          date: statement.date,
          views: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding statement to Supabase:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image,
      background_image: data.background_image,
      date: data.date,
      views: data.views,
    }
  } catch (error) {
    console.error("[v0] Error in addStatement:", error)
    return null
  }
}

export async function updateStatement(id: string, updates: Partial<Statement>): Promise<Statement | null> {
  try {
    const { data, error } = await supabase
      .from("statements")
      .update({
        title: updates.title,
        description: updates.description,
        content: updates.content,
        image: updates.image,
        background_image: updates.background_image,
        date: updates.date,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating statement in Supabase:", error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image,
      background_image: data.background_image,
      date: data.date,
      views: data.views,
    }
  } catch (error) {
    console.error("[v0] Error in updateStatement:", error)
    return null
  }
}

export async function deleteStatement(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("statements").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting statement from Supabase:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Error in deleteStatement:", error)
    return false
  }
}

export async function getStatementById(id: string): Promise<Statement | null> {
  try {
    const { data, error } = await supabase.from("statements").select("*").eq("id", id).single()

    if (error) {
      console.error("[v0] Error fetching statement by ID from Supabase:", error)
      return null
    }

    // Increment views
    await supabase
      .from("statements")
      .update({ views: data.views + 1 })
      .eq("id", id)

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image,
      background_image: data.background_image,
      date: data.date,
      views: data.views + 1,
    }
  } catch (error) {
    console.error("[v0] Error in getStatementById:", error)
    return null
  }
}

// Export and import functions for backup
export async function exportStatementsToFile(): Promise<void> {
  const statements = await getStatements()
  const dataStr = JSON.stringify(statements, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement("a")
  link.href = url
  link.download = `namaa-statements-backup-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function importStatementsFromFile(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const statements = JSON.parse(e.target?.result as string)
        if (Array.isArray(statements)) {
          for (const statement of statements) {
            await addStatement(statement)
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
