import type { GuestCounts, HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type HomeSearchSubmit = {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: GuestCounts;
  tab: HomeCategoryTab;
  packageMood?: string;
  activityMood?: string;
};

export type SearchSelectedListing = {
  id: string;
  title: string;
  price_start?: string | null;
  location?: string | null;
  tab: HomeCategoryTab;
};

type HomeSearchContextValue = {
  searchMode: boolean;
  searchParams: HomeSearchSubmit | null;
  selectedSearchListing: SearchSelectedListing | null;
  activeCategoryTab: HomeCategoryTab;
  setActiveCategoryTab: (tab: HomeCategoryTab) => void;
  enterSearchMode: (params: HomeSearchSubmit) => void;
  exitSearchMode: () => void;
  openSearchListing: (listing: SearchSelectedListing) => void;
  closeSearchListing: () => void;
  updateSearchLocation: (location: string) => void;
};

const HomeSearchContext = createContext<HomeSearchContextValue | null>(null);

export function HomeSearchProvider({ children }: { children: React.ReactNode }) {
  const [searchMode, setSearchMode] = useState(false);
  const [searchParams, setSearchParams] = useState<HomeSearchSubmit | null>(null);
  const [selectedSearchListing, setSelectedSearchListing] = useState<SearchSelectedListing | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<HomeCategoryTab>('hotels');

  const enterSearchMode = useCallback((params: HomeSearchSubmit) => {
    setSearchParams(params);
    setSearchMode(true);
    setSelectedSearchListing(null);
  }, []);

  const exitSearchMode = useCallback(() => {
    setSearchMode(false);
    setSelectedSearchListing(null);
  }, []);

  const openSearchListing = useCallback((listing: SearchSelectedListing) => {
    setSelectedSearchListing(listing);
  }, []);

  const closeSearchListing = useCallback(() => {
    setSelectedSearchListing(null);
  }, []);

  const updateSearchLocation = useCallback((location: string) => {
    setSearchParams((prev) => (prev ? { ...prev, location } : prev));
  }, []);

  const value = useMemo(
    () => ({
      searchMode,
      searchParams,
      selectedSearchListing,
      activeCategoryTab,
      setActiveCategoryTab,
      enterSearchMode,
      exitSearchMode,
      openSearchListing,
      closeSearchListing,
      updateSearchLocation,
    }),
    [
      searchMode,
      searchParams,
      selectedSearchListing,
      activeCategoryTab,
      enterSearchMode,
      exitSearchMode,
      openSearchListing,
      closeSearchListing,
      updateSearchLocation,
    ],
  );

  return <HomeSearchContext.Provider value={value}>{children}</HomeSearchContext.Provider>;
}

export function useHomeSearch() {
  const ctx = useContext(HomeSearchContext);
  if (!ctx) {
    throw new Error('useHomeSearch must be used within HomeSearchProvider');
  }
  return ctx;
}
