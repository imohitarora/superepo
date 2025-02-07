"use client"

import { NavBreadcrumb } from "@/components/nav-breadcrumb"
import {
    SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { LogoutButton } from "@/components/logout-button"

const navItems = [
    {
        title: "Home",
        url: "/",
        items: [
            {
                title: "Dashboard",
                url: "/dashboard",
            },
            {
                title: "Transactions",
                url: "/transactions",
            },
        ],
    },
    {
        title: "Settings",
        url: "/settings",
    },
]

export function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-6" />
                <NavBreadcrumb items={navItems} />
                <div className="ml-auto">
                    <LogoutButton />
                </div>
            </div>
        </header>
    )
}
