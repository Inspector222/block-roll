import Link from "next/link"
import { Github, Twitter, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-white to-secondary rounded-lg" />
            <span className="font-serif font-semibold">BlockRoll</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="https://discord.com" className="text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">© BlockRoll 2025. All rights reserved.</div>
      </div>
    </footer>
  )
}
