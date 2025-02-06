"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { HomeIcon, PackageIcon, LayoutGridIcon, SettingsIcon } from "lucide-react"

const menuItems = [
  {
    title: "Overview",
    href: "/settings",
    icon: HomeIcon,
  },
  {
    title: "Account",
    href: "/settings/account",
    icon: SettingsIcon,
  },
  {
    title: "Projects",
    href: "/settings/projects",
    icon: LayoutGridIcon,
  },
  {
    title: "Packages",
    href: "/settings/packages",
    icon: PackageIcon,
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

