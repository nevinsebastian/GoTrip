# Extracted Design Tokens from Figma Screens

This document lists all design token values extracted directly from the Figma Login and Signup screens before component generation.

## Colors

### Primary Brand Color
- **Login Screen**: `#FF5C37` (reddish-orange)
- **Signup Screen**: `#EB5757` (red)
- **Usage**: Headers, logo, button borders, social button text, back arrow icons
- **Decision**: Using `#FF5C37` as primary, `#EB5757` as alternative

### Text Colors
- **Primary Text**: `#1c2024` (from Figma variable `Tokens/Colors/text`)
  - Used for: Headings like "Welcome Back..", "Welcome to gotripholiday"
- **Secondary Text**: `#4B5563` (estimated from screens)
  - Used for: Body text like "Enter your Phone number."
- **Caption Text**: `#828282` (estimated from screens)
  - Used for: "You'll get OTP to this number.", "OR" text
- **Placeholder Text**: `#BDBDBD` (estimated from screens)
  - Used for: Input field placeholders

### Surface Colors
- **White**: `#FFFFFF`
  - Used for: Card backgrounds, input backgrounds, button backgrounds
- **Card Surface**: `#ffffffe5` (from Figma variable `Tokens/Colors/surface`)
- **Screen Background**: `#F8F8F8` (Login) / `#F2F2F2` (Signup)
  - Very light gray background outside the main card

### Border Colors
- **Light Border**: `#E0E0E0` (estimated from screens)
  - Used for: Input field borders, divider lines
- **Primary Border**: `rgba(235, 87, 87, 0.4)` (estimated from screens)
  - Used for: Social login button borders

### Neutral Colors (from Figma variables)
- **Neutral/9**: `#8b8d98`
- **Neutral/11**: `#60646c`
- **Neutral Alpha/2**: `#00005506`
- **Neutral Alpha/3**: `#0000330f`
- **Neutral Alpha/4**: `#00002d17`
- **Neutral Alpha/5**: `#0009321f`
- **Neutral Alpha/6**: `#00002f26`
- **Neutral Alpha/9**: `#00051d74`

### Accent Colors (from Figma variables)
- **Accent/9**: `#e54d2e`
- **Accent Contrast**: `#ffffff`
- **Accent Surface**: `#ff200008`
- **Accent Alpha/7**: `#e7280067`
- **Accent Alpha/10**: `#d72400da`
- **Accent Alpha/11**: `#cd2200ea`

## Typography

### Font Family
- **Primary**: `poppins` (from Figma variable `Typography/Font family/text`)
- **Fallback**: System fonts for web compatibility

### Font Sizes (from Figma variables)
- **12px** (`Typography/Font size/1`) - Caption text
- **14px** (`Typography/Font size/2`) - Body medium text
- **16px** (`Typography/Font size/3`) - Body text, input placeholders, button text
- **18px** (estimated from screens) - Header titles ("Log in", "Sign up")
- **20px** (estimated from screens) - Heading 2
- **24px** (estimated from screens) - Heading 1 ("Welcome Back..", "Welcome to gotripholiday")

### Font Weights (from Figma variables)
- **Regular**: `400` (`Typography/Font weight/regular`)
- **Medium**: `500` (`Typography/Font weight/medium`)
- **Semibold**: `600` (estimated from screens)
- **Bold**: `700` (estimated from screens)

### Line Heights (from Figma variables)
- **16px** (`Typography/Line height/1`) - For 12px font
- **20px** (`Typography/Line height/2`) - For 14px font
- **24px** (`Typography/Line height/3`) - For 16px font
- **28px** (estimated) - For 20px font
- **32px** (estimated) - For 24px font

### Letter Spacing (from Figma variables)
- **0.04** (`Typography/Letter spacing/1`) - For 12px font
- **0** (`Typography/Letter spacing/2`) - For 14px font
- **0** (`Typography/Letter spacing/3`) - For 16px font

### Typography Styles (pre-composed from Figma)
- **Typography/1/Regular**: 12px, 400, 16px line height, 0.04 letter spacing
- **Typography/2/Medium**: 14px, 500, 20px line height, 0 letter spacing
- **Typography/3/Regular**: 16px, 400, 24px line height, 0 letter spacing
- **Typography/3/Medium**: 16px, 500, 24px line height, 0 letter spacing

## Spacing (from Figma variables)

- **4px** (`Spacing/1`) - Extra extra small spacing
- **8px** (`Spacing/2`) - Extra small spacing
- **12px** (`Spacing/3`) - Small spacing
- **16px** (`Spacing/4`) - Medium spacing
- **24px** (`Spacing/5`) - Large spacing
- **32px** (`Spacing/6`) - Extra large spacing
- **40px** (`Spacing/7`) - Extra extra large spacing
- **48px** (`Spacing/8`) - Extra extra extra large spacing

### Spacing Usage in Screens
- **Between input fields**: 12-16px
- **Between social buttons**: 12-16px
- **Card internal padding**: 24px horizontal, 32px vertical
- **Around primary button**: 16-24px vertical
- **Around divider**: 16-24px vertical
- **Logo to welcome message**: 24-32px
- **Header to card**: 48px+ vertical

## Border Radius (from Figma variables)

