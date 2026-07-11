import type { VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';

export function formatCoordinatePreview(coordinate: VendorMapCoordinate): string {
  return `${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`;
}
