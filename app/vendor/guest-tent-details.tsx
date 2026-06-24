import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorGuestTentDetailsScreen } from '@/src/screens/DesktopVendorGuestTentDetailsScreen';
import { MobileVendorGuestTentDetailsScreen } from '@/src/screens/MobileVendorGuestTentDetailsScreen';

export default function VendorGuestTentDetailsRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorGuestTentDetailsScreen}
      Desktop={DesktopVendorGuestTentDetailsScreen}
    />
  );
}
