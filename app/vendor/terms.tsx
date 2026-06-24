import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorTermsScreen } from '@/src/screens/DesktopVendorTermsScreen';
import { MobileVendorTermsScreen } from '@/src/screens/MobileVendorTermsScreen';

export default function VendorTermsRoute() {
  return <VendorPlatformScreen Mobile={MobileVendorTermsScreen} Desktop={DesktopVendorTermsScreen} />;
}
