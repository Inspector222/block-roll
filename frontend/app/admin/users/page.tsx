"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Ban, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function AdminUsersPage() {
  const users = [
    { wallet: "0x123...9A", joined: "08/10/25", files: 14, storage: "2.4GB", status: "Active" },
    { wallet: "0x456...8B", joined: "07/10/25", files: 8, storage: "1.2GB", status: "Active" },
    { wallet: "0x789...7C", joined: "06/10/25", files: 22, storage: "4.8GB", status: "Active" },
    { wallet: "0xABC...6D", joined: "05/10/25", files: 5, storage: "0.8GB", status: "Suspended" },
    { wallet: "0xDEF...5E", joined: "04/10/25", files: 31, storage: "6.2GB", status: "Active" },
    { wallet: "0xGHI...4F", joined: "03/10/25", files: 12, storage: "2.1GB", status: "Active" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Users Management</h1>
          <p className="text-muted-foreground">Manage platform users and their access</p>
        </div>

        {/* Search */}
        <Card className="glass-strong p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by wallet address..." className="pl-10 bg-background/50 font-mono" />
          </div>
        </Card>

        {/* Users Table */}
        <Card className="glass-strong overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Wallet Address</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Storage Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell className="font-mono text-sm">{user.wallet}</TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell>{user.files}</TableCell>
                  <TableCell>{user.storage}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-secondary/20 text-secondary"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {user.status}
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
                          View Files
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="w-4 h-4 mr-2" />
                          {user.status === "Active" ? "Suspend" : "Reactivate"}
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
