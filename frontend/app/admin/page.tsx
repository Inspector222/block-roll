"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Users, FileText, Share2, AlertTriangle, TrendingUp, Activity } from "lucide-react"

export default function AdminOverviewPage() {
  const stats = [
    { label: "Total Users", value: "1,247", icon: Users, change: "+12%", trend: "up" },
    { label: "Total Files Stored", value: "24,891", icon: FileText, change: "+8%", trend: "up" },
    { label: "Shared Accesses", value: "5,432", icon: Share2, change: "+15%", trend: "up" },
    { label: "AI Guardian Alerts", value: "23", icon: AlertTriangle, change: "-5%", trend: "down" },
  ]

  const recentActivity = [
    { time: "10/08 14:30", user: "0x1A2...B3C", action: "Uploaded file", file: "contract.pdf" },
    { time: "10/08 14:25", user: "0x4D5...E6F", action: "Shared access", file: "report.docx" },
    { time: "10/08 14:20", user: "0x7G8...H9I", action: "Created team", file: "Engineering" },
    { time: "10/08 14:15", user: "0xAB1...C2D", action: "Revoked access", file: "nda.pdf" },
    { time: "10/08 14:10", user: "0xDE3...F4G", action: "Uploaded file", file: "design.fig" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Admin Overview</h1>
          <p className="text-muted-foreground">Platform statistics and recent activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-strong p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-secondary" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-secondary" : "text-destructive"}`}
                >
                  <TrendingUp className={`w-3 h-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <Card className="glass-strong p-6">
            <h2 className="font-serif text-xl font-semibold mb-6">User Growth</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {[45, 52, 48, 65, 70, 68, 85, 92, 88, 95, 100, 98].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-secondary to-accent rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{index + 1}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Storage Usage */}
          <Card className="glass-strong p-6">
            <h2 className="font-serif text-xl font-semibold mb-6">Storage Usage</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Storage</span>
                  <span className="text-sm font-medium">2.4 TB / 5 TB</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-accent w-[48%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Active Files</span>
                  <span className="text-sm font-medium">18,234</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-accent w-[73%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Archived Files</span>
                  <span className="text-sm font-medium">6,657</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-accent w-[27%]" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="glass-strong p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-semibold">Recent Activity</h2>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-mono w-24">{activity.time}</span>
                  <span className="text-xs text-muted-foreground font-mono">{activity.user}</span>
                  <span className="text-sm">{activity.action}</span>
                  <span className="text-sm font-medium">{activity.file}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
