# UI Component Library

A production-ready, cross-platform component library for the resort booking application. Built with React Native primitives and designed to work seamlessly on Android, iOS, and Web.

## Design Principles

- **Radix UI Principles**: Accessible, composable, consistent primitives
- **Figma-First**: Design tokens match Figma specifications
- **Platform Agnostic**: Single codebase for mobile and web
- **Accessibility First**: WCAG-compliant touch targets and keyboard navigation
- **Type Safe**: Full TypeScript support with exported types

## Components

### Button

A versatile button component with multiple variants and states.

```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" onPress={handlePress}>
  Book Now
</Button>

// Secondary button with loading state
<Button variant="secondary" loading={isLoading} onPress={handleSubmit}>
  Submit
</Button>

// Outline button with icons
<Button 
  variant="outline" 
  leftIcon={<Icon name="calendar" />}
  rightIcon={<Icon name="arrow-right" />}
  onPress={handleDateSelect}
>
  Select Date
</Button>

// Ghost button (minimal style)
<Button variant="ghost" onPress={handleCancel}>
  Cancel
</Button>

// Full width button
<Button variant="primary" fullWidth onPress={handleCheckout}>
  Proceed to Checkout
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `disabled`: `boolean` (default: `false`)
- `loading`: `boolean` (default: `false`)
- `fullWidth`: `boolean` (default: `false`)
- `leftIcon`: `React.ReactNode`
- `rightIcon`: `React.ReactNode`

### Input

A text input component with label, helper text, and error states.

```tsx
import { Input } from '@/components/ui';

// Basic input
<Input
  label="Email"
  placeholder="Enter your email"
  keyboardType="email-address"
  autoCapitalize="none"
/>

// Input with helper text
<Input
  label="Password"
  placeholder="Enter password"
  secureTextEntry
  helperText="Must be at least 8 characters"
/>

// Input with error
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error="Please enter a valid email address"
/>

// Input with icons
<Input
  label="Search"
  leftIcon={<Icon name="search" />}
  rightIcon={<Icon name="clear" onPress={handleClear} />}
  placeholder="Search resorts..."
/>

// Required input
<Input
  label="Full Name"
  required
  value={name}
  onChangeText={setName}
/>
```

**Props:**
- `label`: `string`
- `helperText`: `string`
- `error`: `string` (overrides helperText)
- `variant`: `'default' | 'error' | 'success'` (default: `'default'`)
- `leftIcon`: `React.ReactNode`
- `rightIcon`: `React.ReactNode`
- `required`: `boolean` (default: `false`)
- All standard `TextInput` props are supported

### Card

A container component for grouping related content.

```tsx
import { Card, Text } from '@/components/ui';

// Default card
<Card>
  <Text variant="h3">Resort Name</Text>
  <Text>Beautiful beachfront resort</Text>
</Card>

// Elevated card (with shadow)
<Card variant="elevated">
  <Text variant="h4">Special Offer</Text>
  <Text>Book now and save 20%</Text>
</Card>

// Outlined card
<Card variant="outlined">
  <Text>Card content</Text>
</Card>

// Pressable card
<Card 
  variant="elevated" 
  pressable 
  onPress={handleCardPress}
  accessibilityLabel="View resort details"
>
  <Text variant="h3">Resort Details</Text>
</Card>
```

**Props:**
- `variant`: `'default' | 'elevated' | 'outlined'` (default: `'default'`)
- `pressable`: `boolean` (default: `false`)
- `onPress`: `() => void` (requires `pressable={true}`)
- `padding`: `number` (override default padding)
- `borderRadius`: `number` (override default radius)
- `fullWidth`: `boolean` (default: `false`)

### Text

An enhanced text component with typography variants and semantic colors.

```tsx
import { Text } from '@/components/ui';

// Heading variants
<Text variant="h1">Welcome</Text>
<Text variant="h2">Resort Booking</Text>
<Text variant="h3">Available Rooms</Text>

// Body text
<Text variant="body">This is body text</Text>

// Caption text
<Text variant="caption" color="secondary">
  Last updated 2 hours ago
</Text>

// Label text
<Text variant="label">Room Type</Text>

// Custom styling
<Text 
  variant="body" 
  size="lg" 
  weight="semibold" 
  color="primary"
  align="center"
>
  Custom styled text
</Text>

// Truncated text
<Text variant="body" numberOfLines={2}>
  Long text that will be truncated after 2 lines...
