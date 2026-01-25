# Resorts Screen Analysis

**Figma Node ID**: `1-14042`  
**Screen**: Resorts (Listing/Browse Screen)  
**Analysis Date**: Based on visual inspection and existing component library

---

## 1. All UI Elements Used on This Screen

### Header/Navigation Section
1. **Back Button** - Left-pointing chevron icon (`<`)
2. **Screen Title** - "Resorts" text (bold, red)
3. **Notification Button** - Bell icon (outlined, red) with light pink background

### Search Section
4. **Search Input Field** - Rounded rectangular container with:
   - White background
   - Light grey border
   - Placeholder text: "Find resorts, rooms, etc.."
   - Search icon (magnifying glass `Q`) on the right side

### Category Filter Section
5. **Category Items** (horizontally scrollable):
   - Category Icon - Square image with rounded corners (illustration: mountains/hills, trees, orange-pink gradient background)
   - Category Label - Text below icon ("Budget", "Private", "Luxury", "Beach", "Hill station")
   - Dark grey/black text, regular weight, centered

### Content Sections (Multiple)
6. **Section Header** (repeated for each section):
   - Section Title - "Suggested for you", "Top rated stays", "Budget options" (bold, dark grey/black)
   - "View all" Link - Red text with red right-pointing chevron icon (`>`)

7. **Resort Cards** (horizontally scrollable lists):
   - **Card Container** - White background, rounded corners, subtle shadow
   - **Card Image** - Photo of resort (top portion of card, rounded top corners)
   - **Favorite Icon** - Heart icon (outlined, red) in top-right corner of image
   - **Card Title** - "Luxury stay in Wayanad" (dark grey/black, regular weight)
   - **Card Price** - "₹1199/night" (dark grey/black, regular weight)
   - **Card Rating** - Star icon (outlined) + "4.5" text (dark grey/black, regular weight)

### Bottom Navigation Bar
8. **Bottom Nav Container** - White background, rounded bottom corners, subtle top border
9. **Bottom Nav Items**:
   - **Home** (Selected) - Orange-red pill background, white house icon, white "Home" text
   - **Likes** (Unselected) - Red heart icon (outline), no text
   - **Bookings** (Unselected) - Red document/calendar icon, no text
   - **Profile** (Unselected) - Red person icon (outline), no text
10. **iOS Home Indicator** - Thin grey line at bottom (system UI, not app component)

---

## 2. Mapping Elements to Existing Base Components

### ✅ Can Be Built with Existing Components

#### Button Component
- **Back Button** → `IconButton` (already exists) ✓
- **Notification Button** → `IconButton` (already exists) ✓
- **"View all" Link** → `Button` variant needed: `link` or `textLink` (with icon support) ⚠️
- **Category Items** → `Button` variant needed: `categoryPill` or custom variant ⚠️
- **Selected "Home" Nav Item** → `Button` variant needed: `navSelected` or `pill` ⚠️
- **Unselected Nav Icons** → `IconButton` (already exists) ✓

#### Card Component
- **Resort Card Container** → `Card` component ✓
  - Note: May need variant for `resortListing` with different padding/image handling

#### Text Component
- **Screen Title "Resorts"** → `Text` variant: `heading1` or new `screenTitle` (24px, bold) ⚠️
- **Section Titles** → `Text` variant: `heading2` (18px, bold) - may need adjustment ⚠️
- **Category Labels** → `Text` variant: `caption` (12px) or new `labelSmall` ⚠️
- **Card Title** → `Text` variant: `body` (16px) or new `cardTitle` ⚠️
- **Card Price** → `Text` variant: `body` (14px) or new `price` ⚠️
- **Card Rating Value** → `Text` variant: `body` (14px) or new `ratingValue` ⚠️
- **"View all" Link Text** → `Text` variant: `body` with `primaryBrand` color ✓
- **Selected "Home" Label** → `Text` variant: `body` with white color ✓

#### Input Component
- **Search Input Field** → `Input` component ✓
  - May need variant: `search` with icon support ⚠️

