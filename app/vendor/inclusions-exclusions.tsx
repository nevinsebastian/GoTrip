import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorInclusionsExclusionsScreen } from '@/src/screens/DesktopVendorInclusionsExclusionsScreen';
import { MobileVendorInclusionsExclusionsScreen } from '@/src/screens/MobileVendorInclusionsExclusionsScreen';

export default function VendorInclusionsExclusionsRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorInclusionsExclusionsScreen}
      Desktop={DesktopVendorInclusionsExclusionsScreen}
    />
  );
}
