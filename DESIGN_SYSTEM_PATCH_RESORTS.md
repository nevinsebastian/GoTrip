# Design System Patch: Resorts Screen Support

This document summarizes all additions made to the design system to support the Resorts screen.

**Date**: Based on Resorts screen analysis  
**Figma Node**: `1-14042`  
**Source**: Visual inspection and analysis of Resorts screen

---

## 1. Newly Added Design Tokens

### Colors

#### `colors.surface.lightPink`
- **Value**: `#FFF0F0`
- **Source**: Resorts screen visual inspection
- **Usage**: Notification button background, category icon backgrounds
- **Location**: `constants/DesignTokens.ts`

#### `colors.rating.star`
- **Value**: `#FFD700` (gold/yellow)
- **Source**: Standard convention (not explicitly in Figma)
- **Usage**: Filled star rating color
- **Note**: This is a standard color for star ratings, not explicitly shown in the static Figma design
- **Location**: `constants/DesignTokens.ts`

### Border Radius

#### `borderRadius.pill`
- **Value**: `9999`
- **Source**: Resorts screen requirement for selected nav item
- **Usage**: Selected bottom navigation item (pill-shaped background)
- **Location**: `constants/DesignTokens.ts`

### Typography Styles

All new typography styles use existing Figma font size variables and extend the weight/line height combinations:

#### `typography.styles.screenTitle`
- **Font Size**: `24px` (Typography/Font size/6)
- **Font Weight**: `700` (bold)
- **Line Height**: `32px`
- **Letter Spacing**: `0`
- **Source**: Resorts screen - "Resorts" header text
- **Usage**: Screen/page titles

#### `typography.styles.sectionTitle`
- **Font Size**: `18px` (Typography/Font size/4)
- **Font Weight**: `700` (bold)
- **Line Height**: `24px`
- **Letter Spacing**: `0`
- **Source**: Resorts screen - "Suggested for you", "Top rated stays" etc.
- **Usage**: Section headers

#### `typography.styles.price`
- **Font Size**: `14px` (Typography/Font size/2)
- **Font Weight**: `400` (regular)
- **Line Height**: `20px` (Typography/Line height/2)
- **Letter Spacing**: `0`
- **Source**: Resorts screen - "₹1199/night" text
- **Usage**: Price display text

#### `typography.styles.ratingValue`
- **Font Size**: `14px` (Typography/Font size/2)
- **Font Weight**: `400` (regular)
- **Line Height**: `20px` (Typography/Line height/2)
- **Letter Spacing**: `0`
- **Source**: Resorts screen - "4.5" rating value
- **Usage**: Rating value display

#### `typography.styles.link`
- **Font Size**: `16px` (Typography/Font size/3)
- **Font Weight**: `500` (medium)
- **Line Height**: `24px` (Typography/Line height/3)
- **Letter Spacing**: `0`
- **Source**: Resorts screen - "View all" link text
- **Usage**: Link text with primary color

### Component Specifications

#### `components.categoryItem`
- **iconSize**: `64px` (estimated from screen)
- **width**: `80px` (estimated from screen)
- **labelSpacing**: `8px` (spacing between icon and label)
- **Source**: Resorts screen visual inspection
- **Location**: `constants/DesignTokens.ts`

#### `components.resortCard`
- **width**: `300px` (estimated, range 280-320px)
- **imageAspectRatio**: `16 / 9` (estimated)
- **imageHeight**: `180px` (estimated)
- **contentPadding**: `16px`
- **favoriteIconSize**: `24px`
- **favoriteIconOffset**: `8px` (from top-right corner)
- **Source**: Resorts screen visual inspection
- **Location**: `constants/DesignTokens.ts`

#### `components.bottomNav`
- **height**: `64px` (estimated, range 60-70px)
- **itemSpacing**: `'equal'` (equal distribution)
- **selectedPillPadding**: `{ horizontal: 12, vertical: 8 }`
- **iconSize**: `24px`
- **textSize**: `14px` (for selected item label)
- **Source**: Resorts screen visual inspection
- **Location**: `constants/DesignTokens.ts`

#### `components.searchInput`
- **iconSize**: `20px`
- **iconPadding**: `16px` (from right edge)
- **Source**: Resorts screen visual inspection
- **Location**: `constants/DesignTokens.ts`

---

## 2. Newly Added Component Variants

### Text Component

#### New Variants Added:
- `screenTitle` - 24px, bold (700)
- `sectionTitle` - 18px, bold (700)
- `price` - 14px, regular (400)
- `ratingValue` - 14px, regular (400)
- `link` - 16px, medium (500)

**Type Update**: `TextProps.variant` now includes all new variants  
**Location**: `components/ui/Text.tsx`

### Button Component

#### New Variants Added:

##### `link`
- **Usage**: "View all" link in Resorts screen
- **Styling**: Transparent background, red text, optional right icon
- **Props**: `icon`, `iconPosition` ('left' | 'right')
- **Location**: `components/ui/Button.tsx`

##### `category`
- **Usage**: Category filter items (Budget, Private, Luxury, etc.)
- **Styling**: Vertical layout, icon/image on top, label below
- **Props**: `categoryIcon` (React.ReactNode for image/icon)
- **Location**: `components/ui/Button.tsx`

##### `navSelected`
- **Usage**: Selected "Home" nav item in bottom navigation
- **Styling**: Pill-shaped background (primary color), white icon + text
- **Props**: `icon` (required)
- **Location**: `components/ui/Button.tsx`

##### `navUnselected`
- **Usage**: Unselected nav items (Likes, Bookings, Profile)
- **Styling**: Icon only, no background, primary color
- **Props**: `icon` (required)
- **Location**: `components/ui/Button.tsx`

