import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorGuestRoomDetailsScreen } from '@/src/screens/DesktopVendorGuestRoomDetailsScreen';
import { MobileVendorGuestRoomDetailsScreen } from '@/src/screens/MobileVendorGuestRoomDetailsScreen';

export default function VendorGuestRoomDetailsRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorGuestRoomDetailsScreen}
      Desktop={DesktopVendorGuestRoomDetailsScreen}
    />
  );
}
