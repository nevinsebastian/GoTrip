import { useWindowDimensions } from 'react-native';
import { breakpoints } from '@/constants/DesignTokens';

/**
 * Responsive utility hook
 * Returns breakpoint information and responsive helpers
 */
export function useResponsive() {
  const { width } = useWindowDimensions();

  const isMobile = width < breakpoints.tablet;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isDesktop = width >= breakpoints.desktop;

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints,
  };
}
