import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import {
    SidebarInset,
    SidebarProvider,
} from "@workspace/ui/components/sidebar"
import ProtectedLayout from '@/components/protected-layout';

// Import the navigation data
import { data } from "@/components/app-sidebar"

export default async function HomeLayout({ children }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ProtectedLayout>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <Header />
                    <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </ProtectedLayout>
    )
}