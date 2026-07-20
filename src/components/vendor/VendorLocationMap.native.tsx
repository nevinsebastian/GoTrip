import type { VendorMapCoordinate } from '@/src/constants/vendorPropertyConstants';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

type VendorLocationMapProps = {
  coordinate: VendorMapCoordinate;
  onCoordinateChange: (coordinate: VendorMapCoordinate) => void;
  style?: StyleProp<ViewStyle>;
};

function buildMapHtml(lat: number, lng: number): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #d9e8ef; }
    .leaflet-control-attribution { font-size: 9px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    (function () {
      var map = L.map('map', {
        center: [${lat}, ${lng}],
        zoom: 15,
        zoomControl: false,
        attributionControl: true
      });
      L.tileLayer('${OSM_TILE_URL}', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      var skipPan = false;
      var userPanning = false;

      map.on('movestart', function () {
        if (!skipPan) userPanning = true;
      });
      map.on('moveend', function () {
        if (skipPan) {
          skipPan = false;
          userPanning = false;
          return;
        }
        userPanning = false;
        var center = map.getCenter();
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'moveend',
          latitude: center.lat,
          longitude: center.lng
        }));
      });

      function handleMessage(raw) {
        try {
          var data = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (!data || data.type !== 'setCenter') return;
          var c = map.getCenter();
          if (Math.abs(c.lat - data.latitude) < 0.00001 && Math.abs(c.lng - data.longitude) < 0.00001) {
            return;
          }
          if (userPanning) return;
          skipPan = true;
          map.setView([data.latitude, data.longitude], map.getZoom(), { animate: true });
        } catch (e) {}
      }

      document.addEventListener('message', function (e) { handleMessage(e.data); });
      window.addEventListener('message', function (e) { handleMessage(e.data); });
    })();
  </script>
</body>
</html>`;
}

export function VendorLocationMap({ coordinate, onCoordinateChange, style }: VendorLocationMapProps) {
  const webRef = useRef<WebView>(null);
  const isUserDragging = useRef(false);
  const lastSynced = useRef({ lat: coordinate.latitude, lng: coordinate.longitude });
  const initialCoord = useRef(coordinate);

  const html = useMemo(
    () => buildMapHtml(initialCoord.current.latitude, initialCoord.current.longitude),
    [],
  );

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as {
          type?: string;
          latitude?: number;
          longitude?: number;
        };
        if (data.type !== 'moveend' || data.latitude == null || data.longitude == null) return;
        isUserDragging.current = false;
        lastSynced.current = { lat: data.latitude, lng: data.longitude };
        onCoordinateChange({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      } catch {
        // ignore malformed messages
      }
    },
    [onCoordinateChange],
  );

  useEffect(() => {
    if (isUserDragging.current) return;
    if (
      Math.abs(lastSynced.current.lat - coordinate.latitude) < 0.00001 &&
      Math.abs(lastSynced.current.lng - coordinate.longitude) < 0.00001
    ) {
      return;
    }
    lastSynced.current = { lat: coordinate.latitude, lng: coordinate.longitude };
    webRef.current?.postMessage(
      JSON.stringify({
        type: 'setCenter',
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }),
    );
  }, [coordinate.latitude, coordinate.longitude]);

  return (
    <View style={[styles.wrap, style]}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html }}
        style={StyleSheet.absoluteFill}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        overScrollMode="never"
        setSupportMultipleWindows={false}
        mixedContentMode="compatibility"
        androidLayerType="hardware"
      />
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
