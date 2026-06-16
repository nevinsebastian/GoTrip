import { colors } from '@/constants/DesignTokens';
import type { VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';
import React, { useEffect, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import MapView, { type Region } from 'react-native-maps';

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
        onRegionChange={() => {
          if (skipRegionSync.current) return;
          isDragging.current = true;
        }}
        onRegionChangeComplete={(nextRegion) => {
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
      />
      <View pointerEvents="none" style={styles.pinShadow} />
      <View pointerEvents="none" style={styles.pin}>
        <View style={styles.pinHead}>
          <View style={styles.pinBuilding} />
        </View>
        <View style={styles.pinTail} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#d9e8ef',
  },
  pinShadow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 18,
    height: 6,
    marginLeft: -9,
    marginTop: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  pin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
    marginLeft: -16,
    marginTop: -42,
  },
  pinHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1c2024',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBuilding: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: colors.surface.white,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1c2024',
    marginTop: -1,
  },
});
