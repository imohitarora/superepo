'use client';

import { Button } from '@repo/ui/components/button';
import { useHealthCheck } from '@/hooks/use-api';

export default function Page() {
  const { data, isLoading, error } = useHealthCheck();

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <div className="text-sm text-muted-foreground">
          {isLoading && 'Checking API health...'}
          {error && `API Error: ${error.message}`}
          {data && `API Status: ${data}`}
        </div>
        <Button size="sm">Button</Button>
      </div>
    </div>
  );
}
