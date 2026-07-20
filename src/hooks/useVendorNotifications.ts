import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/src/api/notifications.service';
import type { APIError, AppNotification } from '@/src/api/types';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const VENDOR_NOTIFICATIONS_QUERY_KEY = ['vendor', 'notifications'] as const;

export function useVendorNotifications(unreadOnly = false) {
  const query = useQuery<AppNotification[], APIError>({
    queryKey: [...VENDOR_NOTIFICATIONS_QUERY_KEY, unreadOnly],
    queryFn: async () => {
      const res = await fetchNotifications(unreadOnly);
      return res.data ?? [];
    },
    retry: (count, error) => {
      const apiError = error as APIError;
      if (apiError.statusCode === 401) return false;
      return count < 1;
    },
    staleTime: 30 * 1000,
  });

  return {
    notifications: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error ? getErrorMessage(query.error) : null,
    refetch: query.refetch,
  };
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation<void, APIError, string>({
    mutationFn: markNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: VENDOR_NOTIFICATIONS_QUERY_KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation<void, APIError, void>({
    mutationFn: markAllNotificationsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: VENDOR_NOTIFICATIONS_QUERY_KEY }),
  });
}
