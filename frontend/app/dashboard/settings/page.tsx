"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="glass-strong">
            <TabsTrigger value="wallet">Wallet & Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet">
            <Card className="glass-strong p-6">
              <h2 className="font-serif text-2xl font-semibold mb-6">Wallet & Security</h2>
              <div className="space-y-6">
                <div>
                  <Label>Connected Wallet</Label>
                  <div className="flex gap-2 mt-2">
                    <Input value="0x1234...5678" readOnly className="bg-background/50 font-mono text-sm" />
                    <Button variant="outline" className="glass bg-transparent">
                      Disconnect
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="guardian-wallet">Guardian Wallet (Recovery)</Label>
                  <Input id="guardian-wallet" placeholder="0x..." className="mt-2 bg-background/50 font-mono text-sm" />
                  <p className="text-xs text-muted-foreground mt-2">
                    This wallet can help recover your account if needed
                  </p>
                </div>
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="glass-strong p-6">
              <h2 className="font-serif text-2xl font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <Label htmlFor="browser-notif">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                  </div>
                  <Switch id="browser-notif" defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch id="email-notif" />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <Label htmlFor="whatsapp-notif">WhatsApp Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp</p>
                  </div>
                  <Switch id="whatsapp-notif" />
                </div>
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="glass-strong p-6">
              <h2 className="font-serif text-2xl font-semibold mb-6">Preferences</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="encryption">Default Encryption Type</Label>
                  <Select defaultValue="aes256">
                    <SelectTrigger className="mt-2 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes256">AES-256</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                  </div>
                  <Switch id="dark-mode" defaultChecked />
                </div>
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
