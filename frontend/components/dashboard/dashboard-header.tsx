"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppKitAccount } from "@reown/appkit/react"

export function DashboardHeader() {
  const { address } = useAppKitAccount()

  return (
    <header className="border-b border-border glass sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        <SidebarTrigger />
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm text-muted-foreground">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
          </div>
          <appkit-button />
        </div>
      </div>
    </header>
  )
}
