"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  return (
    <header className="border-b border-border glass sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        <SidebarTrigger />
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="glass bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </header>
  )
}
