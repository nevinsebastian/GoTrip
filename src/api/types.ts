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

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: User;
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

export interface RegisterRequest {
  fullName: string;
  password: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  channel?: OtpChannel;
}

export interface VerifyOtpRequest {
  full_name?: string;
  email?: string;
  phone?: string;
  channel?: OtpChannel;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  data?: {
    user: User;
    access_token: string;
    refresh_token?: string;
  };
}

export interface CreateVendorProfileRequest {
  businessName: string;
  panNumber?: string | null;
  gstNumber?: string | null;
}

export interface VendorProfile {
  id: string;
  businessName: string;
  panNumber?: string | null;
  gstNumber?: string | null;
  userId?: string;
}

export interface CreateVendorProfileResponse {
  success: boolean;
  message?: string;
  data?: VendorProfile;
}

export interface UploadVendorKycResponse {
  success: boolean;
  message?: string;
}

export interface CreateHotelRequest {
  title: string;
  description: string;
  listingType: string;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
  locationJson: Record<string, unknown>;
  cancellationPolicyId?: string;
}

export interface CreateHotelResponse {
  success?: boolean;
  message?: string;
  id?: string;
  listing?: {
    id: string;
  };
  data?: {
    id: string;
  };
}

export type MealPlanCode = 'EP' | 'CP' | 'MAP' | 'AP' | 'AI';

export interface MealPlanInput {
  planCode: MealPlanCode;
  label?: string;
  includesBreakfast?: boolean;
  includesLunch?: boolean;
  includesDinner?: boolean;
  includesSnacks?: boolean;
  isDefault?: boolean;
}

export interface CreateRoomTypeRequest {
  name: string;
  bedType: 'single' | 'double' | 'queen' | 'king' | 'bunk' | 'sofa_bed' | 'twin';
  numBeds?: number;
  floorAreaSqft?: number;
  totalUnits: number;
  defaultAdultOccupancy?: number;
  maxAdultOccupancy?: number;
  defaultChildOccupancy?: number;
  maxChildOccupancy?: number;
  defaultInfantOccupancy?: number;
  maxInfantOccupancy?: number;
  basePricePerNight: number;
  extraAdultCharge?: number;
  extraChildCharge?: number;
  extraInfantCharge?: number;
  amenityIds?: string[];
  mealPlans?: MealPlanInput[];
}

export interface CreateRoomTypeResponse {
  success?: boolean;
  message?: string;
  id?: string;
  roomType?: {
    id: string;
  };
  data?: {
    id: string;
  };
}

export interface SubmitHotelListingResponse {
  success?: boolean;
  message?: string;
}

export interface CreateGlampingResponse {
  id: string;
}

export interface CreateGlampingRequest {
  title: string;
  description: string;
  locationJson: Record<string, unknown>;
  cancellationPolicyId?: string;
  totalCamps: number;
  adultsPerCamp: number;
  infantsPerCamp: number;
  pricePerCampNight: number;
  extraAdultCharge: number;
  extraInfantCharge: number;
  aboutExperience: string;
  inclusions: string[];
  exclusions: string[];
  whatsprovided: string[];
  thingsToCarry: string[];
  howToReach: string;
  totalCampSites?: number;
}

export interface GlampingMealPlanRequest {
  planCode: MealPlanCode;
  label: string;
  includesBreakfast?: boolean;
  includesLunch?: boolean;
  includesDinner?: boolean;
  breakfastPricePp?: number;
  lunchPricePp?: number;
  dinnerPricePp?: number;
  isDefault?: boolean;
}

export interface CreateGlampingMealPlanResponse {
  success?: boolean;
  message?: string;
}

/** @deprecated Use GlampingMealPlanRequest (single object POST body). */
export interface UpsertGlampingMealPlansRequest {
  mealPlans: MealPlanInput[];
}

/** @deprecated Use CreateGlampingMealPlanResponse. */
export interface UpsertGlampingMealPlansResponse {
  success?: boolean;
  message?: string;
}

export interface UploadGlampingImagesResponse {
  success?: boolean;
  message?: string;
}

export interface SubmitGlampingListingResponse {
  success?: boolean;
  message?: string;
}

