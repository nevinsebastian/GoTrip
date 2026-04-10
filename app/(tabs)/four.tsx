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
import React, { useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { USER_PROFILE_QUERY_KEY } from '@/src/hooks/useUserProfile';
import { getErrorMessage } from '@/src/utils/errorHandler';
import { useSendOtp } from '@/src/hooks/useSendOtp';
import { useVerifyOtp } from '@/src/hooks/useVerifyOtp';
import { usePreviousTab } from './_layout';
import { logout } from '@/src/api/auth.service';
import { useQueryClient } from '@tanstack/react-query';



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
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');
  const [loginValue, setLoginValue] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginStep, setLoginStep] = useState<'login' | 'otp'>('login');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useUserProfile();

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();

  const isUnauthorized = Boolean(error?.isUnauthorized);

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

  const handleLogoutConfirm = async () => {
    setLogoutModalVisible(false);

    try {
      await logout();
    } finally {
      // Ensure UI is logged out even if API logout fails.
      queryClient.removeQueries({ queryKey: USER_PROFILE_QUERY_KEY });
      queryClient.clear();
      setLoginModalVisible(false);
      setLoginStep('login');
      setLoginError(null);
      setLoginMode('phone');
      setLoginValue('');
      setOtpDigits(['', '', '', '']);
      router.replace('/(tabs)');
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false);
  };

  const closeLoginModal = () => {
    setLoginModalVisible(false);
    setLoginError(null);
    setLoginStep('login');
    setOtpDigits(['', '', '', '']);
  };

  const openLoginModal = () => {
    setLoginModalVisible(true);
    setLoginStep('login');
    setLoginError(null);
    setLoginMode('phone');
    setLoginValue('');
    setOtpDigits(['', '', '', '']);
  };

  const handleGetOtp = () => {
    setLoginError(null);
    const trimmed = loginValue.trim();
    if (!trimmed) {
      setLoginError(loginMode === 'email' ? 'Please enter your email.' : 'Please enter your phone number.');
      return;
    }

    const payload =
      loginMode === 'email'
        ? { channel: 'email' as const, email: trimmed }
        : { channel: 'phone' as const, phone: trimmed };

    sendOtp(
      payload,
      {
        onSuccess: (res) => {
          if (res?.success) {
            setLoginStep('otp');
            setOtpDigits(['', '', '', '']);
            // focus first box shortly after transition
            setTimeout(() => otpRefs.current[0]?.focus?.(), 150);
            return;
          }
          setLoginError(res?.message ?? 'Failed to send OTP. Please try again.');
        },
        onError: (err) => setLoginError(getErrorMessage(err)),
      },
    );
  };

  const OTP_LENGTH = 4;

  const handleOtpDigitChange = (index: number, value: string) => {
    const num = value.replace(/\D/g, '');
    if (num.length > 1) {
      const chars = num.slice(0, OTP_LENGTH).split('');
      const next = [...otpDigits];
      chars.forEach((c, i) => {
        if (index + i < OTP_LENGTH) next[index + i] = c;
      });
      setOtpDigits(next);
      const nextFocus = Math.min(index + chars.length, OTP_LENGTH - 1);
      otpRefs.current[nextFocus]?.focus?.();
      return;
    }
    const next = [...otpDigits];
    next[index] = num;
    setOtpDigits(next);
    if (num && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus?.();
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otpDigits[index] && index > 0) otpRefs.current[index - 1]?.focus?.();
  };

  const handleVerifyOtp = () => {
    if (isVerifyingOtp) return;
    setLoginError(null);
    const code = otpDigits.join('');
    if (code.length !== OTP_LENGTH) return;

    verifyOtp(
      {
        channel: loginMode === 'email' ? 'email' : 'phone',
        otp: code,
        ...(loginMode === 'email' ? { email: loginValue.trim() } : { phone: loginValue.trim() }),
      },
      {
        onSuccess: async (res) => {
          if (res?.success && res?.data?.access_token) {
            setLoginModalVisible(false);
            setLoginStep('login');
            setOtpDigits(['', '', '', '']);
            await refetch();
            return;
          }
          setLoginError(res?.message ?? 'Invalid or expired OTP.');
        },
        onError: (err) => setLoginError(getErrorMessage(err)),
      },
    );
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
        {error && !isUnauthorized ? (
          <View style={styles.messageWrap}>
            <Text variant="caption" style={styles.errorText}>
              {getErrorMessage(error)}
            </Text>
          </View>
        ) : null}

        {/* User info card: avatar (left) + name, phone, email (right) */}
        <View style={styles.profileCard}>
          {isUnauthorized || !user ? (
            <View style={styles.profileLoggedOut}>
              <Text variant="heading2" style={styles.profileName}>
                Account
              </Text>
              <Text variant="caption" style={styles.profileMeta}>
                Log in to see your profile details and bookings.
              </Text>
              <Pressable
                style={({ pressed }) => [styles.loginCta, pressed && styles.loginCtaPressed]}
                onPress={openLoginModal}
                accessibilityLabel="Login or sign up"
              >
                <Text variant="bodySemibold" style={styles.loginCtaText}>
                  Login or sign up
                </Text>
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
                <Text variant="heading2" style={styles.profileName}>
                  {user?.full_name || user?.name}
                </Text>
                <Text variant="caption" style={styles.profileMeta}>
                  {user?.phone || 'Phone not available'}
                </Text>
                <Text variant="caption" style={styles.profileMeta}>
                  {user?.email || 'Email not available'}
                </Text>
              </View>
            </>
          )}
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

      {/* Login required bottom sheet (401) */}
      <Modal
        visible={loginModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeLoginModal}
      >
        <Pressable
          style={styles.sheetOverlay}
          onPress={loginStep === 'otp' ? undefined : closeLoginModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
          >
            <Pressable style={styles.sheetCard} onPress={(e) => e.stopPropagation()}>
              <View style={styles.sheetHeader}>
                <Pressable onPress={closeLoginModal} hitSlop={12} accessibilityLabel="Close login">
                  <Ionicons name="chevron-back" size={22} color={colors.primary} />
                </Pressable>
              <Text variant="bodySemibold" style={styles.sheetTitle}>
                {loginStep === 'otp' ? 'Enter OTP' : 'Log in or sign up'}
              </Text>
              <View style={{ width: 22 }} />
              </View>

              <View style={styles.sheetBody}>
                {loginStep === 'login' ? (
                  <>
                  <TextInput
                    value={loginValue}
                    onChangeText={setLoginValue}
                    placeholder={loginMode === 'email' ? 'Email' : 'Phone number'}
                    placeholderTextColor="rgba(0, 5, 29, 0.45)"
                    keyboardType={loginMode === 'email' ? 'email-address' : 'phone-pad'}
                    autoCapitalize="none"
                    style={styles.loginPhoneInput}
                  />
                  <Text variant="caption" style={styles.loginHelper}>
                    {loginMode === 'email' ? "You'll get OTP to this email." : "You'll get OTP to this number."}
                  </Text>

                  <Pressable
                    onPress={() => {
                      setLoginMode((p) => (p === 'phone' ? 'email' : 'phone'));
                      setLoginValue('');
                      setLoginError(null);
                    }}
                    accessibilityLabel={loginMode === 'email' ? 'Login with phone' : 'Login with email'}
                    hitSlop={8}
                    style={styles.loginModeSwitch}
                  >
                    <Text variant="caption" style={styles.loginModeSwitchText}>
                      {loginMode === 'email' ? 'Login with phone' : 'Login with email'}
                    </Text>
                  </Pressable>

                  {loginError ? (
                    <Text variant="caption" style={styles.loginError}>
                      {loginError}
                    </Text>
                  ) : null}

                  <Pressable
                    style={[styles.getOtpBtn, isSendingOtp && styles.btnDisabled]}
                    onPress={handleGetOtp}
                    disabled={isSendingOtp}
                    accessibilityLabel="Get OTP"
                  >
                    <Text variant="bodySemibold" style={styles.getOtpBtnText}>
                      {isSendingOtp ? 'Sending OTP...' : 'Get OTP'}
                    </Text>
                  </Pressable>

                  <View style={styles.socialDividerRow}>
                    <View style={styles.socialDivider} />
                    <Text variant="caption" style={styles.socialDividerText}>
                      Or
                    </Text>
                    <View style={styles.socialDivider} />
                  </View>

                  <View style={styles.socialStack}>
                    <Pressable style={styles.socialBtn} accessibilityLabel="Continue with Google">
                      <Ionicons name="logo-google" size={18} color={colors.text.primary} />
                      <Text variant="bodySemibold" style={styles.socialBtnText}>
                        Continue with Google
                      </Text>
                    </Pressable>
                    <Pressable style={styles.socialBtn} accessibilityLabel="Continue with Apple">
                      <Ionicons name="logo-apple" size={18} color={colors.text.primary} />
                      <Text variant="bodySemibold" style={styles.socialBtnText}>
                        Continue with Apple
                      </Text>
                    </Pressable>
                    <Pressable style={styles.socialBtn} accessibilityLabel="Continue with Facebook">
                      <Ionicons name="logo-facebook" size={18} color={colors.text.primary} />
                      <Text variant="bodySemibold" style={styles.socialBtnText}>
                        Continue with Facebook
                      </Text>
                    </Pressable>
                  </View>
                  </>
                ) : (
                  <>
                  <Text variant="caption" style={styles.otpSubtitle}>
                    {loginMode === 'email'
                      ? `Sent to ${loginValue.trim() || 'your email'}`
                      : `Sent to ${loginValue.trim() || 'your phone number'}`}
                  </Text>

                  <View style={styles.otpRow}>
                    {otpDigits.map((d, idx) => (
                      <TextInput
                        key={idx}
                        ref={(r) => {
                          otpRefs.current[idx] = r;
                        }}
                        value={d}
                        onChangeText={(v) => handleOtpDigitChange(idx, v)}
                        onKeyPress={({ nativeEvent }) => handleOtpKeyPress(idx, nativeEvent.key)}
                        keyboardType="number-pad"
                        maxLength={2}
                        style={styles.otpBox}
                        placeholder="•"
                        placeholderTextColor="rgba(0, 5, 29, 0.25)"
                      />
                    ))}
                  </View>

                  {loginError ? (
                    <Text variant="caption" style={styles.loginError}>
                      {loginError}
                    </Text>
                  ) : null}

                  <Pressable
                    style={[
                      styles.getOtpBtn,
                      (isVerifyingOtp || otpDigits.join('').length !== OTP_LENGTH) && styles.btnDisabled,
                    ]}
                    onPress={handleVerifyOtp}
                    disabled={isVerifyingOtp || otpDigits.join('').length !== OTP_LENGTH}
                    accessibilityLabel="Verify OTP"
                  >
                    <Text variant="bodySemibold" style={styles.getOtpBtnText}>
                      {isVerifyingOtp ? 'Verifying...' : 'Confirm'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setLoginStep('login');
                      setOtpDigits(['', '', '', '']);
                      setLoginError(null);
                    }}
                    accessibilityLabel="Change contact"
                    hitSlop={8}
                    style={styles.changeContactBtn}
                  >
                    <Text variant="caption" style={styles.loginModeSwitchText}>
                      Change email/phone
                    </Text>
                  </Pressable>
                  </>
                )}
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

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
  messageWrap: {
    marginBottom: spacing['2'],
  },
  errorText: {
    color: colors.primaryAlt,
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
  // Login bottom sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 48, 0.27)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    width: '100%',
    backgroundColor: colors.gray['1'],
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    paddingTop: spacing['5'],
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['6'],
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: spacing['4'],
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 24,
  },
  sheetBody: {
    gap: spacing['2'],
  },
  loginPhoneInput: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.12)',
    borderRadius: 6,
    paddingHorizontal: spacing['3'],
    color: colors.text.primary,
  },
  loginHelper: {
    color: 'rgba(0, 5, 29, 0.45)',
    paddingHorizontal: spacing['1'],
  },
  loginError: {
    color: '#d32f2f',
  },
  getOtpBtn: {
    height: 32,
    borderRadius: borderRadius.sm ?? 4,
    backgroundColor: colors.neutral?.['9'] ?? '#8b8d98',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2'],
  },
  getOtpBtnText: {
    color: colors.surface.white,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  loginModeSwitch: {
    alignSelf: 'flex-start',
    marginTop: spacing['1'],
    paddingVertical: spacing['1'],
  },
  loginModeSwitchText: {
    color: colors.primary,
  },
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginTop: spacing['3'],
    marginBottom: spacing['1'],
  },
  socialDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 9, 50, 0.12)',
  },
  socialDividerText: {
    color: 'rgba(0, 5, 29, 0.45)',
  },
  socialStack: {
    gap: spacing['2'],
  },
  socialBtn: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.12)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
  },
  socialBtnText: {
    color: colors.text.primary,
  },
  profileLoggedOut: {
    flex: 1,
    gap: spacing['2'],
  },
  loginCta: {
    height: 36,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2'],
    alignSelf: 'flex-start',
    paddingHorizontal: spacing['4'],
  },
  loginCtaPressed: {
    opacity: 0.85,
  },
  loginCtaText: {
    color: colors.surface.white,
  },
  otpSubtitle: {
    color: 'rgba(0, 5, 29, 0.45)',
    marginBottom: spacing['2'],
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing['2'],
    marginBottom: spacing['2'],
  },
  otpBox: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 9, 50, 0.12)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontSize: 18,
    color: colors.text.primary,
  },
  changeContactBtn: {
    alignSelf: 'center',
    marginTop: spacing['2'],
    paddingVertical: spacing['1'],
  },
});
