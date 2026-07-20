import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { NotificationsResponse } from './types';

export const fetchNotifications = async (
  unreadOnly = false,
): Promise<NotificationsResponse> => {
  const response = await apiClient.get<NotificationsResponse>(
    ENDPOINTS.notifications.list,
    { params: unreadOnly ? { unreadOnly: true } : undefined },
  );
  return response.data;
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await apiClient.patch(ENDPOINTS.notifications.markRead(id));
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await apiClient.post(ENDPOINTS.notifications.markAllRead);
};
