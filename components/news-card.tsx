import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import type { NewsArticle } from "@/lib/types"
import { Eye } from "lucide-react"

export function NewsCard({ article }: { article: NewsArticle }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-muted">
        <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{article.category}</span>
          <span className="text-xs text-gray-500">{formatDate(article.date)}</span>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{article.description}</p>
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <Eye className="w-4 h-4" />
          <span>{article.views || 0} مشاهدة</span>
        </div>
        <Link href={`/news/${article.id}`} scroll={true} prefetch={true}>
          <Button variant="outline" className="w-full bg-transparent">
            اقرأ المزيد
          </Button>
        </Link>
      </div>
    </Card>
  )
}
