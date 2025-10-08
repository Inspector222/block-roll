"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, FileText, Download, Eye } from "lucide-react"

export default function ReceivedFilesPage() {
  const receivedFiles = [
    {
      file: "report.pdf",
      from: "0x7A1...B3",
      access: "View",
      received: "08/10/25",
      size: "3.2MB",
    },
    {
      file: "invoice.pdf",
      from: "0x8B2...C4",
      access: "Download",
      received: "07/10/25",
      size: "1.5MB",
    },
    {
      file: "design.fig",
      from: "0x9C3...D5",
      access: "View",
      received: "06/10/25",
      size: "12.8MB",
    },
    {
      file: "data.xlsx",
      from: "0xAD4...E6",
      access: "Edit",
      received: "05/10/25",
      size: "2.1MB",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Received Files</h1>
          <p className="text-muted-foreground">Files shared with you by others</p>
        </div>

        {/* Search */}
        <Card className="glass-strong p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search received files..." className="pl-10 bg-background/50" />
          </div>
        </Card>

        {/* Received Files Table */}
        <Card className="glass-strong overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>File</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receivedFiles.map((item, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary" />
                      {item.file}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.from}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-medium">
                      {item.access}
                    </span>
                  </TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.received}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
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