#### IconButton Component
- **Back Button** → `IconButton` ✓
- **Notification Button** → `IconButton` ✓
- **Favorite Icon (on card)** → `IconButton` ✓
- **Unselected Nav Icons** → `IconButton` ✓

#### Divider Component
- **Bottom Nav Top Border** → `Divider` variant: `subtle` or `border` ⚠️

---

## 3. Elements That CANNOT Be Built with Current Components/Tokens

### Missing Component Types

1. **Image Component**
   - While `Card` can contain images, there's no standardized `Image` component wrapper
   - Resort card images need specific styling (rounded top corners matching card radius)
   - Category icon images need square aspect ratio with rounded corners

2. **Icon Component/System**
   - No centralized icon management system
   - Icons referenced: chevron, bell, magnifying glass, star, heart, home, document, person, mountain illustration
   - Currently using `@expo/vector-icons` (Ionicons) but need consistent icon system
   - Star icon may need filled variant for ratings

3. **Horizontal ScrollView Wrapper**
   - Not a base component, but layout pattern needed for:
     - Category items horizontal scroll
     - Resort cards horizontal scroll
   - Would be handled by `ScrollView` primitive with styling

4. **Bottom Navigation Bar Component**
   - Complete navigation bar with:
     - Selected/unselected states
     - Pill background for selected item
     - Icon + text combination
     - Rounded bottom corners
   - This is a composite component, not a base component

5. **Section Header Component**
   - Composite component combining:
     - Section title (left)
     - "View all" link with icon (right)
     - Horizontal layout with space-between

6. **Resort Card Component**
   - Composite component combining:
     - Image with favorite icon overlay
     - Text content (title, price, rating)
     - Specific layout and spacing

7. **Category Item Component**
   - Composite component combining:
     - Square image/icon
     - Label text below
     - Specific spacing and layout

8. **Platform-Specific UI**
   - iOS Home Indicator (system UI, not app component)

---

## 4. Missing Tokens or Variants

### Colors

#### Missing Colors (from Resorts screen)
- **Light Pink/Orange Background**: `#FFF0F0` or similar
  - Used for: Notification button background, category icon backgrounds
  - **Current**: Not in tokens
  - **Needed**: `colors.surface.lightPink` or `colors.background.lightPink`

- **Star Rating Color**: Yellow/gold (for filled stars)
  - **Current**: Not in tokens
  - **Needed**: `colors.rating.star` or `colors.accent.yellow`

- **Selected Nav Background**: Orange-red pill color
  - Appears to be primary color variant
  - **Current**: `colors.primary` exists but may need specific variant
  - **Needed**: Confirm if `colors.primary` matches or needs `colors.nav.selected`

#### Existing Colors That Work
- ✅ `colors.primary` - Red for icons, text, selected states
- ✅ `colors.text.primary` - Dark grey for titles, card text
- ✅ `colors.text.secondary` - Medium grey (may work for some text)
- ✅ `colors.text.caption` - Light grey for labels
- ✅ `colors.surface.white` - White backgrounds
- ✅ `colors.border.light` - Light grey borders

### Typography

#### Missing Font Sizes
- **Screen Title**: 24px, bold
  - **Current**: `typography.fontSize['6']` = 24px exists
  - **Current**: `typography.styles.heading1` = 24px, semibold (600)
  - **Needed**: Variant with bold (700) weight, or confirm if semibold is sufficient

- **Section Title**: 18px, bold
  - **Current**: `typography.fontSize['4']` = 18px exists
  - **Current**: `typography.styles.header` = 18px, medium (500)
  - **Needed**: Variant with bold (700) weight, or new `sectionTitle` style

- **Card Title**: 16px, regular
  - **Current**: `typography.styles.body` = 16px, regular (400) ✓
  - **Status**: Exists, may need semantic name `cardTitle`

- **Price Text**: 14px, regular
  - **Current**: `typography.styles.bodyMedium` = 14px, medium (500)
  - **Needed**: 14px, regular (400) variant, or new `price` style

