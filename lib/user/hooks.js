import { fetcher } from '@/lib/fetch';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export function useCurrentUser() {
  const { data: session, status } = useSession();

  // Return session data directly
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
  };
}

export function useUser(id) {
  return useSWR(`/api/users/${id}`, fetcher);
}
