import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui';
import { colors } from '@/constants/DesignTokens';

export default function BookingsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="sectionTitle" style={styles.title}>
        Bookings
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray['2'],
  },
  title: {
    color: colors.text.primary,
  },
});
