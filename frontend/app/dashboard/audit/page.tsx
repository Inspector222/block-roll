"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, FileText } from "lucide-react"

export default function AuditLogsPage() {
  const auditLogs = [
    {
      timestamp: "10/08 14:03",
      action: "Upload",
      file: "nda.pdf",
      wallet: "0x9F...E4",
      status: "Success",
    },
    {
      timestamp: "10/08 15:12",
      action: "Revoke",
      file: "report.pdf",
      wallet: "0x1D...C3",
      status: "Success",
    },
    {
      timestamp: "10/07 09:45",
      action: "Share",
      file: "contract.pdf",
      wallet: "0x2E...B2",
      status: "Success",
    },
    {
      timestamp: "10/07 11:20",
      action: "Download",
      file: "invoice.pdf",
      wallet: "0x3F...A1",
      status: "Success",
    },
    {
      timestamp: "10/06 16:30",
      action: "Upload",
      file: "presentation.pptx",
      wallet: "0x4G...D0",
      status: "Success",
    },
    {
      timestamp: "10/06 18:15",
      action: "Delete",
      file: "old-data.xlsx",
      wallet: "0x5H...C9",
      status: "Success",
    },
    {
      timestamp: "10/05 10:22",
      action: "Share",
      file: "design.fig",
      wallet: "0x6I...B8",
      status: "Failed",
    },
    {
      timestamp: "10/05 14:40",
      action: "Access",
      file: "report.pdf",
      wallet: "0x7J...A7",
      status: "Success",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Audit Logs</h1>
            <p className="text-muted-foreground">Complete history of all account activities</p>
          </div>
          <Button variant="outline" className="glass bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="glass-strong p-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search logs..." className="pl-10 bg-background/50" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
                <SelectItem value="share">Share</SelectItem>
                <SelectItem value="revoke">Revoke</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="bg-background/50" />
          </div>
        </Card>

        {/* Audit Logs Table */}
        <Card className="glass-strong overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-medium">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      {log.file}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.wallet}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        log.status === "Success"
                          ? "bg-secondary/20 text-secondary"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {log.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  )
}
