import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorGuestActivityDetailsScreen } from '@/src/screens/DesktopVendorGuestActivityDetailsScreen';
import { MobileVendorGuestActivityDetailsScreen } from '@/src/screens/MobileVendorGuestActivityDetailsScreen';

export default function VendorGuestActivityDetailsRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorGuestActivityDetailsScreen}
      Desktop={DesktopVendorGuestActivityDetailsScreen}
    />
  );
}
