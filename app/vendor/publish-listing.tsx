import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorPublishListingScreen } from '@/src/screens/DesktopVendorPublishListingScreen';
import { MobileVendorPublishListingScreen } from '@/src/screens/MobileVendorPublishListingScreen';

export default function VendorPublishListingRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorPublishListingScreen}
      Desktop={DesktopVendorPublishListingScreen}
    />
  );
}
