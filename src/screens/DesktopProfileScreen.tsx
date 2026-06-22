import HeartIcon from '@/assets/images/heart.svg';
import BellBadgeIcon from '@/assets/images/bell-badge.svg';
import HeartFilledIcon from '@/assets/images/heart-filled.svg';
import LogoutIcon from '@/assets/images/logout.svg';
import TicketConfirmationIcon from '@/assets/images/ticket-confirmation.svg';
import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { logout } from '@/src/api/auth.service';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { DesktopNavFrame } from '@/src/components/desktop/DesktopNavFrame';
import { DesktopSiteFooter } from '@/src/components/desktop/DesktopSiteFooter';
import { DesktopWebNav } from '@/src/components/desktop/DesktopWebNav';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { desktopContentShellStyle } from '@/src/constants/desktopLayoutConstants';
import { DESKTOP_VENDOR_LANDING } from '@/src/constants/desktopWebConstants';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PROFILE_MENU_ITEMS = [
  { id: 'account', label: 'Account settings', icon: 'settings-outline' as const },
  { id: 'bookings', label: 'Past Bookings', icon: 'calendar-outline' as const },
  { id: 'vendor', label: 'Become a vendor', icon: 'id-card-outline' as const },
  { id: 'support', label: 'Support', icon: 'help-circle-outline' as const },
  { id: 'logout', label: 'Log out', icon: 'log-out-outline' as const },
] as const;

function MenuDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerOrange} />
      <View style={styles.dividerGray} />
    </View>
  );
}

