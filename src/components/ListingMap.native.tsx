import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, type MapViewProps } from 'react-native-maps';
import { StyleProp, ViewStyle } from 'react-native';

type Props = {
  latitude: number;
  longitude: number;
  style?: StyleProp<ViewStyle>;
  mapProps?: Omit<MapViewProps, 'provider' | 'style' | 'initialRegion'>;
};

export function ListingMap({ latitude, longitude, style, mapProps }: Props) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={style as any}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }}
      {...mapProps}
    >
      <Marker coordinate={{ latitude, longitude }} />
    </MapView>
  );
}

