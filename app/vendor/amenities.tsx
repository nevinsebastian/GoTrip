import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorAmenitiesScreen } from '@/src/screens/DesktopVendorAmenitiesScreen';
import { MobileVendorAmenitiesScreen } from '@/src/screens/MobileVendorAmenitiesScreen';

export default function VendorAmenitiesRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorAmenitiesScreen}
      Desktop={DesktopVendorAmenitiesScreen}
    />
  );
}
