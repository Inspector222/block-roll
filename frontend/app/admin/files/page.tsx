"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function AdminFilesPage() {
  const files = [
    { cid: "Qm...12A", owner: "0x123...9A", size: "4.2MB", uploaded: "08/10/25", access: "Private" },
    { cid: "Qm...34B", owner: "0x456...8B", size: "2.1MB", uploaded: "07/10/25", access: "Public" },
    { cid: "Qm...56C", owner: "0x789...7C", size: "8.5MB", uploaded: "06/10/25", access: "Restricted" },
    { cid: "Qm...78D", owner: "0xABC...6D", size: "1.3MB", uploaded: "05/10/25", access: "Private" },
    { cid: "Qm...90E", owner: "0xDEF...5E", size: "12.8MB", uploaded: "04/10/25", access: "Public" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Files Management</h1>
          <p className="text-muted-foreground">Monitor and manage all platform files</p>
        </div>

        {/* Search */}
        <Card className="glass-strong p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by CID or owner..." className="pl-10 bg-background/50 font-mono" />
          </div>
        </Card>

        {/* Files Table */}
        <Card className="glass-strong overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>CID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Access Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell className="font-mono text-sm">{file.cid}</TableCell>
                  <TableCell className="font-mono text-sm">{file.owner}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.uploaded}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-medium">
                      {file.access}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-strong border-border">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Inspect
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
