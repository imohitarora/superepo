import SettingsLayout from "./components/SettingsLayout"
import ProfileSection from "./components/ProfileSection"
import PasswordSection from "./components/PasswordSection"
import UsersSection from "./components/UsersSection"
import InviteSection from "./components/InviteSection"

export default function SettingsPage() {
  return (
    <SettingsLayout>
      <ProfileSection />
      <PasswordSection />
      <UsersSection />
      <InviteSection />
    </SettingsLayout>
  )
}

