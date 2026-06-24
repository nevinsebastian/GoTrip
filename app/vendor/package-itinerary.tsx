import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorPackageItineraryScreen } from '@/src/screens/DesktopVendorPackageItineraryScreen';
import { MobileVendorPackageItineraryScreen } from '@/src/screens/MobileVendorPackageItineraryScreen';

export default function VendorPackageItineraryRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorPackageItineraryScreen}
      Desktop={DesktopVendorPackageItineraryScreen}
    />
  );
}
