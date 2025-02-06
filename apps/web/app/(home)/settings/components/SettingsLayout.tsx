"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  ChevronDown,
  User,
  Key,
  Users,
  Mail,
  Menu,
} from "lucide-react"

interface SettingsLayoutProps {
  children: ReactNode
}

const menuItems = [
  { icon: User, label: "Profile", href: "#profile" },
  { icon: Key, label: "Password", href: "#password" },
  { icon: Users, label: "Users", href: "#users" },
  { icon: Mail, label: "Invites", href: "#invites" },
]

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="flex md:hidden items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-4 w-4 mr-2" />
          Menu
          <ChevronDown
            className={cn(
              "ml-auto h-4 w-4 transition-transform duration-200",
              isMobileMenuOpen ? "rotate-180" : ""
            )}
          />
        </Button>

        {/* Sidebar Navigation */}
        <div
          className={cn(
            "w-full md:w-64 shrink-0",
            isMobileMenuOpen ? "block" : "hidden md:block"
          )}
        >
          <ScrollArea className="py-4">
            <h3 className="mb-2 px-4 text-lg font-semibold">Settings</h3>
            <div className="flex flex-col space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <a href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </a>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Account Settings</h3>
            <p className="text-sm text-muted-foreground">
              Manage your account settings and set preferences
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
