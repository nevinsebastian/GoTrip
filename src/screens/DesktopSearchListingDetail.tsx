import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { useHomeSearch, type SearchSelectedListing } from '@/src/components/home/HomeSearchContext';
import { useDesktopBookingFocus } from '@/src/hooks/useDesktopBookingFocus';
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
      router.push({
        pathname: '/booking/review',
        params: {
          listingId: listing.id,
          ...(tab === 'packages' ? { listingType: 'package' } : {}),
          title: listing.title,
          price: priceFromMeta,
          checkIn: details.checkIn ?? packageDates?.startDate ?? searchParams?.checkIn ?? '',
          checkOut: details.checkOut ?? packageDates?.endDate ?? searchParams?.checkOut ?? '',
        },
      });
    },
    [listing.id, listing.title, priceFromMeta, searchParams?.checkIn, searchParams?.checkOut, tab],
  );

  const { openDateModal, bookingFocus } = useDesktopBookingFocus({ onGuestSave });

  if (!isHotels) {
    return (
      <DesktopCategoryListingDetailScreen
        tab={tab}
        title={listing.title}
        priceLabel={priceFromMeta}
        onBack={onBack}
        onTabChange={onTabChange}
        onBookNow={openDateModal}
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
      onBookNow={openDateModal}
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
