"use client"

/**
 * Account Display Component
 * Shows connected wallet info in dashboard header
 */

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react"
import { ChevronDown, LogOut, Wallet } from "lucide-react"

export function AccountDisplay() {
  const { open } = useAppKit()
  const { address, isConnected, status } = useAppKitAccount()
  const { disconnect } = useDisconnect()

  if (!isConnected || !address) {
    return (
      <Button
        variant="outline"
        onClick={() => open({ view: "Connect" })}
        className="glass bg-transparent"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  const handleViewAccount = () => {
    open({ view: "Account" })
  }

  const handleDisconnect = async () => {
    await disconnect()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="glass bg-transparent">
          <Wallet className="mr-2 h-4 w-4" />
          <span className="hidden md:inline">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong border-border w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground font-mono">
              {address.slice(0, 12)}...{address.slice(-10)}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              Status: {status}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleViewAccount}>
          <Wallet className="mr-2 h-4 w-4" />
          View Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