export function DesktopProfileScreen() {
  const queryClient = useQueryClient();
  const { activeCategoryTab, setActiveCategoryTab, exitSearchMode } = useHomeSearch();
  const { data: user, isLoading, error, refetch } = useUserProfile();

  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [webAuthModal, setWebAuthModal] = useState<{
    visible: boolean;
    mode: 'login' | 'signup';
  }>({ visible: false, mode: 'login' });

  const isUnauthorized = Boolean(error?.isUnauthorized);
  const isLoggedIn = Boolean(user) && !isUnauthorized;
  const showProfileMenu = isLoggedIn;
  const visibleMenuItems = PROFILE_MENU_ITEMS.filter((item) => {
    if (showProfileMenu) return true;
    return item.id === 'vendor' || item.id === 'support';
  });

  const handleTabChange = (tab: HomeCategoryTab) => {
    setActiveCategoryTab(tab);
    exitSearchMode();
    router.replace('/(tabs)');
  };

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

  const handleMenuItem = (id: string) => {
    if (id === 'logout') {
      setLogoutModalVisible(true);
      return;
    }
    if (id === 'account') {
      router.push('/account-settings');
      return;
    }
    if (id === 'bookings') {
      router.push('/(tabs)/three');
      return;
    }
    if (id === 'vendor') {
      router.push('/become-vendor');
      return;
    }
  };

  const handleLogoutConfirm = async () => {
    setLogoutModalVisible(false);
    try {
      await logout();
    } finally {
      queryClient.removeQueries({ queryKey: USER_PROFILE_QUERY_KEY });
      queryClient.clear();
      router.replace('/(tabs)');
    }
  };

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
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
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

      <Modal visible={logoutModalVisible} transparent animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
        <Pressable style={styles.logoutOverlay} onPress={() => setLogoutModalVisible(false)}>
          <Pressable style={styles.logoutCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.logoutTitle}>Log out</Text>
            <View style={styles.logoutIconWrap}>
              <Ionicons name="log-out-outline" size={28} color={colors.accent.main} />
            </View>
            <Text style={styles.logoutMessage}>Are you sure you want to logout now?</Text>
            <View style={styles.logoutButtons}>
              <Pressable style={styles.logoutCancelBtn} onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.logoutConfirmBtn} onPress={() => void handleLogoutConfirm()}>
                <Ionicons name="log-out-outline" size={16} color={colors.surface.white} />
                <Text style={styles.logoutConfirmText}>Logout</Text>
              </Pressable>
            </View>
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

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator>
        <View style={styles.contentShell}>
          <DesktopNavFrame>
            <DesktopWebNav
              embedded
              activeTab={activeCategoryTab}
              onTabChange={handleTabChange}
              isLoggedIn={isLoggedIn}
              onMenuPress={() => setWebMenuOpen(true)}
              onProfilePress={() => {}}
              onLoginPress={() => setWebAuthModal({ visible: true, mode: 'login' })}
            />
          </DesktopNavFrame>

          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Profile</Text>
            <Pressable
              style={styles.wishlistBtn}
              onPress={() => router.push('/(tabs)/two')}
              accessibilityLabel="Wishlist"
            >
              <HeartIcon width={20} height={20} />
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.loadingBlock}>
              <ActivityIndicator size="large" color={colors.accent.main} />
            </View>
          ) : (
            <>
              {error && !isUnauthorized ? (
                <View style={styles.errorBlock}>
                  <Text style={styles.errorText}>{getErrorMessage(error)}</Text>
                  <Pressable style={styles.retryBtn} onPress={() => refetch()}>
                    <Text style={styles.retryText}>Try again</Text>
                  </Pressable>
                </View>
              ) : null}

              <View style={styles.profileCard}>
                {isUnauthorized || !user ? (
                  <View style={styles.guestBlock}>
                    <Text style={styles.profileName}>Account</Text>
                    <Text style={styles.profileMeta}>Log in to see your profile details and bookings.</Text>
                    <Pressable
                      style={styles.loginCta}
                      onPress={() => setWebAuthModal({ visible: true, mode: 'login' })}
                    >
                      <Text style={styles.loginCtaText}>Login or sign up</Text>
                    </Pressable>
                  </View>
                ) : (
                  <>
                    <View style={styles.avatarWrap}>
                      <Image
                        source={require('@/assets/images/profile-avatar.png')}
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.profileDetails}>
                      <Text style={styles.profileName}>{user.full_name || user.name || 'Guest'}</Text>
                      <Text style={styles.profileMeta}>{user.phone || 'Phone not available'}</Text>
                      <Text style={styles.profileMeta}>{user.email || 'Email not available'}</Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.menuCard}>
                {visibleMenuItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <Pressable
                      style={styles.menuRow}
                      onPress={() => handleMenuItem(item.id)}
                      accessibilityRole="button"
                      accessibilityLabel={item.label}
                    >
                      <View style={[styles.iconBox, item.id === 'logout' && styles.iconBoxLogout]}>
                        <Ionicons
                          name={item.icon}
                          size={20}
                          color={item.id === 'logout' ? colors.accent.main : colors.text.secondary}
                        />
                      </View>
                      <Text style={[styles.menuLabel, item.id === 'logout' && styles.menuLabelLogout]}>
                        {item.label}
                      </Text>
                    </Pressable>
                    {index < visibleMenuItems.length - 1 ? <MenuDivider /> : null}
                  </React.Fragment>
                ))}
              </View>

              <Text style={styles.introText}>{DESKTOP_VENDOR_LANDING.discoverBody}</Text>
            </>
          )}
        </View>

        <DesktopSiteFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  contentShell: {
    ...desktopContentShellStyle,
    paddingTop: 24,
    gap: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 24,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  wishlistBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  loadingBlock: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  errorBlock: {
    gap: 12,
    alignItems: 'flex-start',
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.primaryAlt,
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.accent.main,
  },
  retryText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    backgroundColor: colors.surface.white,
  },
  guestBlock: {
    flex: 1,
    gap: 8,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
    flexShrink: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  profileMeta: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.caption,
  },
  loginCta: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.accent.main,
  },
  loginCtaText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    backgroundColor: colors.surface.white,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxLogout: {
    backgroundColor: 'rgba(229, 77, 46, 0.1)',
  },
  menuLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  menuLabelLogout: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.semibold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dividerOrange: {
    width: 40,
    height: 1,
    backgroundColor: colors.accent.main,
  },
  dividerGray: {
    flex: 1,
    height: 1,
    marginLeft: 12,
    backgroundColor: 'rgba(28, 32, 36, 0.15)',
  },
  introText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(28, 32, 36, 0.7)',
    textAlign: 'center',
    paddingVertical: 8,
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
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.08)',
    ...Platform.select({
      web: { boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
      },
    }),
  },
  menuPanelDivider: {
    height: 1,
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
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  menuPanelLabelAccent: {
    color: colors.accent.main,
    fontWeight: typography.fontWeight.semibold,
  },
  logoutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' } as Record<string, string>)
      : {}),
  },
  logoutCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    ...Platform.select({
      web: { boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
      },
    }),
  },
  logoutTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  logoutIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(229, 77, 46, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutMessage: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  logoutButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  logoutCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCancelText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  logoutConfirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.accent.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutConfirmText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
