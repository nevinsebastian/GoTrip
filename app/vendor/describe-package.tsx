import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorDescribePackageScreen } from '@/src/screens/DesktopVendorDescribePackageScreen';
import { MobileVendorDescribePackageScreen } from '@/src/screens/MobileVendorDescribePackageScreen';

export default function VendorDescribePackageRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorDescribePackageScreen}
      Desktop={DesktopVendorDescribePackageScreen}
    />
  );
}