**Type Update**: `ButtonProps.variant` now includes: `'primary' | 'outline' | 'link' | 'category' | 'navSelected' | 'navUnselected'`  
**New Props**: `icon`, `iconPosition`, `categoryIcon`  
**Location**: `components/ui/Button.tsx`

### Input Component

#### New Variant Added:

##### `search`
- **Usage**: "Find resorts, rooms, etc.." search field
- **Styling**: More rounded corners (12px), search icon on right side
- **Props**: `variant='search'` or `showSearchIcon={true}`
- **Location**: `components/ui/Input.tsx`

**Type Update**: `InputProps.variant` now includes: `'default' | 'search'`  
**New Props**: `variant`, `showSearchIcon`  
**Location**: `components/ui/Input.tsx`

### Card Component

#### New Variant Added:

##### `listing`
- **Usage**: Resort listing cards in horizontal scroll
- **Styling**: 
  - Smaller border radius (12px vs 20px)
  - Fixed width (300px)
  - Less padding (16px)
  - Overflow hidden for image rounded corners
- **Props**: `variant='listing'`
- **Location**: `components/ui/Card.tsx`

**Type Update**: `CardProps.variant` now includes: `'default' | 'listing'`  
**Location**: `components/ui/Card.tsx`

---

## 3. New Base Utilities

### Image Component

#### New Component: `Image`
- **Purpose**: Wrapper for React Native Image with consistent styling variants
- **Location**: `components/ui/Image.tsx`
- **Exported**: `components/ui/index.ts`

#### Variants:
- `default` - Standard image
- `cardImage` - Resort card images with rounded top corners matching card radius
- `categoryIcon` - Square icon/image for category items with rounded corners

**Props**: `variant`, `containerStyle`, standard `ImageProps`  
**Location**: `components/ui/Image.tsx`

---

## 4. Updated Type Definitions

### DesignTokens.ts
- **No breaking changes** to existing types
- New token values added to existing objects
- New component specifications added

### Text.tsx
- `TextProps.variant` extended with: `'screenTitle' | 'sectionTitle' | 'price' | 'ratingValue' | 'link'`

### Button.tsx
- `ButtonProps.variant` extended with: `'link' | 'category' | 'navSelected' | 'navUnselected'`
- `ButtonProps` extended with: `icon?`, `iconPosition?`, `categoryIcon?`

### Input.tsx
- `InputProps` extended with: `variant?`, `showSearchIcon?`

### Card.tsx
- `CardProps` extended with: `variant?`

### Image.tsx (New)
- `ImageProps` interface created with: `variant?`, `containerStyle?`, standard `ImageProps`

---

## Summary

### Tokens Added
- ✅ 2 new colors (`surface.lightPink`, `rating.star`)
- ✅ 1 new border radius (`pill`)
- ✅ 5 new typography styles (`screenTitle`, `sectionTitle`, `price`, `ratingValue`, `link`)
- ✅ 4 new component specification objects (`categoryItem`, `resortCard`, `bottomNav`, `searchInput`)

### Component Variants Added
- ✅ 5 new Text variants
- ✅ 4 new Button variants
- ✅ 1 new Input variant
- ✅ 1 new Card variant

### New Components
- ✅ 1 new Image utility component

### Files Modified
1. `constants/DesignTokens.ts` - Added new tokens
2. `components/ui/Text.tsx` - Added new variants
3. `components/ui/Button.tsx` - Added new variants and props
4. `components/ui/Input.tsx` - Added search variant
5. `components/ui/Card.tsx` - Added listing variant
6. `components/ui/Image.tsx` - New component
7. `components/ui/index.ts` - Export new Image component

### Files Created
1. `components/ui/Image.tsx` - Image utility component

---

## Notes

### Values Marked as "Estimated"
Some values are marked as "estimated" because they were derived from visual inspection of the Resorts screen rather than explicit Figma variables:
- Category item dimensions (iconSize, width)
- Resort card dimensions (width, imageHeight, aspectRatio)
- Bottom nav height
- Search input icon size

These values should be verified against actual Figma measurements when available.

### Values Not in Figma
- `colors.rating.star` (`#FFD700`) - Standard convention for star ratings, not explicitly in the static Figma design

### Backward Compatibility
- ✅ All existing components and variants remain unchanged
- ✅ All new additions are additive (no breaking changes)
- ✅ Existing code using the design system will continue to work

---

## Usage Examples

### Text Variants
```tsx
<Text variant="screenTitle">Resorts</Text>
<Text variant="sectionTitle">Suggested for you</Text>
<Text variant="price">₹1199/night</Text>
<Text variant="ratingValue">4.5</Text>
<Text variant="link" color="primaryBrand">View all</Text>
```

### Button Variants
```tsx
<Button variant="link" icon="chevron-forward" iconPosition="right">
  View all
</Button>

<Button variant="category" categoryIcon={<Image source={...} variant="categoryIcon" />}>
  Budget
</Button>

<Button variant="navSelected" icon="home">
  Home
</Button>

<Button variant="navUnselected" icon="heart-outline" />
```

### Input Variant
```tsx
<Input 
  variant="search" 
  placeholder="Find resorts, rooms, etc.."
/>
```

### Card Variant
```tsx
<Card variant="listing">
  <Image source={...} variant="cardImage" />
  <Text variant="body">Luxury stay in Wayanad</Text>
</Card>
```

---

## Next Steps

1. **Verify Estimated Values**: When Figma MCP access is available, verify estimated dimensions against actual Figma values
2. **Test Components**: Verify all new variants render correctly on iOS, Android, and Web
3. **Build Composite Components**: Use these base components to build composite components (Bottom Nav, Section Header, Resort Card, Category Item)
4. **Build Resorts Screen**: Use the patched design system to build the Resorts screen
