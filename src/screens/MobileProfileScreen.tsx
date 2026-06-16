import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { logout } from '@/src/api/auth.service';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import { MobileBottomTabBar } from '@/src/components/navigation/MobileBottomTabBar';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
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

const PROFILE_MENU_ITEMS = [
  { id: 'account', label: 'Account settings', icon: 'settings-outline' as const },
  { id: 'bookings', label: 'Past Bookings', icon: 'calendar-outline' as const },
  { id: 'vendor', label: 'Become a vendor', icon: 'id-card-outline' as const },
  { id: 'support', label: 'Support', icon: 'help-circle-outline' as const },
  { id: 'logout', label: 'Log out', icon: 'log-out-outline' as const },
] as const;

type MobileProfileScreenProps = {
  onBack: () => void;
};

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

function MenuDivider() {
  const { s } = useHomeScale();
  return (
    <View style={[styles.dividerRow, { paddingHorizontal: s(16) }]}>
      <View style={[styles.dividerOrange, { width: s(40), height: 1 }]} />
      <View style={[styles.dividerGray, { flex: 1, height: 1, marginLeft: s(12) }]} />
    </View>
  );
}

export function MobileProfileScreen({ onBack }: MobileProfileScreenProps) {
  const { s } = useHomeScale();
  const contentPadding = s(16);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, error } = useUserProfile();
  const isUnauthorized = Boolean(error?.isUnauthorized);
  const showProfileMenu = Boolean(user) && !isUnauthorized;
  const visibleProfileMenuItems = PROFILE_MENU_ITEMS.filter((item) => {
    if (showProfileMenu) return true;
    return item.id === 'vendor' || item.id === 'support';
  });

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
      router.replace('/(tabs)/three');
    }
    if (id === 'vendor') {
      router.push('/become-vendor');
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

  const openLogin = () => {
    router.push('/login');
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
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: contentPadding, paddingTop: s(8), gap: s(12) }]}>
          <View style={[styles.headerRow, { gap: s(12) }]}>
            <Pressable
              style={[styles.backBtn, { width: s(40), height: s(40), borderRadius: s(20) }]}
              onPress={onBack}
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={s(22)} color={colors.surface.white} />
            </Pressable>
            <Text style={[styles.headerTitle, { fontSize: s(24), lineHeight: s(32) }]}>Profile</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{
            paddingHorizontal: contentPadding,
            paddingTop: s(8),
            paddingBottom: s(120),
            gap: s(20),
          }}
          showsVerticalScrollIndicator={false}
        >
          {error && !isUnauthorized ? (
            <Text style={[styles.errorText, { fontSize: s(12) }]}>{getErrorMessage(error)}</Text>
          ) : null}

          <View style={[styles.profileCard, { borderRadius: s(16), padding: s(16), gap: s(16) }]}>
            {isUnauthorized || !user ? (
              <View style={{ flex: 1, gap: s(8) }}>
                <Text style={[styles.profileName, { fontSize: s(18) }]}>Account</Text>
                <Text style={[styles.profileMeta, { fontSize: s(12) }]}>
                  Log in to see your profile details and bookings.
                </Text>
                <Pressable
                  style={[styles.loginCta, { height: s(36), borderRadius: s(10), paddingHorizontal: s(16), marginTop: s(8) }]}
                  onPress={openLogin}
                >
                  <Text style={[styles.loginCtaText, { fontSize: s(14) }]}>Login or sign up</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={[styles.avatarWrap, { width: s(72), height: s(72), borderRadius: s(36) }]}>
                  <Image
                    source={require('@/assets/images/profile-avatar.png')}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.profileDetails}>
                  <Text style={[styles.profileName, { fontSize: s(18), lineHeight: s(24) }]}>
                    {user.full_name || user.name || 'Guest'}
                  </Text>
                  <Text style={[styles.profileMeta, { fontSize: s(12), lineHeight: s(18) }]}>
                    {user.phone || 'Phone not available'}
                  </Text>
                  <Text style={[styles.profileMeta, { fontSize: s(12), lineHeight: s(18) }]}>
                    {user.email || 'Email not available'}
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={[styles.menuCard, { borderRadius: s(16) }]}>
            {visibleProfileMenuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <Pressable
                  style={[styles.menuRow, { paddingVertical: s(16), paddingHorizontal: s(16), gap: s(12) }]}
                  onPress={() => handleMenuItem(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <View
                    style={[
                      styles.iconBox,
                      { width: s(40), height: s(40), borderRadius: s(10) },
                      item.id === 'logout' && styles.iconBoxLogout,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={s(20)}
                      color={item.id === 'logout' ? colors.accent.main : colors.text.secondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.menuLabel,
                      { fontSize: s(14) },
                      item.id === 'logout' && styles.menuLabelLogout,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
                {index < visibleProfileMenuItems.length - 1 ? <MenuDivider /> : null}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {logoutModalVisible ? (
        <View style={styles.modalRoot} pointerEvents="box-none">
          <LogoutBackdrop onPress={() => setLogoutModalVisible(false)} />

          <View
            style={[
              styles.logoutSheet,
              {
                marginHorizontal: s(16),
                borderRadius: s(20),
                padding: s(24),
                gap: s(16),
                marginBottom: s(100),
              },
            ]}
          >
            <Text style={[styles.logoutTitle, { fontSize: s(18), lineHeight: s(24) }]}>Log out</Text>

            <View style={[styles.logoutIconWrap, { width: s(48), height: s(48), borderRadius: s(24) }]}>
              <Ionicons name="log-out-outline" size={s(28)} color={colors.accent.main} />
            </View>

            <Text style={[styles.logoutMessage, { fontSize: s(14), lineHeight: s(20) }]}>
              Are you sure you want to logout now?
            </Text>

            <View style={[styles.logoutButtons, { gap: s(12) }]}>
              <Pressable
                style={[styles.cancelBtn, { height: s(44), borderRadius: s(12) }]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={[styles.cancelBtnText, { fontSize: s(14) }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, { height: s(44), borderRadius: s(12), gap: s(8) }]}
                onPress={handleLogoutConfirm}
              >
                <Ionicons name="log-out-outline" size={s(16)} color={colors.surface.white} />
                <Text style={[styles.confirmBtnText, { fontSize: s(14) }]}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}

      <View style={styles.tabBarLayer} pointerEvents="box-none">
        <MobileBottomTabBar activeTab="four" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  header: {
    backgroundColor: colors.surface.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  scroll: {
    flex: 1,
  },
  errorText: {
    fontFamily: typography.fontFamily.text,
    color: colors.primaryAlt,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
  },
  avatarWrap: {
    overflow: 'hidden',
    backgroundColor: colors.gray['2'],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileDetails: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  profileMeta: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.caption,
  },
  loginCta: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  loginCtaText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  menuCard: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
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
  },
  dividerOrange: {
    backgroundColor: colors.accent.main,
  },
  dividerGray: {
    backgroundColor: 'rgba(28, 32, 36, 0.15)',
  },
  tabBarLayer: {
    zIndex: 20,
  },
  modalRoot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 10,
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
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  logoutTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  logoutIconWrap: {
    backgroundColor: 'rgba(229, 77, 46, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutMessage: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  logoutButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent.main,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  confirmBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
});
