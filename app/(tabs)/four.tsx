import { Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
} from '@/constants/DesignTokens';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePreviousTab } from './_layout';



const PROFILE_MENU_ITEMS = [
  { id: 'account', label: 'Account settings', icon: 'settings-outline' as const },
  { id: 'bookings', label: 'Past Bookings', icon: 'calendar-outline' as const },
  { id: 'vendor', label: 'Become a vendor', icon: 'id-card-outline' as const },
  { id: 'support', label: 'Support', icon: 'help-circle-outline' as const },
  { id: 'logout', label: 'Log out', icon: 'log-out-outline' as const },
] as const;

const ICON_BOX_SIZE = 40;

export default function ProfileScreen() {
  const { previousTab } = usePreviousTab();
  const { isMobile, isTablet } = useResponsive();
  const contentPadding = isMobile ? spacing['4'] : isTablet ? spacing['5'] : spacing['6'];
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleBack = () => {
    if (previousTab === 'index') {
      router.replace('/(tabs)');
    } else {
      router.replace(`/(tabs)/${previousTab}` as '/(tabs)/two');
    }
  };

  const handleWishlist = () => {
    router.replace('/(tabs)/two');
  };

  const handleMenuItem = (id: string) => {
    if (id === 'logout') {
      setLogoutModalVisible(true);
      return;
    }
    // TODO: navigate to respective screens
  };

  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false);
    // TODO: clear auth state / token if you have auth
    router.replace('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header: Back home (left) + Heart in box (right) */}
      <View style={[styles.header, { paddingHorizontal: contentPadding }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backWrap}
          hitSlop={12}
          accessibilityLabel="Back home"
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
          <Text variant="header" color="primaryBrand" style={styles.backLabel}>
            Back home
          </Text>
        </Pressable>
        <Pressable
          onPress={handleWishlist}
          accessibilityLabel="Wishlist"
        >
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* User info card: avatar (left) + name, phone, email (right) */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={require('@/assets/images/resort.jpg')}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.profileDetails}>
            <Text variant="heading2" style={styles.profileName}>
              Asif Ansad
            </Text>
            <Text variant="caption" style={styles.profileMeta}>
              9734324310
            </Text>
            <Text variant="caption" style={styles.profileMeta}>
              asifansad123@gmal.com
            </Text>
          </View>
        </View>

        {/* Menu list: icon in rounded grey box + label; Log out in red */}
        <View style={styles.menuCard}>
          {PROFILE_MENU_ITEMS.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && <View style={styles.menuDivider} />}
              <Pressable
                style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
                onPress={() => handleMenuItem(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <View
                  style={[
                    styles.iconBox,
                    item.id === 'logout' && styles.iconBoxLogout,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.id === 'logout' ? colors.primary : colors.text.secondary}
                  />
                </View>
                <Text
                  variant="body"
                  style={[
                    styles.menuLabel,
                    item.id === 'logout' && styles.menuLabelLogout,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>

      {/* Log Out confirmation modal with dimmed/blurred overlay */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleLogoutCancel}
      >
        <Pressable style={styles.modalOverlay} onPress={handleLogoutCancel}>
          <Pressable style={styles.modalDialogWrap} onPress={(e) => e.stopPropagation()}>
            <View style={styles.logoutDialog}>
              <View style={styles.logoutIconWrap}>
                <Ionicons name="log-out-outline" size={32} color={colors.primary} />
              </View>
              <Text variant="heading2" style={styles.logoutDialogTitle}>
                Log Out
              </Text>
              <Text variant="body" style={styles.logoutDialogMessage}>
                Do you actually want to logout now?
              </Text>
              <View style={styles.logoutDialogButtons}>
                <Pressable
                  style={({ pressed }) => [
                    styles.logoutCancelBtn,
                    pressed && styles.logoutBtnPressed,
                  ]}
                  onPress={handleLogoutCancel}
                >
                  <Text variant="bodySemibold" style={styles.logoutCancelBtnText}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.logoutConfirmBtn,
                    pressed && styles.logoutBtnPressed,
                  ]}
                  onPress={handleLogoutConfirm}
                >
                  <Text variant="bodySemibold" style={styles.logoutConfirmBtnText}>
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingVertical: spacing['2'],
  },
  backWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
  },
  backLabel: {
    marginLeft: 2,
  },
  heartWrap: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing['4'],
    paddingBottom: spacing['8'],
    gap: spacing['5'],
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing['4'],
    gap: spacing['4'],
    borderWidth: 1,
    borderColor: colors.border.light,
    ...Platform.select({
      ios: shadows.card,
      android: shadows.card,
      web: shadows.card,
    }),
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
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
    color: colors.text.primary,
  },
  profileMeta: {
    color: colors.text.caption,
  },
  menuCard: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
    ...Platform.select({
      ios: shadows.card,
      android: shadows.card,
      web: shadows.card,
    }),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['4'],
    gap: spacing['3'],
  },
  menuRowPressed: {
    opacity: 0.7,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginLeft: spacing['4'] + ICON_BOX_SIZE + spacing['3'],
  },
  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray['2'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxLogout: {
    backgroundColor: colors.surface.lightPink,
  },
  menuLabel: {
    flex: 1,
    color: colors.text.primary,
  },
  menuLabelLogout: {
    color: colors.primary,
    fontWeight: '600',
  },
  // Log out modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['5'],
  },
  modalDialogWrap: {
    width: '100%',
    maxWidth: 340,
  },
  logoutDialog: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    paddingVertical: spacing['6'],
    paddingHorizontal: spacing['5'],
    alignItems: 'center',
    ...Platform.select({
      ios: shadows.card,
      android: shadows.card,
      web: shadows.card,
    }),
  },
  logoutIconWrap: {
    marginBottom: spacing['4'],
  },
  logoutDialogTitle: {
    color: colors.text.primary,
    marginBottom: spacing['2'],
  },
  logoutDialogMessage: {
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['5'],
  },
  logoutDialogButtons: {
    flexDirection: 'row',
    gap: spacing['3'],
    width: '100%',
  },
  logoutCancelBtn: {
    flex: 1,
    paddingVertical: spacing['3'],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface.white,
    alignItems: 'center',
  },
  logoutCancelBtnText: {
    color: colors.primary,
  },
  logoutConfirmBtn: {
    flex: 1,
    paddingVertical: spacing['3'],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  logoutConfirmBtnText: {
    color: colors.surface.white,
  },
  logoutBtnPressed: {
    opacity: 0.8,
  },
});
