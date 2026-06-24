import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorSelectLocationScreen } from '@/src/screens/DesktopVendorSelectLocationScreen';
import { MobileVendorSelectLocationScreen } from '@/src/screens/MobileVendorSelectLocationScreen';

export default function VendorSelectLocationRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorSelectLocationScreen}
      Desktop={DesktopVendorSelectLocationScreen}
    />
  );
}
