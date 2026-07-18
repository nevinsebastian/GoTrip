// src/api/endpoints.ts
// Centralized mapping of backend endpoints used in the app.

export const ENDPOINTS = {
  auth: {
    login: '/api/v1/auth/login',
    loginSendOtp: '/api/v1/auth/login/send-otp',
    loginVerifyOtp: '/api/v1/auth/login/verify-otp',
    register: '/api/v1/auth/register',
    verifyOtp: '/api/v1/auth/verify-otp',
    me: '/api/v1/auth/me',
    logout: '/api/v1/auth/logout',
  },
  search: {
    browse: '/api/v1/search',
    suggestions: '/api/v1/search/suggestions',
  },
  trips: {
    list: '/api/v1/trips',
    details: (id: string) => `/api/v1/trips/${id}`,
  },
  user: {
    /** Current user — GET /auth/me (OpenAPI). Legacy /users/me returns 403. */
    profile: '/api/v1/auth/me',
    updateProfile: '/api/v1/users/me/profile',
  },
  categories: {
    root: '/api/v1/categories',
    byType: (type: string) => `/api/v1/categories/type/${type}`,
  },
  listings: {
    browse: '/api/v1/listings',
  },
  bookings: {
    create: '/api/v1/bookings',
    mine: '/api/v1/bookings/my',
    detail: (id: string) => `/api/v1/bookings/my/${id}`,
    cancel: (id: string) => `/api/v1/bookings/${id}/cancel`,
    checkAvailability: '/api/v1/bookings/check-availability',
    hold: '/api/v1/bookings/hold',
  },
  payments: {
    createOrder: '/api/v1/payments/create-order',
    verify: '/api/v1/payments/verify',
    initiate: '/api/v1/payments/initiate',
    mine: '/api/v1/payments/my',
  },
  coupons: {
    validate: '/api/v1/coupons/validate',
  },
  wishlists: {
    mine: '/api/v1/wishlists',
    item: (wishlistId: string) => `/api/v1/wishlists/${wishlistId}`,
  },
  vendors: {
    profile: '/api/v1/vendors/profile',
    kyc: '/api/v1/vendors/profile/me/kyc',
    myListings: '/api/v1/vendors/profile/me/listings',
  },
  hotels: {
    browse: '/api/v1/hotels',
    detail: (id: string) => `/api/v1/hotels/${id}`,
    create: '/api/v1/hotels',
    roomTypes: (hotelId: string) => `/api/v1/hotels/${hotelId}/room-types`,
    submit: (hotelId: string) => `/api/v1/hotels/${hotelId}/submit`,
  },
  availability: {
    entity: (entityType: string, entityId: string) =>
      `/api/v1/availability/${entityType}/${entityId}`,
  },
  reviews: {
    listing: (listingId: string) => `/api/v1/reviews/listing/${listingId}`,
    create: '/api/v1/reviews',
  },
  glamping: {
    browse: '/api/v1/glamping',
    detail: (id: string) => `/api/v1/glamping/${id}`,
    create: '/api/v1/glamping',
    mealPlans: (id: string) => `/api/v1/glamping/${id}/meal-plans`,
    images: (id: string) => `/api/v1/glamping/${id}/images`,
    submit: (id: string) => `/api/v1/glamping/${id}/submit`,
  },
  activities: {
    browse: '/api/v1/activities',
    detail: (id: string) => `/api/v1/activities/${id}`,
    create: '/api/v1/activities',
    slots: (id: string) => `/api/v1/activities/${id}/slots`,
    images: (id: string) => `/api/v1/activities/${id}/images`,
    highlights: (id: string) => `/api/v1/activities/${id}/highlights`,
    submit: (id: string) => `/api/v1/activities/${id}/submit`,
  },
  packages: {
    browse: '/api/v1/packages',
    detail: (id: string) => `/api/v1/packages/${id}`,
    enquiries: (id: string) => `/api/v1/packages/${id}/enquiries`,
    myEnquiries: '/api/v1/packages/my/enquiries',
    create: '/api/v1/packages',
    images: (id: string) => `/api/v1/packages/${id}/images`,
    itineraries: (id: string) => `/api/v1/packages/${id}/itineraries`,
    submit: (id: string) => `/api/v1/packages/${id}/submit`,
  },
  admin: {
    activityHighlights: '/api/v1/admin/activity-highlights',
    cancellationPolicies: '/api/v1/admin/cancellation-policies',
  },
} as const;

