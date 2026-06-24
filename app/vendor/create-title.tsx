import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorCreateTitleScreen } from '@/src/screens/DesktopVendorCreateTitleScreen';
import { MobileVendorCreateTitleScreen } from '@/src/screens/MobileVendorCreateTitleScreen';

export default function VendorCreateTitleRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorCreateTitleScreen}
      Desktop={DesktopVendorCreateTitleScreen}
    />
  );
}
