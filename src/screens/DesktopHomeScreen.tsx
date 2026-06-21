import { Text } from '@/components/ui';
import { borderRadius, colors, spacing } from '@/constants/DesignTokens';
import { logout } from '@/src/api/auth.service';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { DesktopHomeHero } from '@/src/components/desktop/DesktopHomeHero';
import {
    DesktopAccentDivider,
    DesktopBudgetOptionsSection,
    DesktopDestinationsSection,
    DesktopMoodSection,
    DesktopSuggestedSection,
} from '@/src/components/desktop/DesktopHomeListingSections';
import { resolveDesktopListings } from '@/src/constants/desktopHomeConstants';
import { DesktopHomeVendorSection } from '@/src/components/desktop/DesktopHomeVendorSection';
import { DesktopPromoBanner } from '@/src/components/desktop/DesktopPromoBanner';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import { DesktopSearchResultsScreen } from '@/src/screens/DesktopSearchResultsScreen';
import { useListings } from '@/src/hooks/useListings';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BellBadgeIcon from '@/assets/images/bell-badge.svg';
import HeartFilledIcon from '@/assets/images/heart-filled.svg';
import LogoutIcon from '@/assets/images/logout.svg';
import TicketConfirmationIcon from '@/assets/images/ticket-confirmation.svg';

function DesktopHomeContent() {
  const queryClient = useQueryClient();
  const { data: user, error: profileError } = useUserProfile();
  const isUnauthorized = Boolean(profileError?.isUnauthorized);
  const isLoggedIn = Boolean(user) && !isUnauthorized;
  const { activeCategoryTab, setActiveCategoryTab, searchMode } = useHomeSearch();

  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [webAuthModal, setWebAuthModal] = useState<{
    visible: boolean;
    mode: 'login' | 'signup';
  }>({ visible: false, mode: 'login' });

  const { data: listingsRes } = useListings({ page: 1, limit: 20 });
  const { data: economicRes } = useListings({ max_price: 2499, page: 1, limit: 20 });
  const listings = listingsRes?.data ?? [];
  const suggested = resolveDesktopListings(listings.slice(0, 6), 3);
  const budget = resolveDesktopListings((economicRes?.data ?? listings).slice(0, 8), 8);

  const handleWebMenuLogout = async () => {
    setWebMenuOpen(false);
    try {
      await logout();
    } catch {
      // still clear local session
    } finally {
      queryClient.removeQueries({ queryKey: USER_PROFILE_QUERY_KEY });
      queryClient.clear();
      router.replace('/(tabs)');
    }
  };

  const webMenuItems = [
    {
      key: 'notifications',
      label: 'Notifications',
      node: <BellBadgeIcon width={22} height={22} />,
      onPress: () => setWebMenuOpen(false),
    },
    {
      key: 'wishlist',
      label: 'Wishlist',
      node: <HeartFilledIcon width={22} height={22} />,
      onPress: () => {
        setWebMenuOpen(false);
        router.push('/(tabs)/two');
      },
    },
    {
      key: 'tickets',
      label: 'Tickets',
      node: <TicketConfirmationIcon width={22} height={22} />,
      onPress: () => {
        setWebMenuOpen(false);
        router.push('/(tabs)/three');
      },
    },
    isLoggedIn
      ? {
          key: 'logout',
          label: 'Logout',
          node: <LogoutIcon width={22} height={22} />,
          onPress: () => void handleWebMenuLogout(),
          labelPrimary: true,
        }
      : {
          key: 'login',
          label: 'Login',
          node: <Ionicons name="log-in-outline" size={22} color={colors.primary} />,
          onPress: () => {
            setWebMenuOpen(false);
            setWebAuthModal({ visible: true, mode: 'login' });
          },
          labelPrimary: true,
        },
  ];

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <Modal visible={webMenuOpen} transparent animationType="none" onRequestClose={() => setWebMenuOpen(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setWebMenuOpen(false)}>
          <Pressable style={styles.menuPanel} onPress={(e) => e.stopPropagation()}>
            {webMenuItems.map((item, index) => (
              <React.Fragment key={item.key}>
                {index > 0 ? <View style={styles.menuDivider} /> : null}
                <Pressable
                  style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuIconBox}>{item.node}</View>
                  <Text
                    variant="body"
                    style={[styles.menuLabel, item.labelPrimary ? styles.menuLabelLogout : null]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </React.Fragment>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <AuthWebModal
        visible={webAuthModal.visible}
        mode={webAuthModal.mode}
        onClose={() => setWebAuthModal((s) => ({ ...s, visible: false }))}
        onSwitchMode={(m) => setWebAuthModal({ visible: true, mode: m })}
        onAuthenticated={() => queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })}
      />

      {searchMode ? (
        <DesktopSearchResultsScreen
          isLoggedIn={isLoggedIn}
          onMenuPress={() => setWebMenuOpen(true)}
          onProfilePress={() => router.push('/(tabs)/four')}
          onLoginPress={() => setWebAuthModal({ visible: true, mode: 'login' })}
        />
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator>
          <DesktopHomeHero
            activeTab={activeCategoryTab}
            onTabChange={setActiveCategoryTab}
            isLoggedIn={isLoggedIn}
            onMenuPress={() => setWebMenuOpen(true)}
            onProfilePress={() => router.push('/(tabs)/four')}
            onLoginPress={() => setWebAuthModal({ visible: true, mode: 'login' })}
          />

          <View style={styles.main}>
            <DesktopPromoBanner />
            <DesktopAccentDivider />
            <DesktopMoodSection activeTab={activeCategoryTab} />
          </View>

          <View style={styles.main}>
            <DesktopSuggestedSection listings={suggested} activeTab={activeCategoryTab} />
          </View>

          <DesktopDestinationsSection />

          <View style={styles.main}>
            <DesktopBudgetOptionsSection listings={budget} />
          </View>

          <DesktopHomeVendorSection />

          <DesktopSiteFooter />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

export function DesktopHomeScreen() {
  return <DesktopHomeContent />;
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: spacing['5'],
  },
  main: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingRight: 24,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' } as Record<string, string>)
      : {}),
  },
  menuPanel: {
    width: 280,
    borderRadius: borderRadius['3xl'],
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.08)',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0 12px 40px rgba(0,0,0,0.18)' } : {}),
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.light,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    gap: spacing['3'],
  },
  menuRowPressed: { backgroundColor: 'rgba(229,77,46,0.05)' },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 92, 55, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, color: colors.text.primary, fontSize: 16 },
  menuLabelLogout: { color: colors.primary, fontWeight: '600' },
});
