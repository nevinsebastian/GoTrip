import BellBadgeIcon from '@/assets/images/bell-badge.svg';
import HeartFilledIcon from '@/assets/images/heart-filled.svg';
import LogoutIcon from '@/assets/images/logout.svg';
import TicketConfirmationIcon from '@/assets/images/ticket-confirmation.svg';
import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { logout } from '@/src/api/auth.service';
import { updateUserProfile } from '@/src/api/user.service';
import type { User } from '@/src/api/types';
import { AuthWebModal } from '@/src/components/AuthWebModal';
import { DesktopNavFrame } from '@/src/components/desktop/DesktopNavFrame';
import { DesktopWebNav } from '@/src/components/desktop/DesktopWebNav';
import { useHomeSearch } from '@/src/components/home/HomeSearchContext';
import type { HomeCategoryTab } from '@/src/components/home/homeSearchConfig';
import { desktopContentShellStyle } from '@/src/constants/desktopLayoutConstants';
import { DESKTOP_ACCOUNT_SETTINGS_INTRO } from '@/src/constants/desktopWebConstants';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_ADDRESS = {
  street: 'Technopark Phase 2',
  apartment: 'Kulathur',
  city: 'Trivandrum',
  state: 'Kerala',
  pinCode: '682582',
};

type AddressForm = typeof DEFAULT_ADDRESS;

type PersonalForm = {
  fullName: string;
  phone: string;
  email: string;
  address: AddressForm;
};

type EditingSection = 'personal' | null;

function maskPhone(raw: string | null | undefined): string {
  if (!raw?.trim()) return '—';
  const s = raw.trim();
  const digits = s.replace(/\D/g, '');
  if (digits.length < 6) return s;
  const tail = digits.slice(-3);
  const head = digits.slice(0, Math.min(3, digits.length - 3));
  const cc = digits.length > 10 || s.startsWith('+') ? '+91 ' : '';
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

function formatAddress(address: AddressForm) {
  const line2 = address.apartment ? `${address.apartment}, ` : '';
  return `${address.street}, ${line2}${address.city} - ${address.pinCode}`;
}

function buildPersonalForm(user: User | undefined, address: AddressForm): PersonalForm {
  return {
    fullName: displayName(user) === '—' ? '' : displayName(user),
    phone: user?.phone ?? user?.phoneNumber ?? '',
    email: user?.email ?? '',
    address,
  };
}

function GroupedField({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  isLast,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  isLast?: boolean;
}) {
  return (
    <View style={!isLast ? styles.groupedFieldBorder : undefined}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(28, 32, 36, 0.4)"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={styles.groupedInput}
      />
    </View>
  );
}

function PersonalInfoEditForm({
  form,
  onChange,
  onCancel,
  onSave,
  saving,
}: {
  form: PersonalForm;
  onChange: (next: PersonalForm) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <View style={styles.editCard}>
      <Text style={styles.editCardTitle}>Edit personal information</Text>

      <View style={styles.groupedBox}>
        <GroupedField
          value={form.fullName}
          onChangeText={(fullName) => onChange({ ...form, fullName })}
          placeholder="Full Name"
          autoCapitalize="words"
        />
        <GroupedField
          value={form.phone}
          onChangeText={(phone) => onChange({ ...form, phone })}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />
        <GroupedField
          value={form.email}
          onChangeText={(email) => onChange({ ...form, email })}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          isLast
        />
      </View>

      <Text style={styles.editSectionLabel}>Address</Text>

      <View style={styles.groupedBox}>
        <GroupedField
          value={form.address.street}
          onChangeText={(street) => onChange({ ...form, address: { ...form.address, street } })}
          placeholder="Street Address"
        />
        <GroupedField
          value={form.address.apartment}
          onChangeText={(apartment) => onChange({ ...form, address: { ...form.address, apartment } })}
          placeholder="Apartment, House, Villa etc (Optional)"
        />
        <GroupedField
          value={form.address.city}
          onChangeText={(city) => onChange({ ...form, address: { ...form.address, city } })}
          placeholder="City"
        />
        <GroupedField
          value={form.address.state}
          onChangeText={(state) => onChange({ ...form, address: { ...form.address, state } })}
          placeholder="State"
        />
        <GroupedField
          value={form.address.pinCode}
          onChangeText={(pinCode) => onChange({ ...form, address: { ...form.address, pinCode } })}
          placeholder="Pin Code"
          keyboardType="number-pad"
          isLast
        />
      </View>

      <View style={styles.editActions}>
        <Pressable style={styles.goBackBtn} onPress={onCancel} disabled={saving}>
          <View style={styles.goBackIcon}>
            <Ionicons name="chevron-back" size={16} color={colors.surface.white} />
          </View>
          <Text style={styles.goBackText}>Go back</Text>
        </Pressable>
        <Pressable style={[styles.saveBtn, saving && styles.btnDisabled]} onPress={onSave} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </Pressable>
      </View>
    </View>
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
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.sectionIconBox}>
          <Ionicons name={icon} size={20} color={colors.accent.main} />
        </View>
        <Text style={styles.sectionTitle} numberOfLines={1}>
          {title}
        </Text>
        {expanded && onEdit ? (
          <Pressable style={styles.editPill} onPress={onEdit} accessibilityLabel={`Edit ${title}`}>
            <Ionicons name="pencil-outline" size={14} color={colors.text.caption} />
            <Text style={styles.editPillLabel}>Edit</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={onToggle} hitSlop={10} accessibilityLabel={expanded ? 'Collapse' : 'Expand'}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
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
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, masked && styles.infoValueMono]} numberOfLines={3}>
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
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'rgba(28, 32, 36, 0.25)', true: colors.accent.main }}
        thumbColor={colors.surface.white}
        ios_backgroundColor="rgba(28, 32, 36, 0.25)"
      />
    </View>
  );
}

