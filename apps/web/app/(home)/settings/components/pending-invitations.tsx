"use client"

import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { toast } from "@workspace/ui/hooks/use-toast"
import { settingsApi } from "../api/settings"
import { formatDistanceToNow } from "date-fns"

interface PendingInvitation {
  id: string
  email: string
  role: string
  createdAt: string
  expiresAt: string
}

export function PendingInvitations() {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState<string | null>(null)

  const fetchInvitations = async () => {
    try {
      const data = await settingsApi.getPendingInvitations()
      setInvitations(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pending invitations",
        variant: "destructive",
      })
    }
  }

  const handleResend = async (invitationId: string) => {
    setResending(invitationId)
    try {
      await settingsApi.resendInvitation(invitationId)
      toast({
        title: "Success",
        description: "Invitation resent successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive",
      })
    } finally {
      setResending(null)
    }
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  if (!invitations.length) {
    return <div className="text-sm text-muted-foreground">No pending invitations</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Sent</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell>{invitation.email}</TableCell>
            <TableCell className="capitalize">{invitation.role}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(invitation.createdAt))} ago</TableCell>
            <TableCell>{formatDistanceToNow(new Date(invitation.expiresAt))} left</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResend(invitation.id)}
                disabled={resending === invitation.id}
              >
                {resending === invitation.id ? "Resending..." : "Resend"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
