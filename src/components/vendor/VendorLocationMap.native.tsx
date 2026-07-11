import type { VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';
import React, { useEffect, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import MapView, { UrlTile, type Region } from 'react-native-maps';

const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

type VendorLocationMapProps = {
  coordinate: VendorMapCoordinate;
  onCoordinateChange: (coordinate: VendorMapCoordinate) => void;
  style?: StyleProp<ViewStyle>;
};

export function VendorLocationMap({ coordinate, onCoordinateChange, style }: VendorLocationMapProps) {
  const mapRef = useRef<MapView | null>(null);
  const isDragging = useRef(false);
  const skipRegionSync = useRef(false);

  const region: Region = {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  useEffect(() => {
    if (isDragging.current) return;
    skipRegionSync.current = true;
    mapRef.current?.animateToRegion(region, 280);
  }, [coordinate.latitude, coordinate.longitude]);

  return (
    <View style={[styles.wrap, style]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        mapType="none"
        onRegionChange={() => {
          if (skipRegionSync.current) return;
          isDragging.current = true;
        }}
        onRegionChangeComplete={(nextRegion: Region) => {
          if (skipRegionSync.current) {
            skipRegionSync.current = false;
            isDragging.current = false;
            return;
          }
          isDragging.current = false;
          onCoordinateChange({
            latitude: nextRegion.latitude,
            longitude: nextRegion.longitude,
          });
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <UrlTile urlTemplate={OSM_TILE_URL} maximumZ={19} flipY={false} />
      </MapView>
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
