import { Text } from '@/components/ui';
import { useResponsive } from '@/components/ui/useResponsive';
import { borderRadius, colors, shadows, spacing } from '@/constants/DesignTokens';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import type { User } from '@/src/api/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_BG = colors.surface.background;
/** Placeholder until profile API supports address */
const PLACEHOLDER_ADDRESS = 'Technopark Phase 2, Kulathur, Trivandrum - 682582';

function maskPhone(raw: string | null | undefined): string {
  if (!raw?.trim()) return '—';
  const s = raw.trim();
  const digits = s.replace(/\D/g, '');
  if (digits.length < 6) return s;
  const tail = digits.slice(-3);
  const head = digits.slice(0, Math.min(3, digits.length - 3));
  const cc = s.startsWith('+') ? '+91 ' : '';
  return `${cc}${head}******${tail}`;
}

function maskEmail(email: string | undefined): string {
  if (!email?.includes('@')) return email ?? '—';
  const [local, domain] = email.split('@');
  const prefix = local.slice(0, Math.min(4, local.length));
  return `${prefix}******@${domain}`;
}

function displayName(user: User | undefined): string {
  if (!user) return '—';
  return user.full_name?.trim() || user.name?.trim() || '—';
}

function passwordDots(): string {
  return '•'.repeat(14);
}

export default function AccountSettingsScreen() {
  const { isMobile, isTablet } = useResponsive();
  const contentPadding = isMobile ? spacing['4'] : isTablet ? spacing['5'] : spacing['6'];

  const { data: user, isLoading, error } = useUserProfile();
  const isUnauthorized = Boolean(error?.isUnauthorized);

  const [personalOpen, setPersonalOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [generalNotif, setGeneralNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);

  useEffect(() => {
    if (!isLoading && (isUnauthorized || !user)) {
      router.back();
    }
  }, [isLoading, isUnauthorized, user]);

  const phoneDisplay = maskPhone(user?.phone ?? user?.phoneNumber ?? null);
  const emailDisplay = maskEmail(user?.email);

  const noopEdit = () => {};

  if (isLoading || (!user && !isUnauthorized)) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: SCREEN_BG }]} edges={['top']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: SCREEN_BG }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: contentPadding }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityLabel="Close"
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={26} color={colors.primary} />
        </Pressable>

        <Text variant="heading2" color="primaryBrand" style={styles.screenTitle}>
          Account Settings
        </Text>

        <AccordionCard
          icon="person-outline"
          title="Personal Information"
          expanded={personalOpen}
          onToggle={() => setPersonalOpen((o) => !o)}
          onEdit={noopEdit}
        >
          <InfoRow label="Full Name" value={displayName(user)} />
          <InfoRow label="Phone Number" value={phoneDisplay} />
          <InfoRow label="Email" value={emailDisplay} />
          <InfoRow label="Address" value={PLACEHOLDER_ADDRESS} isLast />
        </AccordionCard>

        <AccordionCard
          icon="shield-checkmark-outline"
          title="Login & Security"
          expanded={loginOpen}
          onToggle={() => setLoginOpen((o) => !o)}
          onEdit={noopEdit}
        >
          <InfoRow label="Phone Number" value={phoneDisplay} />
          <InfoRow label="Password" value={passwordDots()} isLast masked />
        </AccordionCard>

        <AccordionCard
          icon="notifications-outline"
          title="Notifications"
          expanded={notifOpen}
          onToggle={() => setNotifOpen((o) => !o)}
          onEdit={noopEdit}
        >
          <ToggleRow
            label="General Notifications"
            value={generalNotif}
            onValueChange={setGeneralNotif}
          />
          <ToggleRow
            label="Promotional Notifications"
            value={promoNotif}
            onValueChange={setPromoNotif}
            isLast
          />
        </AccordionCard>

        <View style={{ height: spacing['8'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AccordionCard({
  icon,
  title,
  expanded,
  onToggle,
  onEdit,
  children,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.sectionIconBox}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <Text variant="bodySemibold" color="secondary" style={styles.sectionTitleText} numberOfLines={1}>
          {title}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.editPill, pressed && styles.pressed]}
          onPress={onEdit}
          hitSlop={8}
          accessibilityLabel={`Edit ${title}`}
        >
          <Ionicons name="pencil-outline" size={16} color={colors.text.caption} />
          <Text variant="caption" color="caption" style={styles.editPillLabel}>
            Edit
          </Text>
        </Pressable>
        <Pressable
          onPress={onToggle}
          hitSlop={10}
          accessibilityLabel={expanded ? 'Collapse' : 'Expand'}
          style={styles.chevronHit}
        >
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color={colors.text.secondary}
          />
        </Pressable>
      </View>

      {expanded ? (
        <>
          <View style={styles.cardDivider} />
          <View style={styles.cardBody}>{children}</View>
        </>
      ) : null}
    </View>
  );
}

function InfoRow({
  label,
  value,
  isLast,
  masked,
}: {
  label: string;
  value: string;
  isLast?: boolean;
  masked?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <Text variant="caption" color="secondary" style={styles.infoLabel}>
        {label}
      </Text>
      <Text
        variant="body"
        color="primary"
        style={[styles.infoValue, masked && styles.infoValueMono]}
        numberOfLines={3}
      >
        {value}
      </Text>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
  isLast,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.toggleRow, !isLast && styles.infoRowBorder]}>
      <Text variant="caption" color="secondary" style={styles.toggleLabel}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border.light, true: colors.primary }}
        thumbColor={colors.surface.white}
        ios_backgroundColor={colors.border.light}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['6'],
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  closeBtn: {
    alignSelf: 'flex-start',
    paddingVertical: spacing['1'],
    marginBottom: spacing['2'],
  },
  screenTitle: {
    marginBottom: spacing['5'],
  },
  card: {
    backgroundColor: colors.surface.white,
    borderRadius: borderRadius['2xl'],
    marginBottom: spacing['4'],
    borderWidth: 1,
    borderColor: colors.border.lightAlt,
    ...(Platform.select<ViewStyle>({
      ios: shadows.card as ViewStyle,
      android: { elevation: 2 },
      web: {
        boxShadow: '0 2px 12px rgba(0, 9, 50, 0.06)',
      },
      default: {},
    }) ?? {}),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['4'],
    gap: spacing['3'],
  },
  sectionIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray['2'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleText: {
    flex: 1,
    minWidth: 0,
  },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray['2'],
  },
  editPillLabel: {
    marginLeft: 2,
  },
  pressed: {
    opacity: 0.85,
  },
  chevronHit: {
    paddingLeft: spacing['1'],
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing['4'],
  },
  cardBody: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['3'],
    paddingTop: spacing['1'],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing['3'],
    gap: spacing['4'],
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },
  infoLabel: {
    flex: 1,
    maxWidth: '42%',
  },
  infoValue: {
    flex: 1.2,
    textAlign: 'right',
  },
  infoValueMono: {
    letterSpacing: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['3'],
  },
  toggleLabel: {
    flex: 1,
    paddingRight: spacing['3'],
  },
});
