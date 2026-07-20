import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { useHomeSearch, type SearchSelectedListing } from '@/src/components/home/HomeSearchContext';
import { useDesktopBookingFocus } from '@/src/hooks/useDesktopBookingFocus';
import { useActivityDetail, useGlampingDetail, usePackageDetail } from '@/src/hooks/useCategoryListing';
import { useListingDetails } from '@/src/hooks/useListingDetails';
import { DesktopCategoryListingDetailScreen } from '@/src/screens/DesktopCategoryListingDetailScreen';
import { DesktopHotelDetailScreen } from '@/src/screens/DesktopHotelDetailScreen';
import { getListingCarouselImages } from '@/src/utils/listingNavigation';
import { getPackageFixedDates } from '@/src/utils/packageDates';
import { defaultHotelStayDates, toDateOnly } from '@/src/utils/bookingPayment';
import {
  mapActivityDetailToBookingEntity,
  mapGlampingDetailToBookingEntity,
} from '@/src/utils/mapBookingEntity';
import type { ActivityDetail, GlampingDetail } from '@/src/api/types';
import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';

type DesktopSearchListingDetailProps = {
  listing: SearchSelectedListing;
  tab: HomeCategoryTab;
  onBack: () => void;
  onTabChange?: (tab: HomeCategoryTab) => void;
  isLoggedIn?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLoginPress?: () => void;
};

export function DesktopSearchListingDetail({
  listing,
  tab,
  onBack,
  onTabChange,
  isLoggedIn,
  onMenuPress,
  onProfilePress,
  onLoginPress,
}: DesktopSearchListingDetailProps) {
  const { searchParams } = useHomeSearch();
  const isHotels = tab === 'hotels';
  const isPackages = tab === 'packages';
  const isGlamping = tab === 'glamping';
  const isActivities = tab === 'activities';

  const { data: activityDetail } = useActivityDetail(listing.id, isActivities);
  const { data: glampingDetail } = useGlampingDetail(listing.id, isGlamping);
  const { data: packageDetail } = usePackageDetail(listing.id, isPackages);
  const categoryDisplay = isActivities
    ? activityDetail?.display
    : isGlamping
      ? glampingDetail?.display
      : isPackages
        ? packageDetail?.display
        : undefined;

  const { data: listingRes } = useListingDetails(isHotels ? listing.id : undefined);
  const listingDetail = listingRes?.data;

  const priceFromMeta = useMemo(
    () =>
      listing.price_start != null
        ? `₹${Number(listing.price_start).toLocaleString('en-IN')}`
        : '',
    [listing.price_start],
  );

  const onGuestSave = useCallback(
    (details: {
      checkIn: string | null;
      checkOut: string | null;
    }) => {
      const packageDates = tab === 'packages' ? getPackageFixedDates(listing.id) : null;
      const defaults = defaultHotelStayDates(tab === 'activities' ? 1 : 2, 7);
      const checkIn =
        toDateOnly(details.checkIn) ??
        toDateOnly(packageDates?.startDate) ??
        toDateOnly(searchParams?.checkIn) ??
        defaults.checkIn;
      const checkOut =
        toDateOnly(details.checkOut) ??
        toDateOnly(packageDates?.endDate) ??
        toDateOnly(searchParams?.checkOut) ??
        defaults.checkOut;

      // Desktop hotels use confirm-dates flow (not mobile review).
      if (tab === 'hotels') {
        router.push({
          pathname: '/booking/confirm',
          params: {
            listingId: listing.id,
            listingType: 'hotel',
            title: listing.title,
            checkIn,
            checkOut,
          },
        });
        return;
      }

      if (tab === 'glamping') {
        const glamping = glampingDetail?.detail as GlampingDetail | undefined;
        const entity = glamping ? mapGlampingDetailToBookingEntity(glamping) : null;
        router.push({
          pathname: '/booking/review',
          params: {
            listingId: listing.id,
            listingType: 'glamping',
            title: listing.title,
            price: priceFromMeta,
            checkIn,
            checkOut,
            entityType: entity?.entityType ?? 'glamping_site',
            entityId: entity?.entityId ?? '',
            unitsBooked: String(entity?.unitsBooked ?? 1),
            adults: '2',
          },
        });
        return;
      }

      if (tab === 'activities') {
        const activity = activityDetail?.detail as ActivityDetail | undefined;
        const entity = activity ? mapActivityDetailToBookingEntity(activity, undefined, 2) : null;
        router.push({
          pathname: '/booking/review',
          params: {
            listingId: listing.id,
            listingType: 'activity',
            title: listing.title,
            price: priceFromMeta,
            checkIn,
            entityType: entity?.entityType ?? 'activity_slot',
            entityId: entity?.entityId ?? '',
            activitySlotId: entity?.activitySlotId ?? entity?.entityId ?? '',
            unitsBooked: String(entity?.unitsBooked ?? 2),
            adults: '2',
          },
        });
        return;
      }

      router.push({
        pathname: '/booking/review',
        params: {
          listingId: listing.id,
          listingType: 'package',
          title: listing.title,
          price: priceFromMeta,
          checkIn,
          checkOut,
        },
      });
    },
    [
      activityDetail?.detail,
      glampingDetail?.detail,
      listing.id,
      listing.title,
      priceFromMeta,
      searchParams?.checkIn,
      searchParams?.checkOut,
      tab,
    ],
  );

  const { openDateModal, bookingFocus } = useDesktopBookingFocus({ onGuestSave });

  const handleBookNow = useCallback(() => {
    if (!isLoggedIn) {
      onLoginPress?.();
      if (!onLoginPress) router.push('/login');
      return;
    }
    openDateModal();
  }, [isLoggedIn, onLoginPress, openDateModal]);

  if (!isHotels) {
    return (
      <DesktopCategoryListingDetailScreen
        tab={tab}
        title={listing.title}
        priceLabel={priceFromMeta}
        display={categoryDisplay}
        onBack={onBack}
        onTabChange={onTabChange}
        onBookNow={handleBookNow}
        bookingFocus={bookingFocus}
        isLoggedIn={isLoggedIn}
        onMenuPress={onMenuPress}
        onProfilePress={onProfilePress}
        onLoginPress={onLoginPress}
      />
    );
  }

  const title = listingDetail?.title ?? listing.title;
  const displayPrice =
    listingDetail?.price_start != null
      ? `₹${Number(listingDetail.price_start).toLocaleString('en-IN')}`
      : priceFromMeta || '₹2,420';

  const locationLabel = (() => {
    const loc = (listingDetail?.location ?? listing.location ?? searchParams?.location ?? '').trim();
    if (!loc) return '—';
    return loc.split(',')[0]?.trim() || loc;
  })();

  const carouselImages = getListingCarouselImages(listingDetail?.media);

  return (
    <DesktopHotelDetailScreen
      listing={listingDetail}
      title={title}
      locationLabel={locationLabel}
      address={listingDetail?.location ?? listing.location ?? undefined}
      rating="4.5"
      carouselImages={carouselImages}
      displayPrice={displayPrice}
      onBack={onBack}
      onBookNow={handleBookNow}
      onTabChange={onTabChange}
      activeTab="hotels"
      isLoggedIn={isLoggedIn}
      onMenuPress={onMenuPress}
      onProfilePress={onProfilePress}
      onLoginPress={onLoginPress}
      bookingFocus={bookingFocus}
    />
  );
}
