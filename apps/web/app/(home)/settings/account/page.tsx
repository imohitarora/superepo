import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { ProfileForm } from "./components/profile-form"
import { PasswordForm } from "./components/password-form"
import { UsersTable } from "./components/users-table"
import { InviteForm } from "./components/invite-form"

export default function AccountSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your account settings and set preferences</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="password" className="space-y-4">
          <PasswordForm />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <InviteForm />
          <UsersTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}

