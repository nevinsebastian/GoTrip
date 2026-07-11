import { getStoredAuthToken } from '@/src/api/client';
import { useQuery } from '@tanstack/react-query';

export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

/** True when a JWT is stored locally. Does not call `/users/me`. */
export function useIsAuthenticated() {
  return useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: async () => Boolean((await getStoredAuthToken())?.trim()),
    staleTime: 0,
    refetchOnMount: true,
  });
}
