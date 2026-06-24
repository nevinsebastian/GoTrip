import { VendorPlatformScreen } from '@/src/components/vendor/VendorPlatformScreen';
import { DesktopVendorDescribePropertyScreen } from '@/src/screens/DesktopVendorDescribePropertyScreen';
import { MobileVendorDescribePropertyScreen } from '@/src/screens/MobileVendorDescribePropertyScreen';

export default function VendorDescribePropertyRoute() {
  return (
    <VendorPlatformScreen
      Mobile={MobileVendorDescribePropertyScreen}
      Desktop={DesktopVendorDescribePropertyScreen}
    />
  );
}
