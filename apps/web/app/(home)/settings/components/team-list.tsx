"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
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
import { toast } from "@workspace/ui/hooks/use-toast"
import { settingsApi, User } from "../api/settings"

export function TeamList() {
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const loadTeamMembers = async () => {
    try {
      const users = await settingsApi.getTeamMembers()
      setTeamMembers(users)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load team members. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentUser = async () => {
    try {
      const user = await settingsApi.getProfile()
      setCurrentUser(user)
    } catch (error) {
      console.error("Failed to load current user:", error)
    }
  }

  useEffect(() => {
    loadCurrentUser()
    loadTeamMembers()
  }, [])

  const handleRemoveMember = async (memberId: string) => {
    try {
      await settingsApi.removeTeamMember(memberId)
      toast({
        title: "Success",
        description: "Team member removed successfully.",
      })
      loadTeamMembers() // Reload the list
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove team member.",
        variant: "destructive",
      })
    }
  }

  const handleChangeRole = async (memberId: string, newRole: "admin" | "user") => {
    try {
      await settingsApi.changeUserRole(memberId, newRole)
      toast({
        title: "Success",
        description: "User role updated successfully.",
      })
      loadTeamMembers() // Reload the list
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user role.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading team members...</div>
  }

  const isAdmin = currentUser?.roles.includes("admin")

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
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between space-x-4 rounded-lg border p-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {member.name || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {member.email}
                      {currentUser?.id === member.id && " (You)"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(member.createdAt || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={member.roles.includes("admin") ? "default" : "secondary"}>
                    {member.roles.includes("admin") ? "Admin" : "User"}
                  </Badge>
                  {isAdmin && currentUser?.id !== member.id && (
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
                        {!member.roles.includes("admin") ? (
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
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          Remove member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
            {teamMembers.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No team members found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
