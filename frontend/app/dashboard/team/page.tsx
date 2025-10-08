"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Settings, FileText, Trash2 } from "lucide-react"
import { useState } from "react"

export default function TeamWorkspacePage() {
  const [createTeamOpen, setCreateTeamOpen] = useState(false)

  const teams = [
    {
      name: "Engineering Team",
      members: 8,
      files: 24,
      created: "01/10/25",
    },
    {
      name: "Design Team",
      members: 5,
      files: 16,
      created: "15/09/25",
    },
    {
      name: "Marketing Team",
      members: 6,
      files: 12,
      created: "20/09/25",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Team Workspace</h1>
            <p className="text-muted-foreground">Collaborate securely with your teams</p>
          </div>
          <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Create New Team</DialogTitle>
                <DialogDescription>Set up a collaborative workspace for your team</DialogDescription>
              </DialogHeader>
              <form className="space-y-6 mt-4">
                <div>
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input id="team-name" placeholder="Enter team name" className="mt-2 bg-background/50" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What is this team for?"
                    className="mt-2 bg-background/50 resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Team Members</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Wallet address (0x...)"
                        className="flex-1 bg-background/50 font-mono text-sm"
                      />
                      <Select defaultValue="editor">
                        <SelectTrigger className="w-32 bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" size="icon" variant="outline" className="glass bg-transparent">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Create Team
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateTeamOpen(false)}
                    className="glass bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Teams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <Card key={index} className="glass-strong p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-1">{team.name}</h3>
                <p className="text-sm text-muted-foreground">Created {team.created}</p>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div>
                  <p className="text-2xl font-bold">{team.members}</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-2xl font-bold">{team.files}</p>
                  <p className="text-xs text-muted-foreground">Files</p>
                </div>
              </div>
              <Button variant="outline" className="w-full glass bg-transparent">
                View Team Vault
              </Button>
            </Card>
          ))}
        </div>

        {/* Team Members Section */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-6">Engineering Team Members</h2>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Wallet Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Files Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border">
                <TableCell className="font-mono text-sm">0x1A2...B3C</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-medium">Admin</span>
                </TableCell>
                <TableCell>01/10/25</TableCell>
                <TableCell>12</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="font-mono text-sm">0x4D5...E6F</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md bg-muted/50 text-foreground text-xs font-medium">Editor</span>
                </TableCell>
                <TableCell>02/10/25</TableCell>
                <TableCell>8</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell className="font-mono text-sm">0x7G8...H9I</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md bg-muted/50 text-foreground text-xs font-medium">Viewer</span>
                </TableCell>
                <TableCell>03/10/25</TableCell>
                <TableCell>0</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* Team Vault Files */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-6">Team Vault Files</h2>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>File Name</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Access</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-secondary" />
                    <span className="font-medium">project-spec.pdf</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">0x1A2...B3C</TableCell>
                <TableCell>2.4MB</TableCell>
                <TableCell>08/10/25</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-medium">
                    Team Only
                  </span>
                </TableCell>
              </TableRow>
              <TableRow className="border-border">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-secondary" />
                    <span className="font-medium">architecture.png</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">0x4D5...E6F</TableCell>
                <TableCell>1.8MB</TableCell>
                <TableCell>07/10/25</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-medium">
                    Team Only
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  )
}
