import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorGuestPackageDetailsScreen } from '@/src/screens/DesktopVendorGuestPackageDetailsScreen';
import { MobileVendorGuestPackageDetailsScreen } from '@/src/screens/MobileVendorGuestPackageDetailsScreen';

export default function VendorGuestPackageDetailsRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorGuestPackageDetailsScreen}
      Desktop={DesktopVendorGuestPackageDetailsScreen}
    />
  );
}
