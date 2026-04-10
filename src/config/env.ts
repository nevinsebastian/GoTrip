/**
 * Public API base (no secrets). Must be set at build time for web (`expo export` inlines
 * `EXPO_PUBLIC_*`). If unset, requests would resolve to the static host (e.g. Vercel) and POSTs fail with 405.
 */
const DEFAULT_PUBLIC_API_URL = 'https://api.gotripholiday.com';

export const API_URL =
  (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_API_URL?.trim()) ||
  DEFAULT_PUBLIC_API_URL;