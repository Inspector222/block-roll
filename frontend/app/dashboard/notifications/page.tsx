"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CheckCheck, Trash2 } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      type: "System",
      message: "New file uploaded successfully",
      timestamp: "10/08 13:20",
      status: "seen",
    },
    {
      type: "Security",
      message: "Suspicious access detected from new IP",
      timestamp: "10/08 14:22",
      status: "unseen",
    },
    {
      type: "Share",
      message: "You shared access with 0xA23...E9",
      timestamp: "10/07 09:15",
      status: "seen",
    },
    {
      type: "System",
      message: "Storage limit at 75%",
      timestamp: "10/06 16:30",
      status: "seen",
    },
    {
      type: "Security",
      message: "Login from new device detected",
      timestamp: "10/06 11:45",
      status: "unseen",
    },
    {
      type: "Share",
      message: "Access revoked for 0xB31...A1",
      timestamp: "10/05 14:20",
      status: "seen",
    },
    {
      type: "System",
      message: "File encryption completed",
      timestamp: "10/05 10:15",
      status: "seen",
    },
    {
      type: "Security",
      message: "AI Guardian detected anomaly",
      timestamp: "10/04 18:30",
      status: "unseen",
    },
  ]

  const unseenNotifications = notifications.filter((n) => n.status === "unseen")
  const seenNotifications = notifications.filter((n) => n.status === "seen")

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Security":
        return "text-destructive"
      case "Share":
        return "text-secondary"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your account activity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass bg-transparent">
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
            <Button variant="outline" className="glass bg-transparent text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="glass-strong p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notifications.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </Card>
          <Card className="glass-strong p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unseenNotifications.length}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </Card>
          <Card className="glass-strong p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted/20 flex items-center justify-center">
                <CheckCheck className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{seenNotifications.length}</p>
                <p className="text-sm text-muted-foreground">Read</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Notifications Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="glass-strong">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unseenNotifications.length})</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="glass-strong overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification, index) => (
                    <TableRow key={index} className="border-border">
                      <TableCell>
                        <div
                          className={`w-2 h-2 rounded-full ${notification.status === "unseen" ? "bg-secondary" : "bg-muted"}`}
                        />
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                      </TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{notification.timestamp}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="unread">
            <Card className="glass-strong overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unseenNotifications.map((notification, index) => (
                    <TableRow key={index} className="border-border">
                      <TableCell>
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                      </TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{notification.timestamp}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="glass-strong overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications
                    .filter((n) => n.type === "System")
                    .map((notification, index) => (
                      <TableRow key={index} className="border-border">
                        <TableCell>
                          <div
                            className={`w-2 h-2 rounded-full ${notification.status === "unseen" ? "bg-secondary" : "bg-muted"}`}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-muted-foreground">{notification.type}</span>
                        </TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{notification.timestamp}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="glass-strong overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications
                    .filter((n) => n.type === "Security")
                    .map((notification, index) => (
                      <TableRow key={index} className="border-border">
                        <TableCell>
                          <div
                            className={`w-2 h-2 rounded-full ${notification.status === "unseen" ? "bg-secondary" : "bg-muted"}`}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-destructive">{notification.type}</span>
                        </TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{notification.timestamp}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="share">
            <Card className="glass-strong overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications
                    .filter((n) => n.type === "Share")
                    .map((notification, index) => (
                      <TableRow key={index} className="border-border">
                        <TableCell>
                          <div
                            className={`w-2 h-2 rounded-full ${notification.status === "unseen" ? "bg-secondary" : "bg-muted"}`}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-secondary">{notification.type}</span>
                        </TableCell>
                        <TableCell>{notification.message}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{notification.timestamp}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
