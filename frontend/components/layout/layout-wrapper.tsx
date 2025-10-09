"use client"

/**
 * Layout Wrapper
 * Conditionally renders Navbar and Footer for non-authenticated pages
 */

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Pages that should NOT have landing navbar/footer
  const isAuthenticatedPage = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/admin')

  // Pages that SHOULD have landing navbar/footer
  const isLandingPage = !isAuthenticatedPage

  return (
    <>
      {isLandingPage && <Navbar />}
      <main className={isLandingPage ? "min-h-screen" : ""}>
        {children}
      </main>
      {isLandingPage && <Footer />}
    </>
  )
}

