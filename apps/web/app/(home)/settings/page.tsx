"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { ProfileForm } from "./components/profile-form"
import { PasswordForm } from "./components/password-form"
import { InviteForm } from "./components/invite-form"
import { TeamList } from "./components/team-list"
import { Separator } from "@workspace/ui/components/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="invite">Invite</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Manage your profile settings and preferences.
            </p>
          </div>
          <ProfileForm />
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Security</h3>
            <p className="text-sm text-muted-foreground">
              Update your password and secure your account.
            </p>
          </div>
          <PasswordForm />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Team Members</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your team members.
            </p>
          </div>
          <TeamList />
        </TabsContent>
        <TabsContent value="invite" className="space-y-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Team Members</h3>
              <p className="text-sm text-muted-foreground">
                Invite new members to join your team.
              </p>
            </div>
            <Separator />
            <InviteForm />            
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}