import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Text, Input, Button, IconButton, Divider } from '@/components/ui';
import { colors, spacing } from '@/constants/DesignTokens';
import { useResponsive } from '@/components/ui/useResponsive';

export default function LoginScreen() {
  const { isMobile } = useResponsive();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton 
            icon="arrow-back" 
            onPress={() => {/* Navigate back */}}
          />
          <Text variant="header" color="primaryBrand" style={styles.headerTitle}>
            Log in
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content Card */}
        <Card style={styles.card}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text variant="heading1" color="primaryBrand" style={styles.logoMain}>
              Gotrip
            </Text>
            <Text variant="body" color="primaryBrand" style={styles.logoSub}>
              holiday
            </Text>
          </View>

          {/* Welcome Text */}
          <Text variant="heading1" style={styles.welcomeText}>
            Welcome Back..
          </Text>

          {/* Instruction Text */}
          <Text variant="bodyMedium" color="secondary" style={styles.instructionText}>
            Enter your Phone number.
          </Text>

          {/* Phone Input */}
          <Input
            placeholder="Phone number"
            keyboardType="phone-pad"
            style={styles.input}
          />

          {/* OTP Info Text */}
          <Text variant="caption" color="caption" style={styles.otpInfo}>
            You'll get OTP to this number.
          </Text>

          {/* Get OTP Button */}
          <Button 
            variant="primary" 
            style={styles.primaryButton}
            onPress={() => {/* Handle OTP */}}
          >
            Get OTP
          </Button>

          {/* Divider */}
          <Divider />

          {/* Social Login Buttons */}
          <Button 
            variant="outline" 
            style={styles.socialButton}
            onPress={() => {/* Handle mail login */}}
          >
            Log in with mail
          </Button>

          <Button 
            variant="outline" 
            style={styles.socialButton}
            onPress={() => {/* Handle Google login */}}
          >
            Continue with Google
          </Button>

          <Button 
            variant="outline" 
            style={styles.socialButton}
            onPress={() => {/* Handle Apple login */}}
          >
            Continue with Apple
          </Button>

          <Button 
            variant="outline" 
            style={styles.socialButton}
            onPress={() => {/* Handle Facebook login */}}
          >
            Continue with Facebook
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44, // Match IconButton minWidth for centering
  },
  card: {
    // Card component handles its own width
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoMain: {
    // Using heading1 variant - no custom fontSize
  },
  logoSub: {
    marginTop: spacing.xs,
  },
  welcomeText: {
    marginBottom: spacing.sm,
  },
  instructionText: {
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.xs,
  },
  otpInfo: {
    marginBottom: spacing.lg,
  },
  primaryButton: {
    marginBottom: spacing.lg,
  },
  socialButton: {
    marginBottom: spacing.md,
  },
});
