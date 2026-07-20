import { fetchVendorProfile } from '@/src/api/vendor.service';
import { getVendorMyListings } from '@/src/api/vendorListings.service';
import { fetchVendorBookings } from '@/src/api/vendorBookings.service';
import { fetchVendorPayouts } from '@/src/api/vendorPayouts.service';
import { fetchNotifications } from '@/src/api/notifications.service';
import type {
  AppNotification,
  VendorBooking,
  VendorPayout,
  VendorProfileFull,
} from '@/src/api/types';
import { useQuery } from '@tanstack/react-query';

export const VENDOR_DASHBOARD_QUERY_KEY = ['vendor', 'dashboard'] as const;

export interface VendorDashboardData {
  profile: VendorProfileFull | undefined;
  totalListings: number;
  activeListings: number;
  draftListings: number;
  recentBookings: VendorBooking[];
  recentPayouts: VendorPayout[];
  unreadNotifications: AppNotification[];
  unreadCount: number;
}

export function useVendorDashboard() {
  return useQuery<VendorDashboardData>({
    queryKey: VENDOR_DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      const [profileRes, listingsRes, bookingsRes, payoutsRes, notificationsRes] =
        await Promise.allSettled([
          fetchVendorProfile(),
          getVendorMyListings({ limit: 100, offset: 0 }),
          fetchVendorBookings({ limit: 10, offset: 0 }),
          fetchVendorPayouts({ limit: 10, offset: 0 }),
          fetchNotifications(true),
        ]);

      const profile =
        profileRes.status === 'fulfilled' ? profileRes.value.data : undefined;

      const listings =
        listingsRes.status === 'fulfilled' ? listingsRes.value.listings : [];
      const totalListings = listings.length;
      const activeListings = listings.filter((l) => l.status === 'active').length;
      const draftListings = listings.filter((l) => l.status === 'draft').length;

      const recentBookings =
        bookingsRes.status === 'fulfilled' ? (bookingsRes.value.data ?? []) : [];

      const recentPayouts =
        payoutsRes.status === 'fulfilled' ? (payoutsRes.value.data ?? []) : [];

      const notifData =
        notificationsRes.status === 'fulfilled' ? (notificationsRes.value.data ?? []) : [];
      const unreadNotifications = notifData.filter((n) => !(n.isRead ?? n.read));
      const unreadCount = unreadNotifications.length;

      return {
        profile,
        totalListings,
        activeListings,
        draftListings,
        recentBookings,
        recentPayouts,
        unreadNotifications,
        unreadCount,
      };
    },
    retry: false,
    staleTime: 60 * 1000,
  });
}
