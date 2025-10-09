"use client"

/**
 * Custom Connect Wallet Button
 * Uses AppKit hooks instead of default <appkit-button />
 */

import { Button } from "@/components/ui/button"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { Wallet } from "lucide-react"

export function ConnectButton() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()

  const handleClick = () => {
    if (isConnected) {
      // Open account view when already connected
      open({ view: "Account" })
    } else {
      // Open connect view when not connected
      open({ view: "Connect" })
    }
  }

  return (
    <Button
      onClick={handleClick}
      className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnected && address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "Connect Wallet"}
    </Button>
  )
}

