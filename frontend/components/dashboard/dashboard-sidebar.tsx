"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderLock,
  Share2,
  Inbox,
  Bell,
  AlertTriangle,
  Users,
  Shield,
  Zap,
  FileText,
  Code,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderLock, label: "My Vault", href: "/dashboard/vault" },
  { icon: Share2, label: "Shared Files", href: "/dashboard/shared" },
  { icon: Inbox, label: "Received Files", href: "/dashboard/received" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: AlertTriangle, label: "Emergency Access", href: "/dashboard/emergency" },
  { icon: Users, label: "Team Workspace", href: "/dashboard/team" },
  { icon: Shield, label: "AI Guardian", href: "/dashboard/guardian" },
  { icon: Zap, label: "Automation", href: "/dashboard/automation" },
  { icon: FileText, label: "Audit Logs", href: "/dashboard/audit" },
  { icon: Code, label: "SDK & Integration", href: "/dashboard/sdk" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sidebar-primary to-secondary rounded-lg" />
          <span className="text-xl font-serif font-semibold">BlockRoll</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
