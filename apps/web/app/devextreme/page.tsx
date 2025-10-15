'use client';

import dynamic from 'next/dynamic';

const DevExtremeUserGrid = dynamic(
  () => import('@/components/devextreme-user-grid').then((mod) => mod.DevExtremeUserGrid),
  { ssr: false },
);

export default function DevExtremePage() {
  return (
    <main className="min-h-svh bg-background px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Superepo Staff Portal - DevExtreme
          </p>
          <h1 className="text-3xl font-bold text-foreground">DevExtreme Data Grid Benchmark</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            This page renders the same mock API via DevExtreme&apos;s DataGrid with server-driven paging
            to compare interaction performance against the TanStack table.
          </p>
        </header>

        <DevExtremeUserGrid />
      </div>
    </main>
  );
}