- **Rating Value**: 14px, regular
  - **Current**: `typography.styles.bodyMedium` = 14px, medium (500)
  - **Needed**: 14px, regular (400) variant, or new `ratingValue` style

- **Category Label**: 12px, regular
  - **Current**: `typography.styles.caption` = 12px, regular (400) ✓
  - **Status**: Exists, may need semantic name `labelSmall`

#### Missing Typography Variants
- `screenTitle` - 24px, bold (700)
- `sectionTitle` - 18px, bold (700)
- `cardTitle` - 16px, regular (400) - semantic alias
- `price` - 14px, regular (400)
- `ratingValue` - 14px, regular (400)
- `labelSmall` - 12px, regular (400) - semantic alias
- `link` - 16px, medium (500) with primary color

### Spacing

#### Existing Spacing (from DesignTokens.ts)
- ✅ `spacing['1']` = 4px
- ✅ `spacing['2']` = 8px
- ✅ `spacing['3']` = 12px
- ✅ `spacing['4']` = 16px
- ✅ `spacing['5']` = 24px
- ✅ `spacing['6']` = 32px
- ✅ `spacing['7']` = 40px
- ✅ `spacing['8']` = 48px

#### Spacing Usage on Resorts Screen
- **Between category items**: ~12-16px horizontal
- **Between resort cards**: ~12-16px horizontal
- **Card internal padding**: ~16px (estimated)
- **Section vertical spacing**: ~24-32px
- **Header padding**: ~16px horizontal
- **Search input padding**: ~16px horizontal

**Status**: ✅ Current spacing scale appears sufficient. All needed values exist.

### Border Radius

#### Existing Border Radius (from DesignTokens.ts)
- ✅ `borderRadius['2']` = 4px
- ✅ `borderRadius['3']` = 6px
- ✅ `borderRadius.lg` = 8px (estimated)
- ✅ `borderRadius.xl` = 12px
- ✅ `borderRadius['2xl']` = 16px
- ✅ `borderRadius['3xl']` = 20px
- ✅ `borderRadius['4xl']` = 24px

#### Border Radius Usage on Resorts Screen
- **Search Input**: ~12px (large rounded corners)
  - **Current**: `borderRadius.lg` = 8px or `borderRadius.xl` = 12px ✓
- **Category Icons**: ~8px (moderate rounding)
  - **Current**: `borderRadius.lg` = 8px ✓
- **Resort Cards**: ~8-12px (moderate rounding)
  - **Current**: `borderRadius.lg` = 8px or `borderRadius.xl` = 12px ✓
- **Notification Button**: ~8px (slight rounding)
  - **Current**: `borderRadius.lg` = 8px ✓
- **Bottom Nav**: Rounded bottom corners ~8-12px
  - **Current**: `borderRadius.lg` = 8px or `borderRadius.xl` = 12px ✓
- **Selected Nav Item (Pill)**: Full pill shape (9999px or very large radius)
  - **Current**: Not in tokens
  - **Needed**: `borderRadius.pill` = 9999px or `borderRadius.full`

**Status**: ⚠️ Need to add `borderRadius.pill` for selected nav item.

### Shadows

#### Existing Shadows (from DesignTokens.ts)
- ✅ `shadows.card` - Subtle shadow for cards
- ✅ `shadows.button` - More prominent shadow for buttons

#### Shadow Usage on Resorts Screen
- **Resort Cards**: Subtle shadow (matches `shadows.card`) ✓
- **Bottom Nav**: Subtle shadow or border (may need `shadows.nav` or use border)
  - **Current**: Could use border or add `shadows.nav`

**Status**: ✅ Current shadows sufficient, may add `shadows.nav` for bottom nav.

### Button Variants

#### Existing Button Variants
- ✅ `primary` - Solid red background, white text
- ✅ `outline` - White background, red text, red border

#### Missing Button Variants (from Resorts screen)
- **`link` or `textLink`** - Red text, optional icon
  - Used for: "View all" link
  - **Needed**: `Button` variant `link` with:
    - Transparent background
    - Red text
    - Optional right icon support
    - No border, no padding (or minimal)

