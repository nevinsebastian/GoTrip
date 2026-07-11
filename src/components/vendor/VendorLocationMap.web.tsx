import type { VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';
import React, { useEffect, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const LEAFLET_CSS_ID = 'gotrip-leaflet-css';

function ensureLeafletStyles() {
  if (typeof document === 'undefined') return;
  if (!document.getElementById(LEAFLET_CSS_ID)) {
    const link = document.createElement('link');
    link.id = LEAFLET_CSS_ID;
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }
  if (!document.getElementById('gotrip-leaflet-zfix')) {
    const style = document.createElement('style');
    style.id = 'gotrip-leaflet-zfix';
    style.textContent = `
      .gotrip-vendor-map.leaflet-container { z-index: 0 !important; }
      .gotrip-vendor-map .leaflet-pane { z-index: 1 !important; }
      .gotrip-vendor-map .leaflet-top,
      .gotrip-vendor-map .leaflet-bottom { z-index: 2 !important; }
    `;
    document.head.appendChild(style);
  }
}

type VendorLocationMapProps = {
  coordinate: VendorMapCoordinate;
  onCoordinateChange: (coordinate: VendorMapCoordinate) => void;
  style?: StyleProp<ViewStyle>;
};

export function VendorLocationMap({ coordinate, onCoordinateChange, style }: VendorLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const onCoordinateChangeRef = useRef(onCoordinateChange);
  const skipPanRef = useRef(false);
  const isUserPanningRef = useRef(false);

  onCoordinateChangeRef.current = onCoordinateChange;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      ensureLeafletStyles();
      const leafletModule = await import('leaflet');
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      const L = leafletModule.default;
      const map = L.map(mapContainerRef.current, {
        center: [coordinate.latitude, coordinate.longitude],
        zoom: 15,
        zoomControl: false,
      });
      mapContainerRef.current.classList.add('gotrip-vendor-map');

      L.tileLayer(OSM_TILE_URL, {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('movestart', () => {
        if (!skipPanRef.current) isUserPanningRef.current = true;
      });
      map.on('moveend', () => {
        if (skipPanRef.current) {
          skipPanRef.current = false;
          isUserPanningRef.current = false;
          return;
        }
        isUserPanningRef.current = false;
        const center = map.getCenter();
        onCoordinateChangeRef.current({
          latitude: center.lat,
          longitude: center.lng,
        });
      });

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || isUserPanningRef.current) return;

    const center = map.getCenter();
    if (
      Math.abs(center.lat - coordinate.latitude) < 0.00001 &&
      Math.abs(center.lng - coordinate.longitude) < 0.00001
    ) {
      return;
    }

    skipPanRef.current = true;
    map.setView([coordinate.latitude, coordinate.longitude], map.getZoom(), { animate: true });
  }, [coordinate.latitude, coordinate.longitude]);

  return (
    <View style={[styles.wrap, style]}>
      {React.createElement('div', {
        ref: mapContainerRef,
        style: { width: '100%', height: '100%', zIndex: 0 },
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#d9e8ef',
    position: 'relative',
  },
});
