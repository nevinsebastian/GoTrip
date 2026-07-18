import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { useHomeSearch, type SearchSelectedListing } from '@/src/components/home/HomeSearchContext';
import { useDesktopBookingFocus } from '@/src/hooks/useDesktopBookingFocus';
import { useActivityDetail, useGlampingDetail, usePackageDetail } from '@/src/hooks/useCategoryListing';
import { useListingDetails } from '@/src/hooks/useListingDetails';
import { DesktopCategoryListingDetailScreen } from '@/src/screens/DesktopCategoryListingDetailScreen';
import { DesktopHotelDetailScreen } from '@/src/screens/DesktopHotelDetailScreen';
import { getListingCarouselImages } from '@/src/utils/listingNavigation';
import { getPackageFixedDates } from '@/src/utils/packageDates';
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
      const checkIn = details.checkIn ?? packageDates?.startDate ?? searchParams?.checkIn ?? '';
      const checkOut = details.checkOut ?? packageDates?.endDate ?? searchParams?.checkOut ?? '';

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

      router.push({
        pathname: '/booking/review',
        params: {
          listingId: listing.id,
          listingType:
            tab === 'packages'
              ? 'package'
              : tab === 'glamping'
                ? 'glamping'
                : tab === 'activities'
                  ? 'activity'
                  : 'hotel',
          title: listing.title,
          price: priceFromMeta,
          checkIn,
          checkOut,
        },
      });
    },
    [listing.id, listing.title, priceFromMeta, searchParams?.checkIn, searchParams?.checkOut, tab],
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