- **`categoryPill` or `category`** - Icon/image + text below
  - Used for: Category filter items
  - **Needed**: `Button` variant `category` with:
    - Square icon/image area (top)
    - Label text below (centered)
    - Vertical layout
    - Light background (optional)
    - Specific dimensions

- **`navSelected` or `pill`** - Pill background, white icon/text
  - Used for: Selected "Home" nav item
  - **Needed**: `Button` variant `navSelected` with:
    - Pill-shaped background (full border radius)
    - Primary color background
    - White icon and text
    - Horizontal layout (icon + text)

- **`navUnselected`** - Icon only, no background
  - Used for: Unselected nav items
  - **Needed**: `Button` variant `navUnselected` or use `IconButton`
  - Could be handled by `IconButton` component

### Input Variants

#### Existing Input
- ✅ Standard input with white background, border, rounded corners

#### Missing Input Variants
- **`search`** - Search input with icon
  - Used for: "Find resorts, rooms, etc.." search field
  - **Needed**: `Input` variant `search` with:
    - Search icon on right side
    - Possibly different border radius (more rounded)
    - Icon support/prop

### Card Variants

#### Existing Card
- ✅ Standard card with white background, shadow, padding options

#### Missing Card Variants
- **`resortListing` or `listing`** - Card for resort listings
  - Used for: Resort cards in horizontal scroll
  - **Needed**: `Card` variant `listing` with:
    - Image support (top portion)
    - Rounded top corners on image
    - Different padding (less padding, more image-focused)
    - Fixed or aspect ratio dimensions
    - Favorite icon overlay support

### Text Variants

#### Existing Text Variants
- ✅ `heading1` - 24px, semibold
- ✅ `heading2` - 20px, semibold
- ✅ `header` - 18px, medium
- ✅ `body` - 16px, regular
- ✅ `bodyMedium` - 14px, medium
- ✅ `bodySemibold` - 16px, medium
- ✅ `caption` - 12px, regular

#### Missing Text Variants (Semantic Names)
- **`screenTitle`** - 24px, bold (700) - for "Resorts" header
- **`sectionTitle`** - 18px, bold (700) - for "Suggested for you" etc.
- **`cardTitle`** - 16px, regular (400) - semantic alias for body
- **`price`** - 14px, regular (400) - for "₹1199/night"
- **`ratingValue`** - 14px, regular (400) - for "4.5"
- **`labelSmall`** - 12px, regular (400) - semantic alias for caption
- **`link`** - 16px, medium (500), primary color - for "View all"

### Component-Specific Tokens

#### Missing Component Specs
- **Category Item**:
  - Icon size: ~64x64px (estimated)
  - Label spacing: ~8px below icon
  - Item width: ~80-100px (estimated)

- **Resort Card**:
  - Card width: ~280-320px (estimated, for horizontal scroll)
  - Image aspect ratio: ~16:9 or 4:3 (estimated)
  - Image height: ~180-200px (estimated)
  - Content padding: ~16px
  - Favorite icon size: ~24px
  - Favorite icon position: top-right, ~8px from edges

- **Bottom Nav**:
  - Nav height: ~60-70px (estimated)
  - Item spacing: Equal distribution
  - Selected pill padding: ~12px horizontal, ~8px vertical
  - Icon size: ~24px
  - Text size: ~14px (for selected item)

- **Search Input**:
  - Height: ~48-56px (matches existing input)
  - Icon size: ~20-24px
  - Icon padding: ~16px from right edge

---

## 5. Responsive Behavior Assessment

### Current Token Sufficiency for Responsiveness

#### ✅ Sufficient Aspects

1. **Spacing Scale**
   - Well-defined spacing scale (4px to 48px) allows for consistent scaling
   - Values can be used with relative units or flex layouts
   - **Status**: ✅ Sufficient

2. **Typography Scale**
   - Font sizes defined (12px to 24px)
   - Can be scaled using responsive breakpoints
   - **Status**: ✅ Sufficient (may need responsive font size adjustments)

3. **Color System**
   - Complete color palette defined
   - Colors are device-independent
   - **Status**: ✅ Sufficient

