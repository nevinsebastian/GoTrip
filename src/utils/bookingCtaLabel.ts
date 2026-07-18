/** Primary booking CTA: "Login" when signed out, otherwise the action label. */
export function bookingCtaLabel(
  isLoggedIn: boolean,
  loggedInLabel: string = 'Book Now',
): string {
  return isLoggedIn ? loggedInLabel : 'Login';
}
