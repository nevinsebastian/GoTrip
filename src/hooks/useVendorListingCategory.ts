import type { VendorListingCategoryId } from '@/src/constants/vendorOnboardingConstants';
import { getStoredVendorListingCategory } from '@/src/utils/vendorSession';
import { useEffect, useState } from 'react';

export function useVendorListingCategory(defaultCategory: VendorListingCategoryId = 'property') {
  const [categoryId, setCategoryId] = useState<VendorListingCategoryId>(defaultCategory);

  useEffect(() => {
    getStoredVendorListingCategory().then((stored) => {
      if (stored) setCategoryId(stored);
    });
  }, []);

  return categoryId;
}
