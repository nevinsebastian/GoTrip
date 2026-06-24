import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorDescribeActivityScreen } from '@/src/screens/DesktopVendorDescribeActivityScreen';
import { MobileVendorDescribeActivityScreen } from '@/src/screens/MobileVendorDescribeActivityScreen';

export default function VendorDescribeActivityRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorDescribeActivityScreen}
      Desktop={DesktopVendorDescribeActivityScreen}
    />
  );
}
