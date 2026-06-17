import { Redirect } from 'expo-router';

/** Vendor onboarding routes live under /vendor/* — the index is not the app entry. */
export default function VendorIndexRoute() {
  return <Redirect href="/" />;
}
