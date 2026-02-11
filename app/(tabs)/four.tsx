import { Text } from '@/components/ui';
import { colors } from '@/constants/DesignTokens';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text variant="sectionTitle" style={styles.title}>
        Profile
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


