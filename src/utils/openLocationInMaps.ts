import { Linking, Platform } from 'react-native';

export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

function coerceCoord(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Read lat/lng from hotel/activity/glamping/package `locationJson`. */
export function parseLocationCoordinates(
  loc?: {
    lat?: unknown;
    lng?: unknown;
    latitude?: unknown;
    longitude?: unknown;
  } | null,
): MapCoordinates | null {
  if (!loc) return null;
  const latitude = coerceCoord(loc.lat ?? loc.latitude);
  const longitude = coerceCoord(loc.lng ?? loc.longitude);
  if (latitude == null || longitude == null) return null;
  return { latitude, longitude };
}

/**
 * Open device maps for navigation to a listing coordinate.
 * iOS → Apple Maps, Android → Google Maps / geo intent, Web → Google Maps directions.
 */
export async function openLocationInMaps(options: {
  latitude: number;
  longitude: number;
  label?: string;
}): Promise<void> {
  const { latitude, longitude } = options;
  const label = (options.label ?? 'Destination').trim() || 'Destination';
  const coord = `${latitude},${longitude}`;
  const encodedLabel = encodeURIComponent(label);

  if (Platform.OS === 'web') {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coord}`;
    await Linking.openURL(url);
    return;
  }

  if (Platform.OS === 'ios') {
    const apple = `http://maps.apple.com/?daddr=${coord}&q=${encodedLabel}`;
    await Linking.openURL(apple);
    return;
  }

  // Android — prefer Google Maps navigation, fall back to geo: / web maps
  const googleNav = `google.navigation:q=${coord}`;
  try {
    const canNav = await Linking.canOpenURL(googleNav);
    if (canNav) {
      await Linking.openURL(googleNav);
      return;
    }
  } catch {
    // continue to fallbacks
  }

  const geo = `geo:${coord}?q=${coord}(${encodedLabel})`;
  try {
    await Linking.openURL(geo);
    return;
  } catch {
    await Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${coord}`);
  }
}
