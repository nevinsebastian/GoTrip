import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorPhotosScreen } from '@/src/screens/DesktopVendorPhotosScreen';
import { MobileVendorPhotosScreen } from '@/src/screens/MobileVendorPhotosScreen';

export default function VendorPhotosRoute() {
  return (
    <VendorPlatformScreen Mobile={MobileVendorPhotosScreen} Desktop={DesktopVendorPhotosScreen} />
  );
}