export type ActivityTypeEnum =
  | 'trekking'
  | 'water_sports'
  | 'adventure'
  | 'cultural'
  | 'wildlife'
  | 'cycling'
  | 'camping'
  | 'yoga_wellness'
  | 'culinary'
  | 'sightseeing';

export interface CreateActivityRequest {
  title: string;
  activityType: ActivityTypeEnum;
  basePriceAdult: number;
  locationJson: Record<string, unknown>;
  description?: string;
  cancellationPolicyId?: string;
  basePriceInfant?: number;
  minAge?: number;
  totalSlotsPerDay?: number;
  aboutExperience?: string;
  inclusions?: string[];
  exclusions?: string[];
  whatsprovided?: string[];
  thingsToCarry?: string[];
  howToReach?: string;
  highlightIds?: string[];
}

export interface CreateActivityResponse {
  success?: boolean;
  id?: string;
  message?: string;
  listing?: unknown;
  activity?: unknown;
}

export interface CreateActivitySlotRequest {
  label: string;
  startTime?: string;
  durationMinutes?: number;
  maxParticipants?: number;
}

export interface CreateActivitySlotResponse {
  success?: boolean;
  message?: string;
  slot?: {
    id: string;
    label: string;
    startTime?: string;
    durationMinutes?: number;
    maxParticipants?: number;
  };
}

export interface UploadActivityImagesResponse {
  success?: boolean;
  message?: string;
}

export interface SubmitActivityListingResponse {
  success?: boolean;
  message?: string;
}

export interface ActivityHighlight {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  activityType: ActivityTypeEnum;
}

export interface ActivityHighlightsResponse {
  success?: boolean;
  highlights?: ActivityHighlight[];
}

export type PackageBookingMode = 'direct' | 'enquiry_only';

export interface CreatePackageRequest {
  title: string;
  totalDays: number;
  totalNights: number;
  pricePerPerson: number;
  locationJson: Record<string, unknown>;
  description?: string;
  cancellationPolicyId?: string;
  minGroupSize?: number;
  maxGroupSize?: number;
  inclusions?: string[];
  exclusions?: string[];
  whatsprovided?: string[];
  bookingMode?: PackageBookingMode;
}

export interface CreatePackageResponse {
  success?: boolean;
  message?: string;
  error?: string;
  id?: string;
  listing?: { id?: string };
  package?: { id?: string };
}

export interface UpsertPackageItineraryRequest {
  dayNumber: number;
  title: string;
  description?: string;
  hotelName?: string;
  hotelDescription?: string;
  activityName?: string;
  activityDescription?: string;
}

export interface UpsertPackageItineraryResponse {
  success?: boolean;
  message?: string;
}

export interface UploadPackageImagesResponse {
  success?: boolean;
  message?: string;
  images?: unknown[];
}

export interface SubmitPackageListingResponse {
  success?: boolean;
  message?: string;
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

// --- Bookings ---
export interface CreateBookingRequest {
  listing_id: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  guests: number;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'failed'
  | string;

export interface Booking {
  id: string;
  user_id?: string;
  listing_id: string;
  start_date: string;
  end_date: string;
  guests: number;
  rooms?: number;
  total_amount?: string;
  status?: BookingStatus;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  created_at?: string;
  updated_at?: string;
  listing?: {
    id: string;
    title?: string;
    location?: string;
  };
  payment?: {
    id: string;
    status?: string;
    amount?: string;
  } | null;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: Booking;
}

export interface BookingsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BookingsResponse {
  success: boolean;
  message: string;
  data: Booking[];
  meta: BookingsMeta;
}

// --- Payments (Razorpay) ---
export interface CreateOrderRequest {
  booking_id: string;
  /**
   * Optional Razorpay receipt override.
   * Razorpay requires receipt length <= 40 chars.
   */
  receipt?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    order_id: string;
    amount: number; // in paise
    currency: string;
    key_id: string;
  };
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// --- Wishlists ---
export interface WishlistListing extends Listing {
  wishlist_id: string;
  wishlisted_at: string;
  is_wishlisted: boolean;
  /** Listing aggregate rating from API (may be 0). */
  rating?: number;
}

export interface WishlistsResponse {
  success: boolean;
  message: string;
  data: WishlistListing[];
  meta: ListingsMeta;
}

