import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorGlampingMealPlansScreen } from '@/src/screens/glamping/DesktopVendorGlampingMealPlansScreen';
import { MobileVendorGlampingMealPlansScreen } from '@/src/screens/glamping/MobileVendorGlampingMealPlansScreen';

export default function VendorGlampingMealPlansRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorGlampingMealPlansScreen}
      Desktop={DesktopVendorGlampingMealPlansScreen}
    />
  );
}