- **4px** (`Radius/2-max`) - Small radius
- **6px** (`Radius/3-max`) - Medium radius
- **8px** (estimated from screens) - Input/button radius
- **12px** (`Radius/5`) - Large radius
- **16px** (`Radius/6`) - Extra large radius
- **20px** (estimated from screens) - Card radius
- **24px** (estimated from screens) - Card radius (alternative)

### Border Radius Usage
- **Input fields**: 8-12px
- **Buttons**: 8-12px
- **Main card**: 20-24px

## Shadows

### Card Shadow
- **Shadow Color**: `#000`
- **Shadow Offset**: `{ width: 0, height: 2 }`
- **Shadow Opacity**: `0.05` (subtle)
- **Shadow Radius**: `8px`
- **Elevation** (Android): `2`

### Button Shadow
- **Shadow Color**: `#000`
- **Shadow Offset**: `{ width: 0, height: 2 }`
- **Shadow Opacity**: `0.1` (more prominent)
- **Shadow Radius**: `4px`
- **Elevation** (Android): `3`

## Component Specifications

### Button
- **Height (default)**: 48px (estimated from screens, range 48-56px)
- **Height (large)**: 56px (estimated)
- **Height (small)**: 32px (from Figma variable `Tokens/Space/button-height-2`)
- **Padding Horizontal**: 16px
- **Padding Vertical**: 12px
- **Border Radius**: 8-12px

### Input
- **Height**: 48px (estimated from screens, range 48-56px)
- **Padding Horizontal**: 16px
- **Padding Vertical**: 12px
- **Border Width**: 1px
- **Border Radius**: 8-12px

### Card
- **Padding Horizontal**: 24px (estimated from screens)
- **Padding Vertical**: 32px (estimated from screens)
- **Border Radius**: 20-24px (estimated from screens)
- **Shadow**: Card shadow (subtle)

### Header
- **Height**: 56px (standard header height)
- **Padding Horizontal**: 16px

## Component Patterns Identified

### 1. Primary Button
- **Background**: Solid red (`#EB5757` in Signup, gray gradient in Login - possibly disabled)
- **Text**: White
- **Border Radius**: 8-12px
- **Height**: 48-56px
- **Example**: "Get OTP" button

### 2. Outline Button (Social Login)
- **Background**: White
- **Text**: Red (`#EB5757`)
- **Border**: 1px solid `rgba(235, 87, 87, 0.4)`
- **Border Radius**: 8-12px
- **Height**: 48-56px
- **Icon**: Left-aligned icon with text
- **Examples**: "Log in with mail", "Continue with Google", "Continue with Apple", "Continue with Facebook"

### 3. Input Field
- **Background**: White
- **Border**: 1px solid `#E0E0E0`
- **Border Radius**: 8-12px
- **Height**: 48px
- **Placeholder**: Light gray text
- **Examples**: "Phone number", "Full name", "E mail"

### 4. Card Container
- **Background**: White
- **Border Radius**: 20-24px
- **Shadow**: Subtle drop shadow
- **Padding**: 24px horizontal, 32px vertical

### 5. Text Variants
- **Heading 1**: 24px, semibold, dark gray - "Welcome Back..", "Welcome to gotripholiday"
- **Heading 2**: 20px, semibold (not seen in provided screens, estimated)
- **Header**: 18px, medium, red - "Log in", "Sign up"
- **Body**: 16px, regular, dark gray - Input placeholders, button text
- **Body Medium**: 14px, medium, medium gray - "Enter your Phone number."
- **Caption**: 12px, regular, light gray - "You'll get OTP...", "OR"

### 6. Divider
- **Line Color**: `#E0E0E0`
- **Text**: "OR" in caption style (12px, light gray)
- **Spacing**: 16-24px vertical margins

### 7. Icon Button
- **Color**: Primary red
- **Size**: 24px icon
- **Touch Target**: 44x44px minimum
- **Example**: Back arrow in header

## Assumptions and Decisions

### States Not Visible in Static Designs
1. **Button Disabled State**: Implemented as gray background (`#8b8d98`) with reduced opacity
2. **Button Loading State**: Added ActivityIndicator (not in designs)
3. **Button Hover State**: Assumed opacity change (web only)
4. **Input Focus State**: Not visible, using error prop for validation
5. **Input Error State**: Added red border (not in designs)

### Design Inconsistencies
1. **Primary Button**: 
   - Login shows gray gradient (possibly disabled)
   - Signup shows solid red
   - **Decision**: Solid red as active state, gray as disabled

2. **Primary Color**:
   - Login: `#FF5C37`
   - Signup: `#EB5757`
   - **Decision**: Using `#FF5C37` as primary

3. **Screen Background**:
   - Login: `#F8F8F8`
   - Signup: `#F2F2F2`
   - **Decision**: Using `#F8F8F8` as default

## Responsive Considerations

- Components use flexible layouts (no fixed widths except minimum touch targets)
- Breakpoints defined: mobile (0), tablet (768px), desktop (1024px)
- Components will adapt naturally to screen size using flexbox

## Accessibility

- Minimum touch target: 44x44px (iOS/Android guidelines)
- Button height: 48px (meets accessibility standards)
- Proper contrast ratios maintained for text on backgrounds
