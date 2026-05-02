// src/api/endpoints.ts
// Centralized mapping of backend endpoints used in the app.

export const ENDPOINTS = {
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    sendOtp: '/api/v1/auth/send-otp',
    verifyOtp: '/api/v1/auth/verify-otp',
    me: '/api/v1/auth/me',
    logout: '/api/v1/auth/logout',
  },
  trips: {
    list: '/api/v1/trips',
    details: (id: string) => `/api/v1/trips/${id}`,
  },
  user: {
    profile: '/api/v1/users/me',
    updateProfile: '/api/v1/users/me',
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
    mine: '/api/v1/bookings',
    detail: (id: string) => `/api/v1/bookings/${id}`,
    cancel: (id: string) => `/api/v1/bookings/${id}/cancel`,
  },
  payments: {
    createOrder: '/api/v1/payments/create-order',
    verify: '/api/v1/payments/verify',
  },
  wishlists: {
    mine: '/api/v1/wishlists',
  },
} as const;

