import { Text } from '@/components/ui';
import { borderRadius, colors, spacing, typography } from '@/constants/DesignTokens';
import { VendorWorkspaceHeader } from '@/src/components/vendor/workspace/VendorWorkspaceHeader';
import {
  VENDOR_WORKSPACE_COPY,
  VENDOR_WORKSPACE_PROFILE,
  VENDOR_WORKSPACE_PROFILE_MENU,
} from '@/src/constants/vendorWorkspaceConstants';
import { useVendorListingCategory } from '@/src/hooks/useVendorListingCategory';
import { clearVendorSession } from '@/src/utils/vendorSession';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DESIGN_WIDTH = 402;

export function MobileVendorProfileScreen() {
  const categoryId = useVendorListingCategory();

  const handleLogout = async () => {
    await clearVendorSession();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.page}>
        <VendorWorkspaceHeader categoryId={categoryId} showSearch={false} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <Image source={VENDOR_WORKSPACE_PROFILE.avatar} style={styles.avatar} resizeMode="cover" />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{VENDOR_WORKSPACE_PROFILE.name}</Text>
              <Text style={styles.email}>{VENDOR_WORKSPACE_PROFILE.email}</Text>
              <Pressable>
                <Text style={styles.editLink}>{VENDOR_WORKSPACE_COPY.editProfile}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.menu}>
            {VENDOR_WORKSPACE_PROFILE_MENU.map((item) => (
              <Pressable
                key={item.id}
                style={styles.menuItem}
                onPress={() => {
                  if ('route' in item && item.route) router.push(item.route);
                }}
              >
                <Ionicons name={item.icon} size={18} color={colors.text.primary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color="rgba(28, 32, 36, 0.35)" />
              </Pressable>
            ))}
            <Pressable style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              <Text style={[styles.menuLabel, styles.logoutLabel]}>{VENDOR_WORKSPACE_COPY.logout}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.white },
  page: { flex: 1, width: '100%', maxWidth: DESIGN_WIDTH, alignSelf: 'center' },
  scrollContent: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    gap: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: spacing['2'],
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(28, 32, 36, 0.08)',
  },
  profileInfo: { flex: 1, gap: 4 },
  name: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['3'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  email: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: 'rgba(28, 32, 36, 0.55)',
  },
  editLink: {
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    fontWeight: typography.fontWeight.semibold,
    color: '#2563EB',
    marginTop: 4,
  },
  menu: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.08)',
    backgroundColor: colors.surface.white,
  },
  menuLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: typography.fontSize['1'],
    color: colors.text.primary,
  },
  logoutLabel: { color: '#DC2626' },
});
