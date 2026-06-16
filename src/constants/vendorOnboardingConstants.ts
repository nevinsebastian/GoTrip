export const VENDOR_ONBOARDING = {
  listingsCount: '2735',
  speechBubble: 'Join 2735 other listings already in GoTrip',
  landingTitle: 'Become a vendor',
  landingHeadline: 'Host worry-free. We’ve got your back!',
  earningsPrefix: 'Earn more than ',
  earningsAmount: '₹2,420 a week.',
  registerTitle: 'Create your partner account',
  otpTitle: 'Join the Tribe!',
  features: [
    { id: 'payments', label: 'Payments made easy.', icon: 'people-outline' as const },
    { id: 'risk', label: 'Reduced risk', icon: 'shield-checkmark-outline' as const },
    { id: 'rules', label: 'Your rental, your rules', icon: 'clipboard-outline' as const },
    { id: 'steps', label: 'Become a vendor in simple steps', icon: 'play-circle-outline' as const },
  ],
  defaultPhone: '+91 9744893210',
  otpLength: 6,
};

export type VendorRegistrationForm = {
  fullName: string;
  email: string;
  phone: string;
};

export const EMPTY_VENDOR_FORM: VendorRegistrationForm = {
  fullName: '',
  email: '',
  phone: VENDOR_ONBOARDING.defaultPhone,
};
