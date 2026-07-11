import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorGlampingTitleScreen } from '@/src/screens/glamping/DesktopVendorGlampingTitleScreen';
import { MobileVendorGlampingTitleScreen } from '@/src/screens/glamping/MobileVendorGlampingTitleScreen';

export default function VendorGlampingTitleRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorGlampingTitleScreen}
      Desktop={DesktopVendorGlampingTitleScreen}
    />
  );
}

