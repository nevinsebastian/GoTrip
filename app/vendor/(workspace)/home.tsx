import { useResponsive } from '@/components/ui/useResponsive';
import { DesktopVendorDashboardScreen } from '@/src/screens/DesktopVendorDashboardScreen';
import { MobileVendorDashboardScreen } from '@/src/screens/MobileVendorDashboardScreen';
import { Platform } from 'react-native';

export default function VendorHomeRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  if (isDesktopWeb) return <DesktopVendorDashboardScreen />;
  return <MobileVendorDashboardScreen />;
}
