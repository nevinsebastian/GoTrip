import { clearVendorActivityDraft } from '@/src/utils/vendorActivityDraft';
import { clearVendorActivityListingId } from '@/src/utils/vendorActivitySession';
import { clearVendorGlampingDraft } from '@/src/utils/vendorGlampingDraft';
import { clearVendorGlampingImageStore } from '@/src/utils/vendorGlampingImageStore';
import { clearVendorGlampingListingId } from '@/src/utils/vendorGlampingSession';
import { clearVendorHotelDraft } from '@/src/utils/vendorHotelDraft';
import { clearVendorHotelListingId } from '@/src/utils/vendorHotelSession';
import { clearVendorPackageDraft } from '@/src/utils/vendorPackageDraft';
import { clearVendorPackageListingId } from '@/src/utils/vendorPackageSession';
import { clearVendorSession } from '@/src/utils/vendorSession';

/** Clears all persisted vendor onboarding drafts, listing ids, and session flags. */
export async function clearVendorOnboardingState(): Promise<void> {
  await Promise.all([
    clearVendorActivityDraft(),
    clearVendorActivityListingId(),
    clearVendorGlampingDraft(),
    clearVendorGlampingImageStore(),
    clearVendorGlampingListingId(),
    clearVendorHotelDraft(),
    clearVendorHotelListingId(),
    clearVendorPackageDraft(),
    clearVendorPackageListingId(),
    clearVendorSession(),
  ]);
}
