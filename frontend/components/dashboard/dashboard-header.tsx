"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AccountDisplay } from "@/components/wallet/account-display"

export function DashboardHeader() {
  return (
    <header className="border-b border-border glass sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        <SidebarTrigger />
        <div className="flex items-center gap-4">
          <AccountDisplay />
        </div>
      </div>
    </header>
  )
}
