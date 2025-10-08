"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Zap, Save } from "lucide-react"

export default function AutomationPage() {
  const automations = [
    {
      title: "Auto-Backup",
      description: "Automatically backup your vault weekly to ensure data redundancy",
      enabled: true,
    },
    {
      title: "Auto-Notify",
      description: "Send notifications when files are accessed or shared",
      enabled: true,
    },
    {
      title: "Auto-Revoke",
      description: "Automatically revoke expired file access permissions",
      enabled: true,
    },
    {
      title: "Auto-Encrypt",
      description: "Automatically encrypt new uploads with AES-256",
      enabled: true,
    },
    {
      title: "Auto-Archive",
      description: "Archive files older than 90 days to cold storage",
      enabled: false,
    },
    {
      title: "Auto-Delete",
      description: "Delete files marked for deletion after 30 days",
      enabled: false,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Automation</h1>
          <p className="text-muted-foreground">Configure automated workflows for your vault</p>
        </div>

        {/* Automation Status */}
        <Card className="glass-strong p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold mb-1">Automation Status</h2>
              <p className="text-sm text-muted-foreground">
                {automations.filter((a) => a.enabled).length} of {automations.length} automations enabled
              </p>
            </div>
          </div>
        </Card>

        {/* Automation Settings */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-6">Automation Settings</h2>
          <div className="space-y-6">
            {automations.map((automation, index) => (
              <div key={index} className="flex items-start justify-between py-4 border-b border-border last:border-0">
                <div className="flex-1 pr-4">
                  <Label htmlFor={`automation-${index}`} className="text-base font-semibold cursor-pointer">
                    {automation.title}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{automation.description}</p>
                </div>
                <Switch id={`automation-${index}`} defaultChecked={automation.enabled} />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-6">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </Card>

        {/* Automation Benefits */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-4">Why Use Automation?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Save Time</h3>
              <p className="text-sm text-muted-foreground">
                Automate repetitive tasks and focus on what matters most to you.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Improve Security</h3>
              <p className="text-sm text-muted-foreground">
                Automatic encryption and access revocation ensure your files stay secure.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Stay Organized</h3>
              <p className="text-sm text-muted-foreground">
                Automatic archiving and deletion keep your vault clean and manageable.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Never Miss Updates</h3>
              <p className="text-sm text-muted-foreground">
                Automatic notifications keep you informed of all vault activity.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
