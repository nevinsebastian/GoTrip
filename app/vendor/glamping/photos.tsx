import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorGlampingPhotosScreen } from '@/src/screens/glamping/DesktopVendorGlampingPhotosScreen';
import { MobileVendorGlampingPhotosScreen } from '@/src/screens/glamping/MobileVendorGlampingPhotosScreen';

export default function VendorGlampingPhotosRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorGlampingPhotosScreen}
      Desktop={DesktopVendorGlampingPhotosScreen}
    />
  );
}