4. **Border Radius**
   - Defined scale (4px to 24px, plus pill)
   - Can use percentage for responsive rounding
   - **Status**: ✅ Sufficient

5. **Layout Patterns**
   - Horizontal scrollable lists (categories, cards) work well on mobile
   - Vertical stacking of sections is responsive-friendly
   - **Status**: ✅ Sufficient

#### ⚠️ Potential Responsive Considerations

1. **Fixed Component Dimensions**
   - **Category Items**: Currently appear fixed-width (~80-100px)
     - **Solution**: Use flex-based or percentage widths
     - **Status**: ⚠️ Needs implementation strategy, not token issue

2. **Resort Card Width**
   - Currently appears fixed-width (~280-320px) for horizontal scroll
   - **Mobile**: Fixed width in horizontal scroll works
   - **Tablet/Desktop**: May need grid layout with flexible card widths
   - **Solution**: Layout logic, not tokens
   - **Status**: ⚠️ Needs layout component, tokens are fine

3. **Search Input**
   - Full-width on mobile (works)
   - **Tablet/Desktop**: May need max-width constraint
   - **Solution**: Layout constraints, not tokens
   - **Status**: ⚠️ Needs layout logic, tokens are fine

4. **Bottom Navigation**
   - Fixed height works on all screen sizes
   - **Desktop**: May need different treatment (sidebar?)
   - **Solution**: Conditional rendering or layout variants
   - **Status**: ⚠️ Needs implementation strategy, not token issue

5. **Section Headers**
   - "View all" link positioning works on all sizes
   - **Status**: ✅ Sufficient

6. **Typography Scaling**
   - Font sizes are in pixels (fixed)
   - **Web**: Could use `rem` or `em` for scaling
   - **Mobile**: Current sizes work well
   - **Tablet/Desktop**: May need slightly larger fonts
   - **Solution**: Responsive font size utilities or breakpoint-based scaling
   - **Status**: ⚠️ Needs implementation, but tokens provide good base

### Responsive Breakpoints (Already Defined)

From `DesignTokens.ts`:
- `breakpoints.mobile` = 0
- `breakpoints.tablet` = 768
- `breakpoints.desktop` = 1024

**Status**: ✅ Breakpoints defined, ready for responsive implementation.

### Conclusion on Responsive Sufficiency

**Overall Assessment**: ✅ **Tokens are sufficient for responsive behavior**

**Reasoning**:
1. All spacing, typography, colors, and radius values are defined
2. Components use flexible layouts (no hardcoded fixed widths in base components)
3. Layout patterns (horizontal scroll, vertical stacking) are inherently responsive
4. Fixed dimensions (like card width in horizontal scroll) are implementation choices, not token limitations
5. Responsive behavior will be achieved through:
   - Layout components (using flexbox, percentages)
   - Conditional rendering based on breakpoints
   - Responsive font size utilities (if needed)

**Missing pieces are implementation strategies, not token gaps.**

---

## Summary

### ✅ What Can Be Built Now
- Back button, notification button (IconButton)
- Search input (Input, may need icon support)
- Section titles (Text with heading2 or new variant)
- Card containers (Card component)
- Text elements (various Text variants)
- Basic buttons (Button primary/outline)

### ⚠️ What Needs New Variants/Tokens
- Button variants: `link`, `category`, `navSelected`, `navUnselected`
- Input variant: `search` (with icon)
- Card variant: `listing` (for resort cards)
- Text variants: `screenTitle`, `sectionTitle`, `price`, `ratingValue`, `link`
- Colors: Light pink background, star rating color
- Border radius: `pill` (for selected nav item)
- Component specs: Category item, resort card, bottom nav dimensions

### ❌ What Needs New Components
- Bottom Navigation Bar (composite component)
- Section Header (composite component)
- Resort Card (composite component)
- Category Item (composite component)
- Icon system/management
- Image component wrapper

### ✅ Responsive Readiness
- Tokens are sufficient for responsive behavior
- Implementation strategies needed for layout adaptations
- Breakpoints already defined
