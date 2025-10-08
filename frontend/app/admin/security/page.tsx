"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Shield } from "lucide-react"

export default function AdminSecurityPage() {
  const alerts = [
    {
      date: "10/08",
      user: "0x1D...F3",
      file: "doc.pdf",
      type: "Suspicious Access",
      severity: "High",
      status: "Pending",
    },
    {
      date: "10/07",
      user: "0x2E...G4",
      file: "contract.pdf",
      type: "Multiple Failed Attempts",
      severity: "High",
      status: "Resolved",
    },
    {
      date: "10/06",
      user: "0x3F...H5",
      file: "report.docx",
      type: "New IP Login",
      severity: "Medium",
      status: "Pending",
    },
    {
      date: "10/05",
      user: "0x4G...I6",
      file: "data.xlsx",
      type: "Unusual Download Pattern",
      severity: "Low",
      status: "Resolved",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Security Alerts</h1>
          <p className="text-muted-foreground">Monitor and respond to security incidents</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="glass-strong p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
                <p className="text-3xl font-bold">2</p>
              </div>
            </div>
          </Card>
          <Card className="glass-strong p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resolved Today</p>
                <p className="text-3xl font-bold">8</p>
              </div>
            </div>
          </Card>
          <Card className="glass-strong p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total This Week</p>
                <p className="text-3xl font-bold">23</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Security Alerts Table */}
        <Card className="glass-strong overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell className="font-mono text-sm">{alert.date}</TableCell>
                  <TableCell className="font-mono text-sm">{alert.user}</TableCell>
                  <TableCell>{alert.file}</TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        alert.severity === "High"
                          ? "bg-destructive/20 text-destructive"
                          : alert.severity === "Medium"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        alert.status === "Pending" ? "bg-secondary/20 text-secondary" : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {alert.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      {alert.status === "Pending" ? "Investigate" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  )
}
