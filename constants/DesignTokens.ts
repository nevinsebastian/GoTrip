/**
 * SOURCE OF TRUTH
 * Tokens extracted from:
 * - Login
 * - Signup
 * - Resorts (stress-tested)
 *
 * Do not add new tokens unless:
 * - A screen cannot be built without breaking rules
 */


// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Primary Brand Color (Reddish-Orange)
  // Used for: Back arrow, headers, logo, button borders, social button text
  primary: '#FF5C37', // Approximate from Login screen
  primaryAlt: '#EB5757', // From Signup screen (slightly different shade)
  
  // Accent colors from Figma variables
  accent: {
    main: '#e54d2e',
    contrast: '#ffffff',
    surface: '#ff200008',
    alpha: {
      '7': '#e7280067',
      '10': '#d72400da',
      '11': '#cd2200ea',
    },
  },

  // Text Colors
  text: {
    primary: '#1c2024', // Dark gray/black for headings
    secondary: '#4B5563', // Medium gray for body text
    caption: '#828282', // Lighter gray for captions
    placeholder: '#BDBDBD', // Light gray for input placeholders
  },

  // Surface Colors
  surface: {
    white: '#FFFFFF',
    card: '#ffffffe5', // From Figma variable
    background: '#F8F8F8', // Screen background (very light gray)
    backgroundAlt: '#F2F2F2', // Alternative background
    lightPink: '#FFF0F0', // Resorts screen: Light pink/orange background for notification button, category icons
  },

  // Neutral Colors
  neutral: {
    '9': '#8b8d98',
    '11': '#60646c',
    alpha: {
      '2': '#00005506',
      '3': '#0000330f',
      '4': '#00002d17',
      '5': '#0009321f',
      '6': '#00002f26',
      '9': '#00051d74',
    },
  },

  // Border Colors
  border: {
    light: '#E0E0E0', // Input borders, divider lines
    lightAlt: '#E5E7EB', // Alternative light border
    primary: 'rgba(235, 87, 87, 0.4)', // Light red border for social buttons
  },

  // Gray Scale
  gray: {
    '1': '#fcfcfc',
    '2': '#f9f9f9',
    custom: '#646464',
  },

  // Overlays
  overlay: {
    whiteAlpha9: '#ffffffb2',
    blackAlpha2: '#0000001a',
  },

  // Rating colors (Resorts screen)
  // Note: Star color not explicitly in Figma, using standard convention
  rating: {
    star: '#FFD700', // Gold/yellow for filled star rating
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font Family
  fontFamily: {
    text: 'poppins', // From Figma variable: Typography/Font family/text
    // Fallback to system fonts
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // Font Sizes (from Figma variables)
  fontSize: {
    '1': 12, // Typography/Font size/1
    '2': 14, // Typography/Font size/2
    '3': 16, // Typography/Font size/3
    '4': 18, // Header title (estimated from screens)
    '5': 20, // Heading 2 (estimated from screens)
    '6': 24, // Heading 1 (estimated from screens)
  },

  // Font Weights
  fontWeight: {
    regular: '400', // Typography/Font weight/regular
    medium: '500', // Typography/Font weight/medium
    semibold: '600',
    bold: '700',
  },

  // Line Heights (from Figma variables)
  lineHeight: {
    '1': 16, // Typography/Line height/1
    '2': 20, // Typography/Line height/2
    '3': 24, // Typography/Line height/3
  },

  // Letter Spacing (from Figma variables)
  letterSpacing: {
    '1': 0.04, // Typography/Letter spacing/1
    '2': 0, // Typography/Letter spacing/2
    '3': 0, // Typography/Letter spacing/3
  },

  // Typography Styles (pre-composed from Figma)
  styles: {
    // Typography/1/Regular
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      letterSpacing: 0.04,
    },
    // Typography/2/Medium
    bodyMedium: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      letterSpacing: 0,
    },
    // Typography/3/Regular
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      letterSpacing: 0,
    },
    // Typography/3/Medium
    bodySemibold: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      letterSpacing: 0,
    },
    // Header title
    header: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 24,
      letterSpacing: 0,
    },
    // Heading 2
    heading2: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: 0,
    },
    // Heading 1
    heading1: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      letterSpacing: 0,
    },
    // Resorts Screen - Additional Typography Variants
    // Extracted from Resorts screen visual inspection
    screenTitle: {
      fontSize: 24, // Typography/Font size/6
      fontWeight: '700', // Bold for "Resorts" header
      lineHeight: 32,
      letterSpacing: 0,
    },
    sectionTitle: {
      fontSize: 18, // Typography/Font size/4
      fontWeight: '700', // Bold for "Suggested for you" etc.
      lineHeight: 24,
      letterSpacing: 0,
    },
    price: {
      fontSize: 14, // Typography/Font size/2
      fontWeight: '400', // Regular weight for price text
      lineHeight: 20, // Typography/Line height/2
      letterSpacing: 0,
    },
    ratingValue: {
      fontSize: 14, // Typography/Font size/2
      fontWeight: '400', // Regular weight for rating value
      lineHeight: 20, // Typography/Line height/2
      letterSpacing: 0,
    },
    link: {
      fontSize: 16, // Typography/Font size/3
      fontWeight: '500', // Medium weight for "View all" link
      lineHeight: 24, // Typography/Line height/3
      letterSpacing: 0,
    },
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  // From Figma variables (Spacing/1 through Spacing/8)
  '1': 4,   // Spacing/1
  '2': 8,   // Spacing/2
  '3': 12,  // Spacing/3
  '4': 16,  // Spacing/4
  '5': 24,  // Spacing/5
  '6': 32,  // Spacing/6
  '7': 40,  // Spacing/7
  '8': 48,  // Spacing/8

  // Semantic spacing names
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  // From Figma variables
  '2': 4,   // Radius/2-max
  '3': 6,   // Radius/3-max
  '5': 12,  // Radius/5
  '6': 16,  // Radius/6

  // Semantic names
  sm: 4,
  md: 6,
  lg: 8,   // Estimated for inputs/buttons
  xl: 12,  // Radius/5
  '2xl': 16, // Radius/6
  '3xl': 20, // Estimated for cards
  '4xl': 24, // Estimated for cards
  pill: 9999, // Full pill shape for selected nav items (Resorts screen)
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  // Card shadow (subtle elevation)
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2, // Android
  },
  // Button shadow (more prominent)
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  },
} as const;

