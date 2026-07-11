import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { MobileVendorSelectLocationScreen } from '@/src/screens/MobileVendorSelectLocationScreen';

export default function VendorSelectLocationRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorSelectLocationScreen}
      loadDesktop={() =>
        require('@/src/screens/DesktopVendorSelectLocationScreen').DesktopVendorSelectLocationScreen
      }
    />
  );
}
