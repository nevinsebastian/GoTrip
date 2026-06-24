import { useResponsive } from '@/components/ui/useResponsive';
import { DesktopVendorLoginScreen } from '@/src/screens/DesktopVendorLoginScreen';
import { MobileVendorLoginScreen } from '@/src/screens/MobileVendorLoginScreen';
import { Platform } from 'react-native';

export default function VendorLoginRoute() {
  const { isDesktop } = useResponsive();
  const isDesktopWeb = Platform.OS === 'web' && isDesktop;
  if (isDesktopWeb) return <DesktopVendorLoginScreen />;
  return <MobileVendorLoginScreen />;
}
