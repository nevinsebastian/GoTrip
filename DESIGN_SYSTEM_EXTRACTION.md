# Design System Extraction Summary

This document summarizes the design tokens and components extracted from the Figma Login and Signup screens.

## Source Screens
- **Login Screen**: `node-id=1-14332`
- **Signup Screen**: `node-id=1-14735`
- **Figma File**: `hsn4nbKaorw5j2c6Z314Nh`

## Extracted Design Tokens

### Colors

#### Primary Brand Color
- **Primary Red/Orange**: `#FF5C37` (Login screen) / `#EB5757` (Signup screen)
- Used for: Headers, logo, button borders, social button text, back arrow icons

#### Text Colors
- **Primary Text**: `#1c2024` - Dark gray/black for headings
- **Secondary Text**: `#4B5563` - Medium gray for body text
- **Caption Text**: `#828282` - Lighter gray for captions
- **Placeholder Text**: `#BDBDBD` - Light gray for input placeholders

#### Surface Colors
- **White**: `#FFFFFF` - Card backgrounds, input backgrounds
- **Screen Background**: `#F8F8F8` / `#F2F2F2` - Very light gray

#### Border Colors
- **Light Border**: `#E0E0E0` - Input borders, divider lines
- **Primary Border**: `rgba(235, 87, 87, 0.4)` - Light red border for social buttons

### Typography

#### Font Family
- **Primary**: `poppins` (from Figma variable: `Typography/Font family/text`)

#### Font Sizes (from Figma variables)
- **12px** (`Typography/Font size/1`) - Caption text
- **14px** (`Typography/Font size/2`) - Body medium text
- **16px** (`Typography/Font size/3`) - Body text, input placeholders, button text
- **18px** (estimated) - Header titles
- **20px** (estimated) - Heading 2
- **24px** (estimated) - Heading 1

#### Font Weights
- **Regular**: `400` (`Typography/Font weight/regular`)
- **Medium**: `500` (`Typography/Font weight/medium`)
- **Semibold**: `600`
- **Bold**: `700`

#### Line Heights (from Figma variables)
- **16px** (`Typography/Line height/1`) - For 12px font
- **20px** (`Typography/Line height/2`) - For 14px font
- **24px** (`Typography/Line height/3`) - For 16px font

### Spacing (from Figma variables)

- **4px** (`Spacing/1`) - Extra extra small
- **8px** (`Spacing/2`) - Extra small
- **12px** (`Spacing/3`) - Small
- **16px** (`Spacing/4`) - Medium
- **24px** (`Spacing/5`) - Large
- **32px** (`Spacing/6`) - Extra large
- **40px** (`Spacing/7`) - Extra extra large
- **48px** (`Spacing/8`) - Extra extra extra large

### Border Radius (from Figma variables)

- **4px** (`Radius/2-max`) - Small
- **6px** (`Radius/3-max`) - Medium
- **8px** (estimated) - Input/button radius
- **12px** (`Radius/5`) - Large
- **16px** (`Radius/6`) - Extra large
- **20px** (estimated) - Card radius
- **24px** (estimated) - Card radius (alternative)

### Shadows

- **Card Shadow**: Subtle drop shadow with `shadowOpacity: 0.05`, `shadowRadius: 8`
- **Button Shadow**: More prominent with `shadowOpacity: 0.1`, `shadowRadius: 4`

## Extracted Components

### 1. Text Component
**Variants extracted from screens:**
- `heading1` - "Welcome Back..", "Welcome to gotripholiday" (24px, semibold)
- `heading2` - Medium headings (20px, semibold)
- `header` - "Log in", "Sign up" (18px, medium)
- `body` - Input placeholders, button text (16px, regular)
- `bodyMedium` - "Enter your Phone number." (14px, medium)
- `bodySemibold` - Button text (16px, medium)
- `caption` - "You'll get OTP...", "OR" (12px, regular)

### 2. Button Component
**Variants extracted from screens:**
- `primary` - "Get OTP" button (solid red background, white text)
  - Note: Login screen shows gray gradient (possibly disabled state)
  - Signup screen shows solid red (active state)
- `outline` - Social login buttons ("Log in with mail", "Continue with Google", etc.)
  - White background, red text, light red border

**States:**
- Default, Pressed, Disabled, Loading (assumed - not visible in static designs)

### 3. Input Component
**Extracted from:**
- "Phone number" field (Login)
- "Full name", "E mail", "Phone number" fields (Signup)

**Styling:**
- White background
- Light gray border (1px)
- Rounded corners (8-12px)
- Height: 48px
- Placeholder text in light gray

### 4. Card Component
**Extracted from:**
- Main content container in both screens

**Styling:**
- White background
- Large border radius (20-24px)
- Subtle drop shadow
- Padding: 24px horizontal, 32px vertical

### 5. IconButton Component
**Extracted from:**
- Back arrow in header

**Styling:**
- Primary brand color
- Touch-friendly size (44x44px minimum)

### 6. Divider Component
**Extracted from:**
- "OR" separator between form and social login buttons

**Styling:**
- Horizontal line with centered text
- Light gray line color
- Caption text style

## Assumptions Made

### States Not Visible in Static Designs
1. **Button States**: 
   - Hover state (web only) - assumed opacity change
   - Disabled state - implemented as gray background with reduced opacity
   - Loading state - added ActivityIndicator

2. **Input States**:
   - Focus state - not visible, using error prop for validation
   - Error state - added error prop with red border

3. **Responsive Behavior**:
   - Components use flexible layouts
   - No fixed widths (except minimum touch targets)
   - Breakpoints defined but not yet implemented in components

### Design Inconsistencies Noted
1. **Primary Button Color**: 
   - Login screen shows gray gradient for "Get OTP"
   - Signup screen shows solid red
   - **Decision**: Implemented solid red as primary, gray as disabled

2. **Primary Color Variation**:
   - Login: `#FF5C37`
   - Signup: `#EB5757`
   - **Decision**: Using `#FF5C37` as primary, with `#EB5757` as alternative

## File Structure

```
constants/
  └── DesignTokens.ts    # All design tokens extracted from Figma

components/ui/
  ├── index.ts           # Component exports
  ├── Text.tsx           # Text component with variants
  ├── Button.tsx         # Button component (primary, outline)
  ├── Input.tsx          # Input component
  ├── Card.tsx           # Card container component
  ├── IconButton.tsx     # Icon button component
  └── Divider.tsx        # Divider with text component
```

## Usage Example

```tsx
import { Card, Text, Input, Button, Divider } from '@/components/ui';

export default function LoginScreen() {
  return (
    <Card>
      <Text variant="heading1">Welcome Back..</Text>
      <Text variant="bodyMedium" color="secondary">
        Enter your Phone number.
      </Text>
      <Input placeholder="Phone number" />
      <Text variant="caption" color="caption">
        You'll get OTP to this number.
      </Text>
      <Button variant="primary">Get OTP</Button>
      <Divider />
      <Button variant="outline">Log in with mail</Button>
    </Card>
  );
}
```

## Next Steps

1. **Test Components**: Verify components match Figma designs visually
2. **Add Responsive Behavior**: Implement breakpoint-based styling
3. **Add Missing States**: Implement hover, focus, and other interactive states
4. **Font Loading**: Ensure Poppins font is loaded correctly
5. **Accessibility**: Add proper accessibility labels and roles
6. **Component Variants**: Add any additional variants found in other screens
