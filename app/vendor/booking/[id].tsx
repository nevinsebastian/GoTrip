import { useResponsive } from '@/components/ui/useResponsive';
import { DesktopVendorBookingDetailsScreen } from '@/src/screens/DesktopVendorBookingDetailsScreen';
import { MobileVendorBookingDetailsScreen } from '@/src/screens/MobileVendorBookingDetailsScreen';
import { Platform } from 'react-native';

export default function VendorBookingDetailsRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  if (isDesktopWeb) return <DesktopVendorBookingDetailsScreen />;
  return <MobileVendorBookingDetailsScreen />;
}
