/** Figma desktop frame — content should fill this width with modest gutters. */
export const DESKTOP_LAYOUT = {
  maxWidth: 1440,
  gutter: 32,
} as const;

export const desktopContentShellStyle = {
  width: '100%' as const,
  maxWidth: DESKTOP_LAYOUT.maxWidth,
  alignSelf: 'center' as const,
  paddingHorizontal: DESKTOP_LAYOUT.gutter,
};

/** Figma “Become a vendor - Web” card frame (compact for typical laptop viewports). */
export const DESKTOP_VENDOR_LANDING_CARD = {
  width: 960,
  height: 560,
  borderRadius: 20,
  backgroundColor: '#FFFFFF',
  viewportHeaderOffset: 100,
} as const;
