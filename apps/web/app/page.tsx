'use client';

import { UserTable } from '@/components/user-table';

export default function Page() {
  return (
    <main className="min-h-svh bg-background px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Superepo Staff Portal
          </p>
          <h1 className="text-3xl font-bold text-foreground">
            Manage your team in a single glance
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            The team overview below is powered by a mock API endpoint and rendered using
            @tanstack/react-table for fast sorting and filtering.
          </p>
        </header>

        <UserTable />
      </div>
    </main>
  );
}
