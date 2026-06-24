import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorDescribeCampScreen } from '@/src/screens/DesktopVendorDescribeCampScreen';
import { MobileVendorDescribeCampScreen } from '@/src/screens/MobileVendorDescribeCampScreen';

export default function VendorDescribeCampRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorDescribeCampScreen}
      Desktop={DesktopVendorDescribeCampScreen}
    />
  );
}
