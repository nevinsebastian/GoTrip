import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorSetPricingScreen } from '@/src/screens/DesktopVendorSetPricingScreen';
import { MobileVendorSetPricingScreen } from '@/src/screens/MobileVendorSetPricingScreen';

export default function VendorSetPricingRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorSetPricingScreen}
      Desktop={DesktopVendorSetPricingScreen}
    />
  );
}
