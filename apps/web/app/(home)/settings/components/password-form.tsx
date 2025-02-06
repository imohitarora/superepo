"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { InfoIcon } from "lucide-react"

export function PasswordForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Password change functionality is coming soon! You'll be able to update your password here.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
