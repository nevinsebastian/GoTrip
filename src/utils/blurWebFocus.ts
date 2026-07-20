import { Platform } from 'react-native';

/** Blur focused element on web before hiding a screen/modal (avoids aria-hidden focus warnings). */
export function blurWebFocus(): void {
  if (Platform.OS !== 'web') return;
  if (typeof document === 'undefined') return;
  const active = document.activeElement as HTMLElement | null;
  if (active && typeof active.blur === 'function') {
    active.blur();
  }
}
