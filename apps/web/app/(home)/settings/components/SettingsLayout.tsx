import type { ReactNode } from "react"

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your account settings and set preferences</p>
      </div>
      {children}
    </div>
  )
}

