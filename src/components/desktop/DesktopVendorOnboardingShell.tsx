import BellBadgeIcon from '@/assets/images/bell-badge.svg';
import FilterIcon from '@/assets/images/wishlist-desktop-figma/filter-icon.svg';
import HeartFilledIcon from '@/assets/images/heart-filled.svg';
import LogoutIcon from '@/assets/images/logout.svg';
import TicketConfirmationIcon from '@/assets/images/ticket-confirmation.svg';
import HotelIcon from '@/assets/images/login-figma/hotel-icon.svg';
import SpeechBubbleIcon from '@/assets/images/login-figma/speech-bubble.svg';
import { Input, Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { logout } from '@/src/api/auth.service';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { desktopContentShellStyle, DESKTOP_VENDOR_LANDING_CARD } from '@/src/constants/desktopLayoutConstants';
import { DESKTOP_WEB_IMAGES } from '@/src/constants/desktopHomeConstants';
import {
  getVendorListingCategory,
  VENDOR_ONBOARDING,
  type VendorListingCategoryId,
} from '@/src/constants/vendorOnboardingConstants';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HeroLogoWhite = require('@/assets/images/login-figma/logo-hero-white.png');
const VendorHeroImage = require('@/assets/images/desktop-web/vendor-hero.jpg');

type DesktopVendorOnboardingShellProps = {
  heroPillLabel?: string;
  listingCategoryId?: VendorListingCategoryId;
  rightPanelBlur?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function DesktopVendorOnboardingShell({
  heroPillLabel = VENDOR_ONBOARDING.listPropertyCategory,
  listingCategoryId,
  rightPanelBlur = false,
  children,
  footer,
}: DesktopVendorOnboardingShellProps) {
  const queryClient = useQueryClient();
  const { data: user, error: profileError } = useUserProfile();
  const isUnauthorized = Boolean(profileError?.isUnauthorized);
  const isLoggedIn = Boolean(user) && !isUnauthorized;

  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [webAuthModal, setWebAuthModal] = useState<{ visible: boolean; mode: 'login' | 'signup' }>({
    visible: false,
    mode: 'login',
  });

  const category = listingCategoryId ? getVendorListingCategory(listingCategoryId) : null;

  const handleWebMenuLogout = async () => {
    setWebMenuOpen(false);
    try {
      await logout();
    } catch {
      // ignore
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
                {index > 0 ? <View style={styles.menuPanelDivider} /> : null}
                <Pressable
                  style={({ pressed }) => [styles.menuPanelRow, pressed && styles.menuPanelRowPressed]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuPanelIconBox}>{item.node}</View>
                  <Text style={[styles.menuPanelLabel, item.labelPrimary ? styles.menuPanelLabelAccent : null]}>
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

      <View style={styles.contentShell}>
        <View style={styles.header}>
          <Pressable onPress={() => router.replace('/(tabs)')} accessibilityLabel="Home">
            <Image source={DESKTOP_WEB_IMAGES.logo} style={styles.logoImg} resizeMode="contain" />
          </Pressable>

          <View style={styles.searchWrap}>
            <Input
              placeholder={VENDOR_ONBOARDING.searchPlaceholder}
              style={styles.searchInput}
              placeholderTextColor="rgba(28,32,36,0.5)"
              editable={false}
            />
            <View style={styles.searchIcon}>
              <Ionicons name="search" size={18} color={colors.accent.main} />
            </View>
          </View>

          <Pressable style={styles.filterBtn} accessibilityLabel="Filter">
            <FilterIcon width={22} height={22} />
          </Pressable>

          <Pressable
            style={styles.profileBtn}
            onPress={
              isLoggedIn
                ? () => router.push('/(tabs)/four')
                : () => setWebAuthModal({ visible: true, mode: 'login' })
            }
            accessibilityLabel={isLoggedIn ? 'Profile' : 'Login'}
          >
            <Ionicons name="person-outline" size={20} color={colors.surface.white} />
          </Pressable>

          <Pressable style={styles.menuBtn} onPress={() => setWebMenuOpen(true)} accessibilityLabel="Menu">
            <Ionicons name="menu" size={24} color={colors.accent.main} />
          </Pressable>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.heroPanel}>
            <Image source={VendorHeroImage} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroOverlay}>
              <Image
                source={HeroLogoWhite}
                style={[styles.heroLogo, Platform.OS === 'web' ? (styles.heroLogoWeb as object) : null]}
                resizeMode="contain"
              />

              <View style={styles.speechBubbleWrap}>
                <SpeechBubbleIcon width={300} height={40} style={StyleSheet.absoluteFillObject} />
                <View style={styles.speechBubbleRow}>
                  <Text style={styles.speechText}>
                    Join <Text style={styles.speechBold}>{VENDOR_ONBOARDING.listingsCount}</Text> other listings
                    already in GoTrip
                  </Text>
                </View>
              </View>

              <View style={styles.propertyPill}>
                {category ? (
                  <Image source={category.thumbnail} style={styles.categoryThumb} resizeMode="cover" />
                ) : (
                  <HotelIcon width={18} height={18} />
                )}
                <Text style={styles.propertyLead}>{VENDOR_ONBOARDING.listPropertyLead}</Text>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>{category?.pillLabel ?? heroPillLabel}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.rightPanel}>
            {rightPanelBlur ? <View style={styles.rightBlur} /> : null}
            <View style={styles.rightContent}>{children}</View>
            {footer ? <View style={styles.rightFooter}>{footer}</View> : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  contentShell: {
    ...desktopContentShellStyle,
    flex: 1,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImg: {
    width: 100,
    height: 44,
    flexShrink: 0,
  },
  searchWrap: {
    flex: 1,
    position: 'relative',
    minWidth: 0,
  },
  searchInput: {
    height: 44,
    borderRadius: 100,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.12)',
    paddingLeft: 16,
    paddingRight: 44,
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuBtn: {
    width: 32,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  mainCard: {
    position: 'relative',
    flexDirection: 'row',
    width: '100%',
    maxWidth: DESKTOP_VENDOR_LANDING_CARD.width,
    height: DESKTOP_VENDOR_LANDING_CARD.height,
    alignSelf: 'center',
    borderRadius: DESKTOP_VENDOR_LANDING_CARD.borderRadius,
    backgroundColor: DESKTOP_VENDOR_LANDING_CARD.backgroundColor,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },
  heroPanel: {
    width: '50%',
    height: '100%',
    position: 'relative',
    backgroundColor: colors.gray['2'],
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  heroLogo: {
    width: 120,
    height: 56,
    tintColor: colors.surface.white,
  },
  heroLogoWeb: {
    filter: 'brightness(0) invert(1)',
  },
  speechBubbleWrap: {
    width: 300,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubbleRow: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 11,
    lineHeight: 14,
    color: colors.surface.white,
    textAlign: 'center',
  },
  speechBold: {
    fontWeight: typography.fontWeight.bold,
  },
  propertyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface.white,
    borderRadius: 100,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 8,
    maxWidth: '100%',
    ...Platform.select({
      web: { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' },
      default: {},
    }),
  },
  categoryThumb: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  propertyLead: {
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    flexShrink: 1,
  },
  categoryPill: {
    backgroundColor: colors.accent.main,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexShrink: 0,
  },
  categoryPillText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  rightPanel: {
    flex: 1,
    height: '100%',
    position: 'relative',
    backgroundColor: colors.surface.white,
  },
  rightBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    zIndex: 1,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      } as object,
      default: {},
    }),
  },
  rightContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 16,
    zIndex: 2,
  },
  rightFooter: {
    paddingHorizontal: 40,
    paddingBottom: 32,
    zIndex: 2,
    gap: 12,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingRight: 32,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' } as Record<string, string>)
      : {}),
  },
  menuPanel: {
    width: 280,
    borderRadius: 16,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' },
      default: {},
    }),
  },
  menuPanelDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(28, 32, 36, 0.08)',
    marginHorizontal: 16,
  },
  menuPanelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuPanelRowPressed: {
    backgroundColor: 'rgba(28, 32, 36, 0.04)',
  },
  menuPanelIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuPanelLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  menuPanelLabelAccent: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.semibold,
  },
});
