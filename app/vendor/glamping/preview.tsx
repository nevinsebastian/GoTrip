import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorGlampingPreviewScreen } from '@/src/screens/glamping/DesktopVendorGlampingPreviewScreen';
import { MobileVendorGlampingPreviewScreen } from '@/src/screens/glamping/MobileVendorGlampingPreviewScreen';

export default function VendorGlampingPreviewRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorGlampingPreviewScreen}
      Desktop={DesktopVendorGlampingPreviewScreen}
    />
  );
}

