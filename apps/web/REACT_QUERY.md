# React Query Setup

This project uses @tanstack/react-query v5 for server state management.

## Configuration

- **Query Client**: Configured in `lib/query-client.ts`
- **Provider**: Set up in `components/providers.tsx`
- **API Client**: Generic fetch wrapper in `lib/api.ts`
- **Hooks**: Reusable API hooks in `hooks/use-api.ts`

### Default Query Settings

```typescript
{
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  }
}
```

## Usage Examples

### Basic Query

```tsx
import { useHealthCheck } from '@/hooks/use-api';

export function HealthStatus() {
  const { data, isLoading, error } = useHealthCheck();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Status: {data}</div>;
}
```

### Custom Query Hook

```tsx
import { useApiQuery } from '@/hooks/use-api';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
}

export function useUser(userId: string) {
  return useApiQuery<User>(
    ['user', userId],
    () => api.get<User>(`/users/${userId}`)
  );
}
```

### Mutation Hook

```tsx
import { useApiMutation } from '@/hooks/use-api';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

interface CreateUserData {
  name: string;
  email: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useApiMutation<User, CreateUserData>(
    (data) => api.post<User>('/users', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }
  );
}
```

### Using in Component

```tsx
'use client';

import { useCreateUser } from '@/hooks/use-users';

export function CreateUserForm() {
  const createUser = useCreateUser();

  const handleSubmit = async (data: CreateUserData) => {
    try {
      await createUser.mutateAsync(data);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

## API Client Methods

```typescript
import { api } from '@/lib/api';

// GET request
const data = await api.get<ResponseType>('/endpoint');

// POST request
const result = await api.post<ResponseType>('/endpoint', { key: 'value' });

// PUT request
const updated = await api.put<ResponseType>('/endpoint', { key: 'value' });

// PATCH request
const patched = await api.patch<ResponseType>('/endpoint', { key: 'value' });

// DELETE request
const deleted = await api.delete<ResponseType>('/endpoint');
```

## Error Handling

The API client throws `ApiError` instances with:

```typescript
class ApiError extends Error {
  status: number;
  message: string;
  data?: unknown;
}
```

## DevTools

React Query DevTools are included in development mode. Press the React Query icon in the bottom corner to inspect queries and mutations.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
