import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api';

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
