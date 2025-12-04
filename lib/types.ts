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

export interface NewsCategory {
  id: string
  name: string
  label: string
}
