import { LayoutWrapper } from "@/components/layout/layout-wrapper"
import ContextProvider from '@/context'
import { Analytics } from "@vercel/analytics/next"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { headers } from "next/headers"
import type React from "react"
import { Suspense } from "react"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BlockRoll - Own. Encrypt. Share. Control.",
  description: "Non-custodial data exchange and storage platform powered by BlockDAG",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersObj = await headers()
  const cookies = headersObj.get("cookie")

  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${playfair.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ContextProvider cookies={cookies}>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ContextProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
