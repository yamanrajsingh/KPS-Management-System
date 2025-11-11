import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Copyright from "@/components/copyright"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "School Admin Dashboard",
  description: "Comprehensive school management system for administrators",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${_geist.className} ${_geistMono.className}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <Copyright />

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  )
}
