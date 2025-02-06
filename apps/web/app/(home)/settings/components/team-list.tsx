"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

// This would come from your API
type TeamMember = {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatarUrl?: string
  status: "active" | "invited"
}

const dummyTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "user",
    status: "invited",
  },
]

export function TeamList() {
  const handleRemoveMember = async (memberId: string) => {
    // TODO: Implement remove member functionality
    console.log("Remove member:", memberId)
  }

  const handleChangeRole = async (memberId: string, newRole: "admin" | "user") => {
    // TODO: Implement role change functionality
    console.log("Change role:", memberId, newRole)
  }

  const handleResendInvite = async (memberId: string) => {
    // TODO: Implement resend invite functionality
    console.log("Resend invite:", memberId)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members and their roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dummyTeamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between space-x-4 rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                  {member.status === "invited" && (
                    <Badge variant="outline">Pending</Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {member.role === "user" ? (
                        <DropdownMenuItem
                          onClick={() => handleChangeRole(member.id, "admin")}
                        >
                          Make admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleChangeRole(member.id, "user")}
                        >
                          Remove admin
                        </DropdownMenuItem>
                      )}
                      {member.status === "invited" && (
                        <DropdownMenuItem
                          onClick={() => handleResendInvite(member.id)}
                        >
                          Resend invite
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
