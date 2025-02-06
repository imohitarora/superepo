'use client';

import { Button } from "@workspace/ui/components/button"
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react"

export function LogoutButton() {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
        >
            <LogOut className="h-4 w-4" />
        </Button>
    );
}
