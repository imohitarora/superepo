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
import { MoreHorizontal, Clock } from "lucide-react"
import { toast } from "@workspace/ui/hooks/use-toast"
import { settingsApi, User } from "../api/settings"
import { formatDistanceToNow } from "date-fns"

interface PendingInvitation {
  id: string
  email: string
  role: string
  createdAt: string
  expiresAt: string
}

interface TeamMember {
  type: 'user' | 'invitation'
  id: string
  email: string
  role: string
  name?: string
  createdAt: string
  status?: 'active' | 'pending'
  expiresAt?: string
}

export function TeamList() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)

  const loadData = async () => {
    try {
      console.log('Fetching team data...');
      const [usersResponse, invitations] = await Promise.all([
        settingsApi.getTeamMembers(),
        settingsApi.getPendingInvitations(),
      ]);

      console.log('API Responses:', { usersResponse, invitations });

      // Convert users and invitations to TeamMember format
      const membersList: TeamMember[] = [
        ...(usersResponse?.users || []).map((user): TeamMember => ({
          type: 'user',
          id: user.id,
          email: user.email,
          role: user.roles.includes('admin') ? 'admin' : 'user',
          name: user.name,
          createdAt: user.createdAt || new Date().toISOString(),
          status: 'active',
        })),
        ...(invitations || []).map((inv): TeamMember => ({
          type: 'invitation',
          id: inv.id,
          email: inv.email,
          role: inv.role || 'user',
          createdAt: inv.createdAt,
          status: 'pending',
          expiresAt: inv.expiresAt,
        })),
      ];

      console.log('Processed team members:', membersList);
      setTeamMembers(membersList);
    } catch (error) {
      console.error('Error loading team data:', error);
      toast({
        title: "Error",
        description: "Failed to load team members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    loadData()
  }, [])

  const handleAction = async (action: string, memberId: string, data?: any) => {
    setActionInProgress(memberId);
    try {
      switch (action) {
        case 'remove':
          if (data?.type === 'invitation') {
            await settingsApi.cancelInvitation(memberId);
            toast({
              title: "Success",
              description: "Invitation cancelled successfully.",
            });
          } else {
            await settingsApi.removeTeamMember(memberId);
            toast({
              title: "Success",
              description: "Team member removed successfully.",
            });
          }
          break;
        case 'changeRole':
          await settingsApi.changeUserRole(memberId, data);
          toast({
            title: "Success",
            description: "User role updated successfully.",
          });
          break;
        case 'resend':
          await settingsApi.resendInvitation(memberId);
          toast({
            title: "Success",
            description: "Invitation resent successfully.",
          });
          break;
      }
      await loadData(); // Reload the list
    } catch (error) {
      console.error('Error performing action:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Action failed.",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

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
                      {member.name?.split(' ').map(n => n[0]).join('') || member.email?.split('@')[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">
                        {member.email}
                        {currentUser?.id === member.id && " (You)"}
                      </p>
                      {member.status === 'pending' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.status === 'pending'
                        ? `Invited ${formatDistanceToNow(new Date(member.createdAt))} ago`
                        : `Joined ${formatDistanceToNow(new Date(member.createdAt))} ago`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={member.role === 'admin' ? "default" : "secondary"}>
                    {member.role}
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
                        {member.type === 'user' ? (
                          <>
                            {member.role !== 'admin' ? (
                              <DropdownMenuItem
                                onClick={() => handleAction('changeRole', member.id, 'admin')}
                                disabled={actionInProgress === member.id}
                              >
                                Make admin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleAction('changeRole', member.id, 'user')}
                                disabled={actionInProgress === member.id}
                              >
                                Remove admin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleAction('remove', member.id)}
                              disabled={actionInProgress === member.id}
                            >
                              Remove member
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleAction('resend', member.id)}
                              disabled={actionInProgress === member.id}
                            >
                              Resend invitation
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleAction('remove', member.id, member)}
                              disabled={actionInProgress === member.id}
                            >
                              Cancel invitation
                            </DropdownMenuItem>
                          </>
                        )}
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
