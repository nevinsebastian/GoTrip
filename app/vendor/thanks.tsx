import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorThanksScreen } from '@/src/screens/DesktopVendorThanksScreen';
import { MobileVendorThanksScreen } from '@/src/screens/MobileVendorThanksScreen';

export default function VendorThanksRoute() {
  return <VendorPlatformScreen Mobile={MobileVendorThanksScreen} Desktop={DesktopVendorThanksScreen} />;
}
