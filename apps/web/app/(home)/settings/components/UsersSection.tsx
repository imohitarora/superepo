"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

type User = {
  id: number
  name: string
  email: string
  status: "Active" | "Invited"
}

export default function UsersSection() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    // Mock API call to fetch users
    const fetchUsers = async () => {
      // In a real app, this would be an API call
      const mockUsers: User[] = [
        { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Invited" },
      ]
      setUsers(mockUsers)
    }

    fetchUsers()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