// ============================================================================
// COMPONENT SPECIFIC TOKENS
// ============================================================================

export const components = {
  // Button heights from Figma
  button: {
    height: {
      '2': 32, // Tokens/Space/button-height-2
      default: 48, // Estimated from screens (48-56px range)
      large: 56,
    },
    padding: {
      horizontal: 16,
      vertical: 12,
    },
  },
  
  // Input field specifications
  input: {
    height: 48, // Estimated from screens (48-56px range)
    padding: {
      horizontal: 16,
      vertical: 12,
    },
    borderWidth: 1,
  },

  // Card specifications
  card: {
    padding: {
      horizontal: 24, // Estimated from screens
      vertical: 32,   // Estimated from screens
    },
    borderRadius: 20, // Estimated from screens (20-24px)
  },

  // Header specifications
  header: {
    height: 56, // Standard header height
    padding: {
      horizontal: 16,
    },
  },

  // Resorts Screen - Component Specifications
  // Extracted from Resorts screen visual inspection
  // Note: Fixed widths removed for responsiveness - use maxWidth instead
  categoryItem: {
    iconSize: 64, // Icon size (fixed - icons are allowed)
    maxWidth: 80, // Max width for category items (mobile horizontal scroll)
    labelSpacing: 8, // Spacing between icon and label
  },
  
  resortCard: {
    maxWidth: 300, // Max width for resort cards (mobile horizontal scroll)
    // On tablet/desktop, cards should use flexible widths in grid layouts
    imageAspectRatio: 16 / 9, // Image aspect ratio
    contentPadding: 16, // Internal padding for text content
    favoriteIconSize: 24, // Favorite icon size (fixed - icons are allowed)
    favoriteIconOffset: 8, // Offset from top-right corner
  },
  
  bottomNav: {
    height: 64, // Estimated: bottom nav height (60-70px range)
    itemSpacing: 'equal', // Equal distribution of items
    selectedPillPadding: {
      horizontal: 12,
      vertical: 8,
    },
    iconSize: 24,
    textSize: 14, // For selected item label
  },
  
  searchInput: {
    iconSize: 20, // Search icon size
    iconPadding: 16, // Padding from right edge for icon
  },
} as const;

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ColorKey = keyof typeof colors;
export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type TypographyStyle = keyof typeof typography.styles;
