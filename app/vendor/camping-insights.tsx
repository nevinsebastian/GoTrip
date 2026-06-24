import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorCampingInsightsScreen } from '@/src/screens/DesktopVendorCampingInsightsScreen';
import { MobileVendorCampingInsightsScreen } from '@/src/screens/MobileVendorCampingInsightsScreen';

export default function VendorCampingInsightsRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorCampingInsightsScreen}
      Desktop={DesktopVendorCampingInsightsScreen}
    />
  );
}
