"use client"

import type React from "react"
import { SettingsSidebar } from "./components/settings-sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"
import { User, Key, Users, Mail } from "lucide-react"

const tabs = [
  {
    name: "Profile",
    href: "/settings",
    icon: User,
  },
  {
    name: "Password",
    href: "/settings/password",
    icon: Key,
  },
  {
    name: "Users",
    href: "/settings/users",
    icon: Users,
  },
  {
    name: "Invites",
    href: "/settings/invites",
    icon: Mail,
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Page Header */}
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and set preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Settings">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
                )}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
