import { useResponsive } from '@/components/ui/useResponsive';
import { DesktopVendorListingsScreen } from '@/src/screens/DesktopVendorListingsScreen';
import { MobileVendorListingsScreen } from '@/src/screens/MobileVendorListingsScreen';
import { Platform } from 'react-native';

export default function VendorListingsRoute() {
  const { isDesktop, isTablet } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && (isDesktop || isTablet);
  if (isDesktopWeb) return <DesktopVendorListingsScreen />;
  return <MobileVendorListingsScreen />;
}