export function DesktopAccountSettingsScreen() {
  const queryClient = useQueryClient();
  const { activeCategoryTab, setActiveCategoryTab, exitSearchMode } = useHomeSearch();
  const { data: user, isLoading, error } = useUserProfile();

  const [address, setAddress] = useState<AddressForm>(DEFAULT_ADDRESS);
  const [personalOpen, setPersonalOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [generalNotif, setGeneralNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);
  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [personalForm, setPersonalForm] = useState<PersonalForm>(() => buildPersonalForm(undefined, DEFAULT_ADDRESS));
  const [saving, setSaving] = useState(false);
  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [webAuthModal, setWebAuthModal] = useState<{ visible: boolean; mode: 'login' | 'signup' }>({
    visible: false,
    mode: 'login',
  });

  const isUnauthorized = Boolean(error?.isUnauthorized);
  const isLoggedIn = Boolean(user) && !isUnauthorized;

  useEffect(() => {
    if (!isLoading && (isUnauthorized || !user)) {
      setWebAuthModal({ visible: true, mode: 'login' });
    }
  }, [isLoading, isUnauthorized, user]);

  useEffect(() => {
    if (user) {
      setPersonalForm(buildPersonalForm(user, address));
    }
  }, [user, address]);

  const phoneDisplay = useMemo(
    () => maskPhone(user?.phone ?? user?.phoneNumber ?? null),
    [user],
  );
  const emailDisplay = useMemo(() => maskEmail(user?.email), [user]);
  const addressDisplay = useMemo(() => formatAddress(address), [address]);

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

  const handleSavePersonal = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile({
        name: personalForm.fullName.trim() || undefined,
        phoneNumber: personalForm.phone.trim() || null,
      });
      setAddress(personalForm.address);
      await queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
      setEditingSection(null);
    } catch (err) {
      Alert.alert('Could not save', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (editingSection) {
      setEditingSection(null);
      return;
    }
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.page} edges={['top']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.accent.main} />
        </View>
      </SafeAreaView>
    );
  }

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
        onClose={() => {
          setWebAuthModal((s) => ({ ...s, visible: false }));
          if (!isLoggedIn) router.back();
        }}
        onSwitchMode={(m) => setWebAuthModal({ visible: true, mode: m })}
        onAuthenticated={() => queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY })}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentShell}>
          <DesktopNavFrame>
            <DesktopWebNav
              embedded
              activeTab={activeCategoryTab}
              onTabChange={handleTabChange}
              isLoggedIn={isLoggedIn}
              onMenuPress={() => setWebMenuOpen(true)}
              onProfilePress={() => router.push('/(tabs)/four')}
              onLoginPress={() => setWebAuthModal({ visible: true, mode: 'login' })}
            />
          </DesktopNavFrame>

          <View style={styles.titleRow}>
            <Pressable style={styles.backRow} onPress={handleBack} accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
              <Text style={styles.pageTitle}>Account Settings</Text>
            </Pressable>
            <Pressable
              style={styles.wishlistBtn}
              onPress={() => router.push('/(tabs)/two')}
              accessibilityLabel="Wishlist"
            >
              <Ionicons name="heart-outline" size={20} color={colors.accent.main} />
            </Pressable>
          </View>

          {user && editingSection === 'personal' ? (
            <PersonalInfoEditForm
              form={personalForm}
              onChange={setPersonalForm}
              onCancel={() => setEditingSection(null)}
              onSave={handleSavePersonal}
              saving={saving}
            />
          ) : user ? (
            <View style={styles.accordionStack}>
              <AccordionCard
                icon="person-outline"
                title="Personal Information"
                expanded={personalOpen}
                onToggle={() => setPersonalOpen((o) => !o)}
                onEdit={() => {
                  setPersonalForm(buildPersonalForm(user, address));
                  setEditingSection('personal');
                }}
              >
                <InfoRow label="Full Name" value={displayName(user)} />
                <InfoRow label="Phone Number" value={phoneDisplay} />
                <InfoRow label="Email" value={emailDisplay} />
                <InfoRow label="Address" value={addressDisplay} isLast />
              </AccordionCard>

              <AccordionCard
                icon="shield-checkmark-outline"
                title="Login & Security"
                expanded={loginOpen}
                onToggle={() => setLoginOpen((o) => !o)}
                onEdit={() => setLoginOpen(true)}
              >
                <InfoRow label="Phone Number" value={phoneDisplay} />
                <InfoRow label="Password" value={'•'.repeat(14)} isLast masked />
              </AccordionCard>

              <AccordionCard
                icon="notifications-outline"
                title="Notifications"
                expanded={notifOpen}
                onToggle={() => setNotifOpen((o) => !o)}
                onEdit={() => setNotifOpen(true)}
              >
                <ToggleRow label="General Notifications" value={generalNotif} onValueChange={setGeneralNotif} />
                <ToggleRow
                  label="Promotional Notifications"
                  value={promoNotif}
                  onValueChange={setPromoNotif}
                  isLast
                />
              </AccordionCard>
            </View>
          ) : null}

          <View style={styles.introBlock}>
            <View style={styles.introDivider}>
              <View style={styles.introDividerOrange} />
              <View style={styles.introDividerGray} />
            </View>
            {DESKTOP_ACCOUNT_SETTINGS_INTRO.map((paragraph) => (
              <Text key={paragraph.slice(0, 24)} style={styles.introText}>
                {paragraph}
              </Text>
            ))}
          </View>
        </View>
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
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  accordionStack: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    ...Platform.select({
      web: { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  sectionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(229, 77, 46, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
  },
  editPillLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.caption,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.1)',
    marginHorizontal: 16,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 24,
    paddingVertical: 14,
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.1)',
  },
  infoLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.text.secondary,
  },
  infoValue: {
    flex: 1.2,
    textAlign: 'right',
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  infoValueMono: {
    letterSpacing: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
  },
  toggleLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontSize: 13,
    color: colors.text.secondary,
  },
  editCard: {
    backgroundColor: colors.surface.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    padding: 20,
    gap: 20,
    ...Platform.select({
      web: { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' },
      default: {},
    }),
  },
  editCardTitle: {
    fontFamily: typography.fontFamily.text,
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  editSectionLabel: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  groupedBox: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface.white,
  },
  groupedFieldBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.1)',
  },
  groupedInput: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: colors.surface.white,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  goBackBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.white,
  },
  goBackIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  saveBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 100,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  introBlock: {
    gap: 16,
    paddingTop: 8,
  },
  introDivider: {
    flexDirection: 'row',
    height: 2,
    marginBottom: 8,
  },
  introDividerOrange: {
    flex: 1,
    backgroundColor: colors.accent.main,
  },
  introDividerGray: {
    flex: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.2)',
  },
  introText: {
    fontFamily: typography.fontFamily.text,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(28, 32, 36, 0.7)',
    textAlign: 'center',
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
