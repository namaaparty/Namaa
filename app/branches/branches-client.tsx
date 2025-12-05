"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MapPin, Phone, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

interface Branch {
  id: string
  title: string
  content: string
  order_number: number
}

interface BranchesClientProps {
  branches: Branch[]
  heroImage: string
}

export default function BranchesClient({ branches, heroImage }: BranchesClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="h-20" />

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <Image src={heroImage || "/placeholder.svg"} alt="فروع حزب نماء" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)' }}>فروع الحزب</h1>
            <p className="text-xl lg:text-2xl text-white/95 drop-shadow-lg">
              نحن في جميع محافظات المملكة لخدمة مواطنينا
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="relative z-10">
        {/* Section for Text Below Image */}
        <section className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/10 py-6">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">فروع حزب نماء</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                نحن في جميع محافظات المملكة لخدمة مواطنينا
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => {
                const parts = branch.content.split("|").map((p) => p.trim())
                const address = parts[0] || branch.content
                const phone =
                  parts
                    .find((p) => p.includes("هاتف"))
                    ?.replace("هاتف:", "")
                    .trim() || "0777884444"
                const coordinates = parts.find((p) => p.includes("°"))

                return (
                  <Card key={branch.id} className="h-full hover:shadow-lg transition-all border-2 hover:border-primary/50">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                          <div className="p-4 rounded-full bg-primary/10">
                            <MapPin className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        <CardTitle className="text-center text-xl">{branch.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <p className="text-sm">{address}</p>
                        </div>
                        {coordinates && <p className="text-xs text-muted-foreground mr-6">{coordinates}</p>}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <p className="text-sm">{phone}</p>
                        </div>
                      </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  )
}
