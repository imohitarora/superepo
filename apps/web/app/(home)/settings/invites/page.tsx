"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { UserPlus } from "lucide-react"

const invites = [
  {
    id: 1,
    email: "sarah@example.com",
    role: "Editor",
    status: "Pending",
    sentAt: "2 hours ago",
    expiresIn: "5 days",
  },
  {
    id: 2,
    email: "mike@example.com",
    role: "Viewer",
    status: "Expired",
    sentAt: "5 days ago",
    expiresIn: "Expired",
  },
  {
    id: 3,
    email: "alex@example.com",
    role: "Admin",
    status: "Pending",
    sentAt: "1 hour ago",
    expiresIn: "6 days",
  },
]

export default function InvitesPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6 pt-0">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Pending Invitations</h2>
                <p className="text-sm text-muted-foreground">
                  Manage team invitations and their status
                </p>
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Send Invite
              </Button>
            </div>

            <div className="grid gap-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input placeholder="Enter email address" type="email" />
                    </div>
                    <Select defaultValue="editor">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The invitation link will be valid for 7 days
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{invite.email}</p>
                      <Badge
                        variant={
                          invite.status === "Pending" ? "default" : "secondary"
                        }
                      >
                        {invite.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sent {invite.sentAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Expires in: {invite.expiresIn}
                    </div>
                    <Badge variant="outline">{invite.role}</Badge>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                    <Button variant="outline" size="sm">
                      Resend
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
