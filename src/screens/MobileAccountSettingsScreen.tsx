import { Text } from '@/components/ui';
import { colors, typography } from '@/constants/DesignTokens';
import { updateUserProfile } from '@/src/api/user.service';
import type { User } from '@/src/api/types';
import { useHomeScale } from '@/src/components/home/useHomeScale';
import { MobileBottomTabBar } from '@/src/components/navigation/MobileBottomTabBar';
import { USER_PROFILE_QUERY_KEY, useUserProfile } from '@/src/hooks/useUserProfile';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  const { s } = useHomeScale();
  return (
    <View style={!isLast ? styles.groupedFieldBorder : undefined}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(28, 32, 36, 0.4)"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.groupedInput, { fontSize: s(14), lineHeight: s(20), paddingVertical: s(14), paddingHorizontal: s(12) }]}
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
  const { s } = useHomeScale();

  return (
    <View style={[styles.editCard, { borderRadius: s(16), padding: s(16), gap: s(20) }]}>
      <Text style={[styles.editCardTitle, { fontSize: s(16), lineHeight: s(24) }]}>
        Edit personal information
      </Text>

      <View style={[styles.groupedBox, { borderRadius: s(12) }]}>
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

      <Text style={[styles.editSectionLabel, { fontSize: s(14), lineHeight: s(20) }]}>Address</Text>

      <View style={[styles.groupedBox, { borderRadius: s(12) }]}>
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

      <View style={[styles.editActions, { gap: s(12), marginTop: s(4) }]}>
        <Pressable
          style={[styles.goBackBtn, { height: s(48), borderRadius: s(100), flex: 1 }]}
          onPress={onCancel}
          disabled={saving}
        >
          <View style={[styles.goBackIcon, { width: s(28), height: s(28), borderRadius: s(14) }]}>
            <Ionicons name="chevron-back" size={s(16)} color={colors.surface.white} />
          </View>
          <Text style={[styles.goBackText, { fontSize: s(14) }]}>Go back</Text>
        </Pressable>
        <Pressable
          style={[styles.saveBtn, { height: s(48), borderRadius: s(100), flex: 1.4 }, saving && styles.btnDisabled]}
          onPress={onSave}
          disabled={saving}
        >
          <Text style={[styles.saveBtnText, { fontSize: s(14) }]}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
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
  onEdit: () => void;
  children: React.ReactNode;
}) {
  const { s } = useHomeScale();

  return (
    <View style={[styles.card, { borderRadius: s(16), marginBottom: s(16) }]}>
      <View style={[styles.cardHeader, { padding: s(16), gap: s(12) }]}>
        <View style={[styles.sectionIconBox, { width: s(40), height: s(40), borderRadius: s(10) }]}>
          <Ionicons name={icon} size={s(20)} color={colors.accent.main} />
        </View>
        <Text style={[styles.sectionTitle, { fontSize: s(14), flex: 1 }]} numberOfLines={1}>
          {title}
        </Text>
        <Pressable
          style={[styles.editPill, { paddingHorizontal: s(10), paddingVertical: s(6), borderRadius: s(8), gap: s(4) }]}
          onPress={onEdit}
          accessibilityLabel={`Edit ${title}`}
        >
          <Ionicons name="pencil-outline" size={s(14)} color={colors.text.caption} />
          <Text style={[styles.editPillLabel, { fontSize: s(12) }]}>Edit</Text>
        </Pressable>
        <Pressable onPress={onToggle} hitSlop={10} accessibilityLabel={expanded ? 'Collapse' : 'Expand'}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={s(20)}
            color={colors.text.secondary}
          />
        </Pressable>
      </View>

      {expanded ? (
        <>
          <View style={[styles.cardDivider, { marginHorizontal: s(16) }]} />
          <View style={[styles.cardBody, { paddingHorizontal: s(16), paddingBottom: s(8) }]}>{children}</View>
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
  const { s } = useHomeScale();
  return (
    <View style={[styles.infoRow, { paddingVertical: s(14) }, !isLast && styles.infoRowBorder]}>
      <Text style={[styles.infoLabel, { fontSize: s(12), lineHeight: s(16) }]}>{label}</Text>
      <Text
        style={[
          styles.infoValue,
          { fontSize: s(12), lineHeight: s(16) },
          masked && styles.infoValueMono,
        ]}
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
  const { s } = useHomeScale();
  return (
    <View style={[styles.toggleRow, { paddingVertical: s(14) }, !isLast && styles.infoRowBorder]}>
      <Text style={[styles.toggleLabel, { fontSize: s(12), lineHeight: s(16) }]}>{label}</Text>
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

export function MobileAccountSettingsScreen() {
  const { s } = useHomeScale();
  const contentPadding = s(16);
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useUserProfile();
  const isUnauthorized = Boolean(error?.isUnauthorized);

  const [address, setAddress] = useState<AddressForm>(DEFAULT_ADDRESS);
  const [personalOpen, setPersonalOpen] = useState(true);
  const [loginOpen, setLoginOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(true);
  const [generalNotif, setGeneralNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);
  const [editingSection, setEditingSection] = useState<EditingSection>(null);
  const [personalForm, setPersonalForm] = useState<PersonalForm>(() => buildPersonalForm(undefined, DEFAULT_ADDRESS));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && (isUnauthorized || !user)) {
      router.back();
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

  if (isLoading || (!user && !isUnauthorized)) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.accent.main} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!user) return null;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: contentPadding, paddingTop: s(8) }]}>
          <View style={[styles.headerRow, { gap: s(12) }]}>
            <Pressable
              style={[styles.backBtn, { width: s(40), height: s(40), borderRadius: s(20) }]}
              onPress={() => (editingSection ? setEditingSection(null) : router.back())}
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={s(22)} color={colors.surface.white} />
            </Pressable>
            <Text style={[styles.headerTitle, { fontSize: s(24), lineHeight: s(32) }]}>Account Settings</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{
            paddingHorizontal: contentPadding,
            paddingTop: s(8),
            paddingBottom: s(120),
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {editingSection === 'personal' ? (
            <PersonalInfoEditForm
              form={personalForm}
              onChange={setPersonalForm}
              onCancel={() => setEditingSection(null)}
              onSave={handleSavePersonal}
              saving={saving}
            />
          ) : (
            <>
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
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <MobileBottomTabBar activeTab="four" />
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
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  card: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconBox: {
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 32, 36, 0.05)',
  },
  editPillLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.caption,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(28, 32, 36, 0.1)',
  },
  cardBody: {
    paddingTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.1)',
  },
  infoLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
  },
  infoValue: {
    flex: 1.2,
    textAlign: 'right',
    fontFamily: typography.fontFamily.text,
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
  },
  toggleLabel: {
    flex: 1,
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary,
  },
  editCard: {
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  editCardTitle: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  editSectionLabel: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  groupedBox: {
    borderWidth: 1,
    borderColor: 'rgba(28, 32, 36, 0.1)',
    overflow: 'hidden',
    backgroundColor: colors.surface.white,
  },
  groupedFieldBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(28, 32, 36, 0.1)',
  },
  groupedInput: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.primary,
    backgroundColor: colors.surface.white,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent.main,
    backgroundColor: colors.surface.white,
  },
  goBackIcon: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.medium,
    color: colors.accent.main,
  },
  saveBtn: {
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: typography.fontFamily.text,
    fontWeight: typography.fontWeight.semibold,
    color: colors.surface.white,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
