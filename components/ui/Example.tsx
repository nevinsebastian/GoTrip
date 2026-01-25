/**
 * Component Library Examples
 * 
 * This file demonstrates usage of all base components.
 * You can reference this when building screens.
 * 
 * To use: Import and render this component in a screen to see all examples.
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Card, Text, IconButton, Divider } from './index';
import { spacing } from '@/constants/DesignSystem';

export function ComponentExamples() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="h1" style={styles.title}>
        Component Library
      </Text>

      {/* Button Examples */}
      <Text variant="h3" style={styles.sectionTitle}>
        Buttons
      </Text>
      <Card variant="outlined" style={styles.card}>
        <Button variant="primary" onPress={() => console.log('Primary pressed')}>
          Primary Button
        </Button>
        <View style={styles.spacing} />
        <Button variant="secondary" onPress={() => console.log('Secondary pressed')}>
          Secondary Button
        </Button>
        <View style={styles.spacing} />
        <Button variant="outline" onPress={() => console.log('Outline pressed')}>
          Outline Button
        </Button>
        <View style={styles.spacing} />
        <Button variant="ghost" onPress={() => console.log('Ghost pressed')}>
          Ghost Button
        </Button>
        <View style={styles.spacing} />
        <Button
          variant="primary"
          loading={isLoading}
          onPress={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 2000);
          }}
        >
          Loading Button
        </Button>
        <View style={styles.spacing} />
        <Button variant="primary" disabled onPress={() => {}}>
          Disabled Button
        </Button>
        <View style={styles.spacing} />
        <Button
          variant="primary"
          leftIcon={<Ionicons name="calendar" size={20} color="white" />}
          rightIcon={<Ionicons name="arrow-forward" size={20} color="white" />}
          onPress={() => console.log('With icons')}
        >
          With Icons
        </Button>
        <View style={styles.spacing} />
        <Button variant="primary" fullWidth onPress={() => console.log('Full width')}>
          Full Width Button
        </Button>
      </Card>

      <Divider spacing={spacing['2xl']} />

      {/* Input Examples */}
      <Text variant="h3" style={styles.sectionTitle}>
        Inputs
      </Text>
      <Card variant="outlined" style={styles.card}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Ionicons name="mail-outline" size={20} />}
        />
        <Input
          label="Password"
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          helperText="Must be at least 8 characters"
          rightIcon={<Ionicons name="eye-outline" size={20} />}
        />
        <Input
          label="Full Name"
          placeholder="Enter your name"
          required
          helperText="This field is required"
        />
        <Input
          label="Email with Error"
          placeholder="Enter email"
          value="invalid-email"
          error="Please enter a valid email address"
        />
        <Input
          label="Disabled Input"
          placeholder="Cannot edit"
          value="Disabled value"
          editable={false}
        />
      </Card>

      <Divider spacing={spacing['2xl']} />

      {/* Text Examples */}
      <Text variant="h3" style={styles.sectionTitle}>
        Typography
      </Text>
      <Card variant="outlined" style={styles.card}>
        <Text variant="h1">Heading 1</Text>
        <Text variant="h2">Heading 2</Text>
        <Text variant="h3">Heading 3</Text>
        <Text variant="h4">Heading 4</Text>
        <Text variant="h5">Heading 5</Text>
        <Text variant="h6">Heading 6</Text>
        <Text variant="body">Body text - This is the default text style</Text>
        <Text variant="caption" color="secondary">
          Caption text - Used for secondary information
        </Text>
        <Text variant="label">Label text - Used for form labels</Text>
        <View style={styles.spacing} />
        <Text variant="body" color="error">
          Error text
        </Text>
        <Text variant="body" color="success">
          Success text
        </Text>
        <Text variant="body" color="warning">
          Warning text
        </Text>
        <View style={styles.spacing} />
        <Text variant="body" align="center">
          Centered text
        </Text>
        <Text variant="body" bold>
          Bold text
        </Text>
        <Text variant="body" semibold>
          Semibold text
        </Text>
      </Card>

      <Divider spacing={spacing['2xl']} />

      {/* Card Examples */}
      <Text variant="h3" style={styles.sectionTitle}>
        Cards
      </Text>
      <Card variant="default" style={styles.card}>
        <Text variant="h4">Default Card</Text>
        <Text variant="body" color="secondary">
          This is a default card with no border or shadow
        </Text>
      </Card>
      <View style={styles.spacing} />
      <Card variant="elevated" style={styles.card}>
        <Text variant="h4">Elevated Card</Text>
        <Text variant="body" color="secondary">
          This card has a shadow for elevation
        </Text>
      </Card>
      <View style={styles.spacing} />
      <Card variant="outlined" style={styles.card}>
        <Text variant="h4">Outlined Card</Text>
        <Text variant="body" color="secondary">
          This card has a border outline
        </Text>
      </Card>
      <View style={styles.spacing} />
      <Card
        variant="elevated"
        pressable
        onPress={() => console.log('Card pressed')}
        style={styles.card}
        accessibilityLabel="Pressable card example"
      >
        <Text variant="h4">Pressable Card</Text>
        <Text variant="body" color="secondary">
          Tap this card to see pressable behavior
        </Text>
      </Card>

      <Divider spacing={spacing['2xl']} />

      {/* IconButton Examples */}
      <Text variant="h3" style={styles.sectionTitle}>
        Icon Buttons
      </Text>
      <Card variant="outlined" style={styles.card}>
        <View style={styles.iconButtonRow}>
          <IconButton
            icon={<Ionicons name="heart-outline" size={24} />}
            variant="ghost"
            accessibilityLabel="Add to favorites"
            onPress={() => console.log('Favorite')}
          />
          <IconButton
            icon={<Ionicons name="share-outline" size={24} />}
            variant="outline"
            accessibilityLabel="Share"
            onPress={() => console.log('Share')}
          />
          <IconButton
            icon={<Ionicons name="bookmark-outline" size={24} />}
            variant="secondary"
            accessibilityLabel="Bookmark"
            onPress={() => console.log('Bookmark')}
          />
          <IconButton
            icon={<Ionicons name="checkmark" size={24} color="white" />}
            variant="primary"
            accessibilityLabel="Confirm"
            onPress={() => console.log('Confirm')}
          />
        </View>
        <View style={styles.spacing} />
        <View style={styles.iconButtonRow}>
          <IconButton
            icon={<Ionicons name="refresh" size={20} />}
            variant="ghost"
            size="sm"
            accessibilityLabel="Refresh"
            onPress={() => console.log('Refresh')}
          />
          <IconButton
            icon={<Ionicons name="close" size={24} />}
            variant="ghost"
            size="md"
            accessibilityLabel="Close"
            onPress={() => console.log('Close')}
          />
          <IconButton
            icon={<Ionicons name="add" size={28} />}
            variant="primary"
            size="lg"
            accessibilityLabel="Add"
            onPress={() => console.log('Add')}
          />
        </View>
      </Card>

      <Divider spacing={spacing['2xl']} />

      {/* Divider Examples */}
      <Text variant="h3" style={styles.sectionTitle}>
        Dividers
      </Text>
      <Card variant="outlined" style={styles.card}>
        <Text>Content above</Text>
        <Divider spacing={spacing.md} />
        <Text>Content below</Text>
        <View style={styles.spacing} />
        <Text>Content with custom spacing</Text>
        <Divider spacing={spacing.xl} thickness={2} />
        <Text>More content</Text>
        <View style={[styles.spacing, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text>Left</Text>
          <Divider orientation="vertical" horizontalSpacing={spacing.md} />
          <Text>Right</Text>
        </View>
      </Card>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing['2xl'],
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  spacing: {
    height: spacing.md,
  },
  iconButtonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  footer: {
    height: spacing['4xl'],
  },
});
