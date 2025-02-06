"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
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

export default function SettingsPage() {
  const pathname = usePathname()

  return (
    <div className="grid gap-6 p-4 md:p-6 pt-0">
      {/* Profile Settings */}
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <form className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <p className="text-sm text-muted-foreground">
                  Update your personal information and email address
                </p>
              </div>
              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    defaultValue="Mohit Arora"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    defaultValue="mohit@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    defaultValue="mohitarora"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    defaultValue="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <form className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Configure how you receive notifications and alerts
                </p>
              </div>
              <Separator />
              <div className="grid gap-4">
                {[
                  "Email notifications for payments",
                  "SMS alerts for due dates",
                  "Browser notifications for updates",
                ].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <div>
                      <Label>{item}</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when there are updates
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
