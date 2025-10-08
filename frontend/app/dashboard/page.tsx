"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Share2, Zap, Shield, Upload, Bell, Activity } from "lucide-react"
import { useAppKitAccount } from "@reown/appkit/react"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  const { isConnected } = useAppKitAccount()

  if (!isConnected) {
    redirect("/")
  }

  const stats = [
    { label: "Total Files", value: "24", icon: FileText, color: "text-secondary" },
    { label: "Shared Files", value: "8", icon: Share2, color: "text-secondary" },
    { label: "Active Automations", value: "3", icon: Zap, color: "text-secondary" },
    { label: "Security Score", value: "98%", icon: Shield, color: "text-secondary" },
  ]

  const recentActivity = [
    { action: "Uploaded", file: "contract.pdf", time: "2 hours ago" },
    { action: "Shared", file: "presentation.pptx", time: "5 hours ago" },
    { action: "Revoked access", file: "report.docx", time: "1 day ago" },
    { action: "Uploaded", file: "invoice.pdf", time: "2 days ago" },
    { action: "Shared", file: "design.fig", time: "3 days ago" },
  ]

  const notifications = [
    { type: "System", message: "New file uploaded successfully", time: "10/08 13:20", status: "seen" },
    { type: "Security", message: "Suspicious access detected", time: "10/08 14:22", status: "unseen" },
    { type: "Share", message: "Access granted to 0xA23...E9", time: "10/07 09:15", status: "seen" },
    { type: "System", message: "Storage limit at 75%", time: "10/06 16:30", status: "seen" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to your secure vault</p>
          </div>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-strong p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Storage Usage */}
        <Card className="glass-strong p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-semibold">Storage Usage</h2>
            <span className="text-sm text-muted-foreground">3.2 GB / 5 GB</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-secondary to-accent w-[64%]" />
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="glass-strong p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold">Recent Activity</h2>
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.file}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Notifications Panel */}
          <Card className="glass-strong p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold">Notifications</h2>
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {notifications.slice(0, 5).map((notification, index) => (
                <div key={index} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${notification.status === "unseen" ? "bg-secondary" : "bg-muted"}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-secondary">{notification.type}</span>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-secondary">
              View All Notifications
            </Button>
          </Card>
        </div>

        {/* AI Guardian Widget */}
        <Card className="glass-strong p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold mb-1">AI Guardian</h2>
                <p className="text-sm text-muted-foreground">Your security is being monitored</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                <p className="text-lg font-semibold text-secondary">Low</p>
              </div>
              <Button variant="outline" className="glass bg-transparent">
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
