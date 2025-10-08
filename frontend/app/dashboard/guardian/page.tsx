"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, AlertTriangle, CheckCircle, Lock, Download } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function AIGuardianPage() {
  const incidents = [
    {
      date: "08/10",
      file: "nda.pdf",
      incident: "Access from new IP address",
      severity: "Medium",
      status: "Pending",
    },
    {
      date: "07/10",
      file: "photo.zip",
      incident: "Suspicious device detected",
      severity: "High",
      status: "Resolved",
    },
    {
      date: "06/10",
      file: "contract.pdf",
      incident: "Multiple failed access attempts",
      severity: "High",
      status: "Resolved",
    },
    {
      date: "05/10",
      file: "report.docx",
      incident: "Unusual download pattern",
      severity: "Low",
      status: "Resolved",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">AI Guardian</h1>
          <p className="text-muted-foreground">Intelligent security monitoring for your vault</p>
        </div>

        {/* Security Score */}
        <Card className="glass-strong p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-background flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-secondary">98</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-2">Security Status: Excellent</h2>
                <p className="text-muted-foreground">
                  Your vault is well protected. AI Guardian is actively monitoring for threats.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Encryption Strength</span>
                  <span className="font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Access Control</span>
                  <span className="font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Activity Monitoring</span>
                  <span className="font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Indicator */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="glass-strong p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Risk Level</p>
                <p className="text-2xl font-bold text-secondary">Low</p>
              </div>
            </div>
          </Card>
          <Card className="glass-strong p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Incidents</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </Card>
          <Card className="glass-strong p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Threats Blocked</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="glass bg-transparent">
              <Lock className="mr-2 h-4 w-4" />
              Lock Vault
            </Button>
            <Button variant="outline" className="glass bg-transparent text-destructive hover:text-destructive">
              Revoke All Access
            </Button>
            <Button variant="outline" className="glass bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Generate Security Report
            </Button>
          </div>
        </Card>

        {/* Security Incidents */}
        <Card className="glass-strong overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-serif text-2xl font-semibold">Security Incidents</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell className="font-mono text-sm">{incident.date}</TableCell>
                  <TableCell>{incident.file}</TableCell>
                  <TableCell>{incident.incident}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        incident.severity === "High"
                          ? "bg-destructive/20 text-destructive"
                          : incident.severity === "Medium"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {incident.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        incident.status === "Pending" ? "bg-secondary/20 text-secondary" : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {incident.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8">
                      {incident.status === "Pending" ? "Investigate" : "View Details"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* AI Guardian Features */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-4">AI Guardian Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Anomaly Detection</h3>
              <p className="text-sm text-muted-foreground">
                Machine learning algorithms detect unusual access patterns and suspicious behavior in real-time.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Real-time Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Instant notifications for security events via dashboard, email, and WhatsApp.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Risk Scoring</h3>
              <p className="text-sm text-muted-foreground">
                Continuous assessment of your vault's security posture with actionable recommendations.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Automated Response</h3>
              <p className="text-sm text-muted-foreground">
                Automatic threat mitigation including access revocation and vault locking when needed.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
