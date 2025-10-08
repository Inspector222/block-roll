"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Share2, Search, FileText, Clock, Ban } from "lucide-react"
import { useState } from "react"

export default function SharedFilesPage() {
  const [shareOpen, setShareOpen] = useState(false)

  const sharedFiles = [
    {
      file: "doc.pdf",
      sharedWith: "0xA23...F3",
      accessLevel: "View",
      expires: "10/10/25",
      shared: "08/10/25",
    },
    {
      file: "contract.pdf",
      sharedWith: "0xB45...E2",
      accessLevel: "Edit",
      expires: "15/10/25",
      shared: "07/10/25",
    },
    {
      file: "presentation.pptx",
      sharedWith: "0xC67...D1",
      accessLevel: "View",
      expires: "None",
      shared: "06/10/25",
    },
    {
      file: "report.docx",
      sharedWith: "0xD89...C0",
      accessLevel: "View",
      expires: "12/10/25",
      shared: "05/10/25",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Shared Files</h1>
            <p className="text-muted-foreground">Manage files you've shared with others</p>
          </div>
          <Dialog open={shareOpen} onOpenChange={setShareOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Share2 className="mr-2 h-4 w-4" />
                Share File
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-border">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Share File</DialogTitle>
                <DialogDescription>Grant access to your file by wallet address</DialogDescription>
              </DialogHeader>
              <form className="space-y-6 mt-4">
                <div>
                  <Label htmlFor="file-select">Select File</Label>
                  <Select>
                    <SelectTrigger className="mt-2 bg-background/50">
                      <SelectValue placeholder="Choose a file to share" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="file1">NDA.pdf</SelectItem>
                      <SelectItem value="file2">contract.pdf</SelectItem>
                      <SelectItem value="file3">presentation.pptx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input id="wallet" placeholder="0x..." className="mt-2 bg-background/50 font-mono text-sm" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="access">Access Level</Label>
                    <Select defaultValue="view">
                      <SelectTrigger className="mt-2 bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                        <SelectItem value="download">Download</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" type="date" className="mt-2 bg-background/50" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Share File
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShareOpen(false)}
                    className="glass bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="glass-strong p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search shared files..." className="pl-10 bg-background/50" />
          </div>
        </Card>

        {/* Shared Files Table */}
        <Card className="glass-strong overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>File</TableHead>
                <TableHead>Shared With</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead>Shared On</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sharedFiles.map((item, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary" />
                      {item.file}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.sharedWith}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-medium">
                      {item.accessLevel}
                    </span>
                  </TableCell>
                  <TableCell>{item.shared}</TableCell>
                  <TableCell>{item.expires}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8">
                        <Clock className="w-4 h-4 mr-1" />
                        Extend
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                        <Ban className="w-4 h-4 mr-1" />
                        Revoke
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
