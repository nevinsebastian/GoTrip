# Base UI Components

This directory contains the base component library extracted directly from the Figma Login and Signup screens.

## Components

### Text
Typography component with variants matching the design system.

```tsx
import { Text, Heading1, Body, Caption } from '@/components/ui';

<Heading1>Welcome Back..</Heading1>
<Body color="secondary">Enter your Phone number.</Body>
<Caption color="caption">You'll get OTP to this number.</Caption>
```

**Variants:**
- `heading1` - 24px, semibold
- `heading2` - 20px, semibold
- `header` - 18px, medium
- `body` - 16px, regular
- `bodyMedium` - 14px, medium
- `bodySemibold` - 16px, medium
- `caption` - 12px, regular

### Button
Button component with primary and outline variants.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" onPress={handleSubmit}>
  Get OTP
</Button>

<Button variant="outline" onPress={handleSocialLogin}>
  Continue with Google
</Button>
```

**Variants:**
- `primary` - Solid red background, white text
- `outline` - White background, red text, red border

**Props:**
- `loading` - Shows loading spinner
- `disabled` - Disables button interaction
- `size` - `default` (48px) or `large` (56px)

### Input
Text input component matching the design system.

```tsx
import { Input } from '@/components/ui';

<Input 
  placeholder="Phone number"
  keyboardType="phone-pad"
/>
```

**Props:**
- `error` - Shows error state with red border
- Standard React Native `TextInput` props

### Card
Container component for main content areas.

```tsx
import { Card } from '@/components/ui';

<Card>
  {/* Your content */}
</Card>
```

**Padding Options:**
- `default` - 24px horizontal, 32px vertical
- `small` - 16px horizontal, 24px vertical
- `large` - 32px horizontal, 40px vertical
- `none` - No padding

### IconButton
Icon button for navigation and actions.

```tsx
import { IconButton } from '@/components/ui';

<IconButton 
  icon="arrow-back" 
  onPress={handleBack}
/>
```

### Divider
Horizontal divider with optional text.

```tsx
import { Divider } from '@/components/ui';

<Divider text="OR" />
```

## Design Tokens

All design tokens are available from `@/constants/DesignTokens`:

```tsx
import { colors, spacing, borderRadius, typography } from '@/constants/DesignTokens';

// Use tokens directly
<View style={{ padding: spacing.md, backgroundColor: colors.primary }}>
  <Text style={{ fontSize: typography.fontSize['3'] }}>Hello</Text>
</View>
```

## Responsive Design

Components are built with flexible layouts and will adapt to different screen sizes. For responsive behavior, use the breakpoints from `DesignTokens`:

```tsx
import { breakpoints } from '@/constants/DesignTokens';
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();
const isTablet = width >= breakpoints.tablet;
```

## Platform Compatibility

All components are built with React Native primitives and work on:
- ✅ iOS
- ✅ Android  
- ✅ Web (React Native Web)

## Accessibility

Components follow React Native accessibility best practices:
- Touch targets meet minimum 44x44px requirement
- Proper semantic roles where applicable
- Support for accessibility labels
