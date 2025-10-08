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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Search, FileText, Share2, Eye, Trash2, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function VaultPage() {
  const [uploadOpen, setUploadOpen] = useState(false)

  const files = [
    {
      name: "NDA.pdf",
      cid: "Qm...12A",
      size: "4.2MB",
      created: "08/10/25",
      access: "Private",
      expiry: "None",
    },
    {
      name: "contract.pdf",
      cid: "Qm...34B",
      size: "2.1MB",
      created: "07/10/25",
      access: "Restricted",
      expiry: "15/10/25",
    },
    {
      name: "presentation.pptx",
      cid: "Qm...56C",
      size: "8.5MB",
      created: "06/10/25",
      access: "Public",
      expiry: "None",
    },
    {
      name: "report.docx",
      cid: "Qm...78D",
      size: "1.3MB",
      created: "05/10/25",
      access: "Private",
      expiry: "None",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">My Vault</h1>
            <p className="text-muted-foreground">Manage your encrypted files</p>
          </div>
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Upload File</DialogTitle>
                <DialogDescription>Encrypt and store your file securely on IPFS</DialogDescription>
              </DialogHeader>
              <form className="space-y-6 mt-4">
                <div>
                  <Label htmlFor="file">File Upload</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-secondary/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <Input id="file" type="file" className="hidden" />
                    <Button type="button" variant="outline" size="sm" className="glass bg-transparent">
                      Select File
                    </Button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="filename">File Name (Optional)</Label>
                    <Input id="filename" placeholder="Enter custom name" className="mt-2 bg-background/50" />
                  </div>
                  <div>
                    <Label htmlFor="access">Access Type</Label>
                    <Select defaultValue="private">
                      <SelectTrigger className="mt-2 bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add a description..."
                    className="mt-2 bg-background/50 resize-none"
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="encryption">Encryption</Label>
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
                  <div>
                    <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                    <Input id="expiry" type="date" className="mt-2 bg-background/50" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (Optional)</Label>
                  <Input id="tags" placeholder="Add tags separated by commas" className="mt-2 bg-background/50" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Encrypt & Upload
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUploadOpen(false)}
                    className="glass bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filter */}
        <Card className="glass-strong p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search files..." className="pl-10 bg-background/50" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="md:w-48 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="doc">Documents</SelectItem>
                <SelectItem value="image">Images</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Files Table */}
        <Card className="glass-strong overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>CID</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary" />
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{file.cid}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.created}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-medium">
                      {file.access}
                    </span>
                  </TableCell>
                  <TableCell>{file.expiry}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-strong border-border">
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke
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
    </DashboardLayout>
  )
}
