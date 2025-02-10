import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/custom/Sidebar"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WebScrib - Smart Content Generator",
  description: "Generate optimized content for your website using AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="w-full flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6 ">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}