</Text>
```

**Props:**
- `variant`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'label'` (default: `'body'`)
- `color`: `'primary' | 'secondary' | 'tertiary' | 'inverse' | 'error' | 'success' | 'warning'` (default: `'primary'`)
- `size`: Font size key (overrides variant default)
- `weight`: `'regular' | 'medium' | 'semibold' | 'bold'`
- `bold`: `boolean` (shorthand for bold weight)
- `semibold`: `boolean` (shorthand for semibold weight)
- `align`: `'left' | 'center' | 'right' | 'justify'`
- `numberOfLines`: `number` (truncates with ellipsis)
- All standard `Text` props are supported

### IconButton

An icon-only button with accessible touch targets.

```tsx
import { IconButton } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

// Ghost variant (minimal)
<IconButton
  icon={<Ionicons name="heart" size={24} />}
  variant="ghost"
  accessibilityLabel="Add to favorites"
  onPress={handleFavorite}
/>

// Primary variant
<IconButton
  icon={<Ionicons name="share" size={24} />}
  variant="primary"
  accessibilityLabel="Share"
  onPress={handleShare}
/>

// Outline variant
<IconButton
  icon={<Ionicons name="close" size={24} />}
  variant="outline"
  size="sm"
  accessibilityLabel="Close"
  onPress={handleClose}
/>

// With loading state
<IconButton
  icon={<Ionicons name="refresh" size={24} />}
  variant="secondary"
  loading={isRefreshing}
  accessibilityLabel="Refresh"
  onPress={handleRefresh}
/>
```

**Props:**
- `icon`: `React.ReactNode` (required)
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost'` (default: `'ghost'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `disabled`: `boolean` (default: `false`)
- `loading`: `boolean` (default: `false`)
- `accessibilityLabel`: `string` (required)
- `iconColor`: `string` (override icon color)

### Divider

A simple divider/separator component.

```tsx
import { Divider } from '@/components/ui';

// Horizontal divider
<Divider />

// With custom spacing
<Divider spacing={24} />

// Vertical divider
<View style={{ flexDirection: 'row', height: 100 }}>
  <Text>Left</Text>
  <Divider orientation="vertical" horizontalSpacing={16} />
  <Text>Right</Text>
</View>

// Custom thickness and color
<Divider thickness={2} color="#e5e5e5" spacing={16} />
```

**Props:**
- `orientation`: `'horizontal' | 'vertical'` (default: `'horizontal'`)
- `thickness`: `number` (default: `1`)
- `spacing`: `number` (margin on both sides)
- `verticalSpacing`: `number` (for horizontal dividers)
- `horizontalSpacing`: `number` (for vertical dividers)
- `color`: `string` (override default color)
- `fullLength`: `boolean` (default: `true`)

## Design System

All components use design tokens from `@/constants/DesignSystem`. Update these values to match your Figma specifications:

- **Colors**: Primary, neutral, semantic (error, success, warning)
- **Typography**: Font sizes, line heights, weights
- **Spacing**: Consistent 4px-based scale
- **Radius**: Border radius scale
- **Shadows**: Elevation system for cards

## Customization

### Updating Design Tokens

Edit `/constants/DesignSystem.ts` to match your Figma design system:

```tsx
// Update colors to match Figma
export const colors = {
  primary: {
    500: '#your-primary-color',
    // ...
  },
  // ...
};

// Update spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  // ...
};
```

### Theming

Components automatically adapt to light/dark mode using the `useColorScheme` hook. The design system includes semantic color mappings for both themes.

## Accessibility

All components follow accessibility best practices:

- **Touch Targets**: Minimum 44x44px (iOS/Android guidelines)
- **Keyboard Navigation**: Full support on web (Enter/Space keys)
- **Screen Readers**: Proper accessibility labels and roles
- **Color Contrast**: Meets WCAG AA standards
- **Focus States**: Visible focus indicators on web

## Platform Support

- ✅ Android
- ✅ iOS
- ✅ Web (React Native Web)

All components use React Native primitives only and work seamlessly across all platforms.

## Best Practices

1. **Always provide accessibility labels** for icon-only buttons
2. **Use semantic variants** (error, success) for better UX
3. **Leverage the design system** - don't hardcode colors/spacing
4. **Keep components composable** - combine simple components for complex UIs
5. **Test on all platforms** - especially touch targets on mobile

## Examples

See the component files for detailed implementation examples and TypeScript types.
