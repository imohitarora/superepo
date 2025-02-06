import type React from "react"
import { SettingsSidebar } from "./components/settings-sidebar"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <SettingsSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

