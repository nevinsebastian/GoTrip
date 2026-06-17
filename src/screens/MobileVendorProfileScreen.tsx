import { Text } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorDashboardTopBar } from '@/src/components/vendor/dashboard/VendorDashboardTopBar';
import {
  useVendorTabBarInset,
  VendorWorkspaceFloatingTabBar,
} from '@/src/components/vendor/workspace/VendorWorkspaceTabBar';
import { VENDOR_DASHBOARD_CARD_BORDER } from '@/src/constants/vendorDashboardConstants';
import {
  VENDOR_PROFILE_COPY,
  VENDOR_PROFILE_MENU,
  VENDOR_WORKSPACE_PROFILE,
} from '@/src/constants/vendorWorkspaceConstants';
import { clearVendorSession } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;
const LOGOUT_RED = '#DC2626';
const PAGE_BG = '#F5F6F8';
const ICON_BOX_BG = 'rgba(28, 32, 36, 0.06)';
const LOGOUT_ICON_BG = 'rgba(220, 38, 38, 0.1)';

function ProfileMenuDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerAccent} />
      <View style={styles.dividerLine} />
    </View>
  );
}

function LogoutBackdrop({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onPress}>
      <View style={styles.backdropDim} />
      <View
        style={[
          styles.backdropFrost,
          Platform.OS === 'web'
            ? ({
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              } as object)
            : null,
        ]}
      />
    </Pressable>
  );
}

export function MobileVendorProfileScreen() {
  const tabInset = useVendorTabBarInset();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleMenuItem = (id: string) => {
    if (id === 'logout') {
      setLogoutModalVisible(true);
      return;
    }
    if (id === 'account') {
      router.push('/account-settings');
      return;
    }
    const item = VENDOR_PROFILE_MENU.find((m) => m.id === id);
    if (item && 'route' in item && item.route) {
      router.push(item.route);
    }
  };

  const handleLogoutConfirm = async () => {
    setLogoutModalVisible(false);
    await clearVendorSession();
    router.replace('/');
  };

  useEffect(() => {
    if (!logoutModalVisible) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setLogoutModalVisible(false);
      return true;
    });
    return () => subscription.remove();
  }, [logoutModalVisible]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorDashboardTopBar bordered />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabInset }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.screenHeader}>
            <Pressable style={styles.backCircle} onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="chevron-back" size={18} color={colors.surface.white} />
            </Pressable>
            <Text style={styles.screenTitle}>{VENDOR_PROFILE_COPY.title}</Text>
          </View>

          <View style={styles.profileCard}>
            <Image source={VENDOR_WORKSPACE_PROFILE.avatar} style={styles.avatar} resizeMode="cover" />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{VENDOR_WORKSPACE_PROFILE.name}</Text>
              <Text style={styles.profileMeta}>{VENDOR_WORKSPACE_PROFILE.phone}</Text>
              <Text style={styles.profileMeta}>{VENDOR_WORKSPACE_PROFILE.email}</Text>
            </View>
          </View>

          <View style={styles.menuCard}>
            {VENDOR_PROFILE_MENU.map((item, index) => {
              const isLogout = item.id === 'logout';
              return (
                <React.Fragment key={item.id}>
                  <Pressable
                    style={styles.menuRow}
                    onPress={() => handleMenuItem(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                  >
                    <View style={[styles.iconBox, isLogout && styles.iconBoxLogout]}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={isLogout ? LOGOUT_RED : colors.text.primary}
                      />
                    </View>
                    <Text style={[styles.menuLabel, isLogout && styles.menuLabelLogout]}>
                      {item.label}
                    </Text>
                  </Pressable>
                  {index < VENDOR_PROFILE_MENU.length - 1 ? <ProfileMenuDivider /> : null}
                </React.Fragment>
              );
            })}
          </View>
        </ScrollView>

        {logoutModalVisible ? (
          <View style={styles.modalRoot} pointerEvents="box-none">
            <LogoutBackdrop onPress={() => setLogoutModalVisible(false)} />
            <View style={[styles.logoutSheet, { marginBottom: tabInset + 16 }]}>
              <Text style={styles.logoutTitle}>{VENDOR_PROFILE_COPY.logoutTitle}</Text>
              <View style={styles.logoutIconWrap}>
                <Ionicons name="log-out-outline" size={28} color={LOGOUT_RED} />
              </View>
              <Text style={styles.logoutMessage}>{VENDOR_PROFILE_COPY.logoutMessage}</Text>
              <View style={styles.logoutButtons}>
                <Pressable style={styles.logoutCancelBtn} onPress={() => setLogoutModalVisible(false)}>
                  <Text style={styles.logoutCancelText}>{VENDOR_PROFILE_COPY.logoutCancel}</Text>
                </Pressable>
                <Pressable style={styles.logoutConfirmBtn} onPress={handleLogoutConfirm}>
                  <Ionicons name="log-out-outline" size={16} color={colors.surface.white} />
                  <Text style={styles.logoutConfirmText}>{VENDOR_PROFILE_COPY.logoutConfirm}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        <VendorWorkspaceFloatingTabBar activeTab="profile" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BG },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    gap: 16,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 4,
  },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 20,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: 16,
    padding: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8E8E8',
  },
  profileDetails: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  profileMeta: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    color: 'rgba(28, 32, 36, 0.55)',
    lineHeight: 18,
  },
  menuCard: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: ICON_BOX_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxLogout: {
    backgroundColor: LOGOUT_ICON_BG,
  },
  menuLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  menuLabelLogout: {
    color: LOGOUT_RED,
    fontWeight: typography.fontWeight.semibold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dividerAccent: {
    width: 40,
    height: 1,
    backgroundColor: '#E54D2E',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    marginLeft: 12,
    backgroundColor: 'rgba(28, 32, 36, 0.12)',
  },
  modalRoot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 30,
  },
  backdropDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  backdropFrost: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  logoutSheet: {
    marginHorizontal: spacing['4'],
    backgroundColor: colors.surface.white,
    borderRadius: 20,
    padding: 24,
    gap: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: { elevation: 8 },
    }),
  },
  logoutTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 18,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  logoutIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: LOGOUT_ICON_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutMessage: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: 'rgba(28, 32, 36, 0.65)',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButtons: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: 12,
  },
  logoutCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: VENDOR_DASHBOARD_CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.white,
  },
  logoutCancelText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  logoutConfirmBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: LOGOUT_RED,
  },
  logoutConfirmText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
