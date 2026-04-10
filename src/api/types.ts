// src/api/types.ts
// Shared TypeScript types for API requests and responses.

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  // Backend uses full_name; some parts of app may prefer name.
  full_name?: string;
  name?: string;
  email: string;
  avatarUrl?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  role?: string;
  is_verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string; // JWT access token
  refreshToken?: string;
  user: User;
}

export type OtpChannel = 'email' | 'phone';

export interface SendOtpRequest {
  full_name?: string;
  email?: string;
  phone?: string;
  channel: OtpChannel;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
    channel?: OtpChannel;
    identifier?: string;
  };
}

export interface VerifyOtpRequest {
  full_name?: string;
  email?: string;
  phone?: string;
  channel: OtpChannel;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    access_token: string;
    refresh_token?: string;
  };
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  imageUrl?: string;
  isFeatured?: boolean;
}

export interface APIError {
  message: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
  fieldErrors?: Record<string, string[]>;
  isNetworkError?: boolean;
  isUnauthorized?: boolean;
}

export type CategoryType = 'hotel' | 'activity' | 'camping' | 'package';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon_url?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
  type?: CategoryType | null;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  children?: Category[];
}

export interface CategoriesByTypeResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface ListingCategoryLite {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
}

export interface ListingMedia {
  id: string;
  listing_id: string;
  url: string;
  media_type: 'image' | 'video' | string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  vendor_id: string;
  category_id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  price_start?: string | null;
  amenities?: string[] | null;
  policies?: unknown;
  max_guests?: number | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  category?: ListingCategoryLite;
  media?: ListingMedia[];
}

export interface ListingsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListingsResponse {
  success: boolean;
  message: string;
  data: Listing[];
  meta: ListingsMeta;
}

export interface ListingVendorLite {
  id: string;
  business_name: string;
}

export interface ListingReview {
  id?: string;
  rating?: number;
  comment?: string;
  created_at?: string;
  user_id?: string;
}

export interface ListingDetail extends Listing {
  vendor?: ListingVendorLite;
  reviews?: ListingReview[];
}

export interface ListingDetailResponse {
  success: boolean;
  message: string;
  data: ListingDetail;
}

