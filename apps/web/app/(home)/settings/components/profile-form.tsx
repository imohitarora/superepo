"use client"

import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "@workspace/ui/hooks/use-toast"
import { settingsApi, User } from "../api/settings"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { InfoIcon } from "lucide-react"

export function ProfileForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState({
    name: "",
    bio: "",
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await settingsApi.getProfile()
        setUser(data)
        setForm({
          name: data.name || "",
          bio: data.bio || "",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updatedUser = await settingsApi.updateProfile({
        name: form.name || undefined,
        bio: form.bio || undefined,
      })
      setUser(updatedUser)
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          View and manage your profile settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Profile customization is coming soon! You'll be able to update your name, bio, and other details.
          </AlertDescription>
        </Alert>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={user?.email || ""}
              disabled
            />
            <p className="text-sm text-muted-foreground">
              Your email address is used for login and notifications.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Your name as you'd like others to see it.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              placeholder="Tell us about yourself"
              value={form.bio}
              onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
              className="h-32"
            />
            <p className="text-sm text-muted-foreground">
              A brief description about yourself that others will see.
            </p>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
