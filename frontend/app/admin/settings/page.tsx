"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Save } from "lucide-react"

export default function AdminSettingsPage() {
  const adminWallets = [
    { wallet: "0x1A2...B3C", role: "Super Admin", added: "01/01/25" },
    { wallet: "0x4D5...E6F", role: "Admin", added: "15/02/25" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Admin Settings</h1>
          <p className="text-muted-foreground">Manage admin access and system configurations</p>
        </div>

        {/* Add Admin Wallet */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-6">Add Admin Wallet</h2>
          <form className="space-y-4">
            <div>
              <Label htmlFor="admin-wallet">Wallet Address</Label>
              <Input id="admin-wallet" placeholder="0x..." className="mt-2 bg-background/50 font-mono text-sm" />
            </div>
            <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </form>
        </Card>

        {/* Admin Wallets List */}
        <Card className="glass-strong overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-serif text-2xl font-semibold">Admin Wallets</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Wallet Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminWallets.map((admin, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell className="font-mono text-sm">{admin.wallet}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-medium">
                      {admin.role}
                    </span>
                  </TableCell>
                  <TableCell>{admin.added}</TableCell>
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

        {/* System Notifications */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-6">System Notification Rules</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">New User Registration</p>
                <p className="text-sm text-muted-foreground">Notify admins when new users join</p>
              </div>
              <Button variant="outline" size="sm" className="glass bg-transparent">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">Security Alerts</p>
                <p className="text-sm text-muted-foreground">Immediate notification for high-severity alerts</p>
              </div>
              <Button variant="outline" size="sm" className="glass bg-transparent">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Storage Threshold</p>
                <p className="text-sm text-muted-foreground">Alert when platform storage exceeds 80%</p>
              </div>
              <Button variant="outline" size="sm" className="glass bg-transparent">
                Enabled
              </Button>
            </div>
          </div>
          <div className="flex justify-end pt-6">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
