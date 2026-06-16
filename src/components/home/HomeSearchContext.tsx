import type { GuestCounts, HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type HomeSearchSubmit = {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: GuestCounts;
  tab: HomeCategoryTab;
  packageMood?: string;
};

type HomeSearchContextValue = {
  searchMode: boolean;
  searchParams: HomeSearchSubmit | null;
  activeCategoryTab: HomeCategoryTab;
  setActiveCategoryTab: (tab: HomeCategoryTab) => void;
  enterSearchMode: (params: HomeSearchSubmit) => void;
  exitSearchMode: () => void;
  updateSearchLocation: (location: string) => void;
};

const HomeSearchContext = createContext<HomeSearchContextValue | null>(null);

export function HomeSearchProvider({ children }: { children: React.ReactNode }) {
  const [searchMode, setSearchMode] = useState(false);
  const [searchParams, setSearchParams] = useState<HomeSearchSubmit | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<HomeCategoryTab>('hotels');

  const enterSearchMode = useCallback((params: HomeSearchSubmit) => {
    setSearchParams(params);
    setSearchMode(true);
  }, []);

  const exitSearchMode = useCallback(() => {
    setSearchMode(false);
  }, []);

  const updateSearchLocation = useCallback((location: string) => {
    setSearchParams((prev) => (prev ? { ...prev, location } : prev));
  }, []);

  const value = useMemo(
    () => ({
      searchMode,
      searchParams,
      activeCategoryTab,
      setActiveCategoryTab,
      enterSearchMode,
      exitSearchMode,
      updateSearchLocation,
    }),
    [searchMode, searchParams, activeCategoryTab, enterSearchMode, exitSearchMode, updateSearchLocation],
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
