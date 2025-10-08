"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Plus, Trash2, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"

export default function EmergencyAccessPage() {
  const trustedWallets = [
    {
      wallet: "0x1A2...B3C",
      access: "Full Vault",
      inactivity: "30 days",
      added: "01/10/25",
      status: "Active",
    },
    {
      wallet: "0x4D5...E6F",
      access: "Specific Files",
      inactivity: "60 days",
      added: "15/09/25",
      status: "Active",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Emergency Access Mode</h1>
          <p className="text-muted-foreground">Designate trusted wallets to access your files during inactivity</p>
        </div>

        {/* Warning Alert */}
        <Alert className="glass-strong border-destructive/50">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive">Important Security Notice</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Emergency access allows designated wallets to access your vault after a specified inactivity period. Only
            add wallets you completely trust. You can revoke access at any time.
          </AlertDescription>
        </Alert>

        {/* Emergency Access Status */}
        <Card className="glass-strong p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold mb-1">Emergency Access Status</h2>
                <p className="text-sm text-muted-foreground">
                  Currently {trustedWallets.length} trusted wallet(s) configured
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Enable Emergency Access</span>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Add Trusted Wallet */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-6">Add Trusted Wallet</h2>
          <form className="space-y-6">
            <div>
              <Label htmlFor="wallet">Trusted Wallet Address</Label>
              <Input id="wallet" placeholder="0x..." className="mt-2 bg-background/50 font-mono text-sm" />
              <p className="text-xs text-muted-foreground mt-2">
                This wallet will be able to access your files after the inactivity period
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="access-type">Access Type</Label>
                <Select defaultValue="full">
                  <SelectTrigger className="mt-2 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Vault Access</SelectItem>
                    <SelectItem value="specific">Specific Files Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inactivity">Inactivity Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="mt-2 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Trusted Wallet
            </Button>
          </form>
        </Card>

        {/* Trusted Wallets List */}
        <Card className="glass-strong overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-serif text-2xl font-semibold">Trusted Wallets</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Wallet Address</TableHead>
                <TableHead>Access Type</TableHead>
                <TableHead>Inactivity Period</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trustedWallets.map((item, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell className="font-mono text-sm">{item.wallet}</TableCell>
                  <TableCell>{item.access}</TableCell>
                  <TableCell>{item.inactivity}</TableCell>
                  <TableCell>{item.added}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-medium">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* How It Works */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-4">How Emergency Access Works</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 text-secondary font-semibold">
                1
              </div>
              <p>
                You designate trusted wallet addresses and set an inactivity period (e.g., 30 days without logging in).
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 text-secondary font-semibold">
                2
              </div>
              <p>
                If you don't access your account for the specified period, the system automatically grants access to
                your trusted wallets.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 text-secondary font-semibold">
                3
              </div>
              <p>
                Trusted wallets can then access your files based on the permissions you've set (full vault or specific
                files).
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 text-secondary font-semibold">
                4
              </div>
              <p>You can revoke emergency access at any time, and any login resets the inactivity timer.</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
