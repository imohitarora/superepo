"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { User, Key, Users, Mail } from "lucide-react"

const settingsTabs = [
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
    name: "Team",
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
    <div className="flex flex-1 flex-col">
      <div className="border-b">
        <div className="flex h-16 flex-col justify-center px-4">
          <h1 className="text-lg font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex px-4">
          {settingsTabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex items-center px-4 py-2 -mb-px text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.name}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </div>
  )
}
