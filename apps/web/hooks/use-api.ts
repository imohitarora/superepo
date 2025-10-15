import { useMemo } from 'react';
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Contributor';
  status: 'Active' | 'Invited' | 'Suspended';
  team: string;
  lastLogin: string;
};

export type UsersResponse = {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
};

export type UsersQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string[];
  status?: string[];
};

// Example: Health check query
export function useHealthCheck(
  options?: Omit<UseQueryOptions<string, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<string, ApiError>({
    queryKey: ['health'],
    queryFn: () => api.get<string>('/health'),
    ...options,
  });
}

// Example: Generic mutation hook factory
export function useApiMutation<TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    ...options,
  });
}

// Example: Typed query hook factory
export function useApiQuery<TData = unknown>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, ApiError>({
    queryKey,
    queryFn,
    ...options,
  });
}

export function useUsers(
  params: UsersQueryParams,
  options?: Omit<UseQueryOptions<UsersResponse, ApiError>, 'queryKey' | 'queryFn'>
): UseQueryResult<UsersResponse, ApiError> {
  const queryKey = useMemo(() => ['users', params] as const, [params]);

  return useQuery<UsersResponse, ApiError>({
    queryKey,
    queryFn: () => api.get<UsersResponse>(`/users${buildQueryString(params)}`),
    staleTime: 30_000,
    placeholderData: (previous) => previous,
    ...options,
  });
}

function buildQueryString(params: UsersQueryParams) {
  const searchParams = new URLSearchParams();

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;

  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));

  if (params.search) {
    searchParams.set('search', params.search);
  }

  params.role?.forEach((value) => {
    searchParams.append('role', value);
  });

  params.status?.forEach((value) => {
    searchParams.append('status', value);
  });

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : '';
}
