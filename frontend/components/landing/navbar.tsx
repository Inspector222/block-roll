"use client"

import { Button } from "@/components/ui/button"
import { ConnectButton } from "@/components/wallet/connect-button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-white to-secondary rounded-lg" />
            <span className="text-xl font-serif font-semibold tracking-tight">BlockRoll</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/developers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Developers
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/features" className="block text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/developers" className="block text-sm text-muted-foreground hover:text-foreground">
              Developers
            </Link>
            <Link href="/docs" className="block text-sm text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <Link href="/faq" className="block text-sm text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
            <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <div className="pt-4">
              <ConnectButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
