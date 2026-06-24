import { Redirect } from 'expo-router';

/** Vendor routes live under /vendor/* — never send vendors to the guest app root. */
export default function VendorIndexRoute() {
  return <Redirect href="/vendor/home" />;
}
