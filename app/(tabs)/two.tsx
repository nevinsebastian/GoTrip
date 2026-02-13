import { Button, Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, shadows, spacing } from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BellIcon from '@/assets/images/bell.svg';

export default function WishlistScreen() {
  const { width, isMobile, isTablet } = useResponsive();

  const contentPadding = isMobile ? spacing['4'] : isTablet ? spacing['5'] : spacing['6'];
  const bellIconSize = isMobile ? 24 : isTablet ? 26 : 28;
  const cardMaxWidth = Math.min(400, width * 0.9);
  const cardPadding = isMobile ? spacing['5'] : spacing['6'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[colors.surface.lightPink, colors.surface.background]}
        style={styles.gradient}
      >
        <View style={[styles.header, { paddingHorizontal: contentPadding }]}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={12}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text variant="sectionTitle" style={styles.headerTitle} color="primaryBrand">
              Your wishlist
            </Text>
          </View>
          <Pressable style={styles.bellWrap} onPress={() => {}}>
            <BellIcon width={bellIconSize} height={bellIconSize} />
          </Pressable>
        </View>

        <View style={[styles.content, { paddingHorizontal: contentPadding }]}>
          <View style={[styles.card, { maxWidth: cardMaxWidth, padding: cardPadding }]}>
            <Text variant="heading2" style={styles.cardTitle}>
              Added nothing
            </Text>
            <Text variant="body" style={styles.cardDescription}>
              Explore Rooms, Trip packages, Glamping, and other activities.
            </Text>
            <Button
              variant="primary"
              size="default"
              onPress={() => router.push('/(tabs)')}
              style={styles.exploreButton}
            >
              Explore now
            </Button>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.lightPink,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing['2'],
    paddingBottom: spacing['4'],
    minHeight: 56,
  },
  backButton: {
    padding: spacing['2'],
    marginLeft: -spacing['2'],
  },
  headerTitleWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
  },
  headerTitle: {},
  bellWrap: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['6'],
  },
  card: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    width: '100%',
    ...Platform.select({
      ios: shadows.card,
      android: shadows.card,
      web: shadows.card,
    }),
  },
  cardTitle: {
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing['2'],
  },
  cardDescription: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['6'],
    paddingHorizontal: spacing['2'],
  },
  exploreButton: {
    width: '100%',
    minWidth: 160,
  },
});
