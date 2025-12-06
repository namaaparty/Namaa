import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { Cairo, Tajawal } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

// Initialize fonts
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
})

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
})

export const metadata: Metadata = {
  title: "حزب نماء - حزب سياسي وطني أردني",
  description: "حزب سياسي وطني أردني ذو رؤية اقتصادية عميقة",
  generator: 'v0.app',
  icons: {
    icon: '/favicon.jpg',
    apple: '/logo-namaa.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
