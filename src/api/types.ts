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

export interface AuthContactPayload {
  email?: string;
  phone?: string;
}

export interface SendLoginOtpRequest extends AuthContactPayload {}

export interface SendOtpRequest extends AuthContactPayload {
  /** @deprecated login flow — use SendLoginOtpRequest; kept for callers passing channel */
  full_name?: string;
  channel?: OtpChannel;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  channel?: OtpChannel;
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

export interface VerifyOtpRequest extends AuthContactPayload {
  otp: string;
  /** @deprecated registration-only legacy field */
  full_name?: string;
  channel?: OtpChannel;
}

export interface VerifyLoginOtpRequest extends AuthContactPayload {
  otp: string;
}

export interface AuthUserPayload {
  id: string;
  email?: string;
  phone?: string;
  fullName?: string;
  full_name?: string;
  role?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUserPayload;
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

export interface HotelLocationJson {
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  address?: string;
  country?: string;
  pinCode?: string;
  searchLabel?: string;
  streetAddress?: string;
  unit?: string;
}

export interface HotelPropertyInfo {
  id: string;
  listingId: string;
  listingType?: string;
  starRating?: number | null;
  checkInTime?: string;
  checkOutTime?: string;
  totalFloors?: number | null;
  propertyRules?: unknown;
  listing_id?: string;
}

export interface PublicHotel {
  id: string;
  vendorId?: string;
  vendor_id?: string;
  category?: string;
  title: string;
  description?: string | null;
  status?: string;
  isPublished?: boolean;
  locationJson?: HotelLocationJson | null;
  cancellationPolicyId?: string | null;
  avgRating?: number | null;
  reviewCount?: number;
  metaJson?: Record<string, unknown> | null;
  coverImage?: string | null;
  hotelProperty?: HotelPropertyInfo | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrowseHotelsParams {
  limit?: number;
  offset?: number;
  city?: string;
  minRating?: number;
  /** @deprecated use offset — converted as (page - 1) * limit when offset omitted */
  page?: number;
}

export interface HotelsBrowseResponse {
  success?: boolean;
  data: PublicHotel[];
  total: number;
  limit: number;
  offset: number;
}

export interface HotelImage {
  url: string;
  isCover?: boolean;
  sortOrder?: number;
}

export interface HotelMealPlan {
  id: string;
  planCode?: string;
  label?: string;
  includesBreakfast?: boolean;
  includesLunch?: boolean;
  includesDinner?: boolean;
}

export interface HotelRoomAmenity {
  id: string;
  name: string;
  icon?: string | null;
}

export interface HotelRoomType {
  id: string;
  name: string;
  bedType?: string;
  numBeds?: number;
  totalUnits?: number;
  basePricePerNight?: number;
  maxAdultOccupancy?: number;
  maxChildOccupancy?: number;
  mealPlans?: HotelMealPlan[];
  amenities?: HotelRoomAmenity[];
}

export interface HotelPropertyDetail extends HotelPropertyInfo {
  roomTypes?: HotelRoomType[];
}

export interface HotelDetail {
  id: string;
  title: string;
  description?: string | null;
  category?: string;
  status?: string;
  isPublished?: boolean;
  locationJson?: HotelLocationJson | null;
  avgRating?: number | null;
  reviewCount?: number;
  cancellationPolicyId?: string | null;
  images?: HotelImage[];
  highlights?: string[];
  hotelProperty?: HotelPropertyDetail | null;
}

export interface HotelDetailResponse {
  success?: boolean;
  hotel: HotelDetail;
}

export interface HotelRoomTypesResponse {
  success?: boolean;
  roomTypes: HotelRoomType[];
}

export type AvailabilityEntityType =
  | 'room_type'
  | 'full_property'
  | 'activity_slot'
  | 'glamping_site'
  | 'package';

export interface BrowseListingsParams {
  limit?: number;
  offset?: number;
  city?: string;
  minRating?: number;
  activityType?: ActivityTypeEnum;
  /** @deprecated use offset */
  page?: number;
}

export interface PaginatedBrowseResponse<T> {
  success?: boolean;
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export type SearchType = 'hotel' | 'package' | 'activity' | 'glamping';

export interface SearchParams {
  type: SearchType;
  q?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  /** @deprecated prefer adults + children for hotel capacity filtering */
  guests?: number;
  adults?: number;
  children?: number;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface CapacityFitSuggestionRoom {
  roomTypeId: string;
  roomTypeName?: string;
  units: number;
  maxAdultOccupancy?: number;
  maxChildOccupancy?: number;
  basePricePerNight?: number;
}

export interface CapacityFitSuggestion {
  combinationType: 'same_room_type' | 'cross_room_type';
  rooms: CapacityFitSuggestionRoom[];
  estimatedTotalPerNight?: number;
}

export interface SearchListing {
  id: string;
  title: string;
  category: SearchType;
  description?: string;
  locationJson?: {
    city?: string;
    state?: string;
    country?: string;
    lat?: number;
    lng?: number;
    address?: string;
    searchLabel?: string;
    streetAddress?: string;
  };
  avgRating?: number | null;
  reviewCount?: number;
  coverImage?: string | null;
  hotelProperty?: Record<string, unknown>;
  package?: Record<string, unknown>;
  activity?: Record<string, unknown>;
  glampingSite?: Record<string, unknown>;
  /** Present when search was filtered by adults/children and a fit exists */
  capacityFit?: CapacityFitSuggestion;
}

export interface SearchResponse {
  success?: boolean;
  data: SearchListing[];
  total: number;
  limit: number;
  offset: number;
  meta?: {
    checkIn?: string;
    checkOut?: string;
    rooms?: number | null;
    guests?: number | null;
    adults?: number | null;
    children?: number | null;
    /** When adults/children were sent, total is an upper-bound estimate */
    totalApproximate?: boolean;
  };
}

export interface SearchSuggestionsParams {
  q: string;
  type?: SearchType;
}

export interface SuggestionLocation {
  city: string;
  state: string | null;
  categories: SearchType[];
}

export interface SuggestionListing {
  id: string;
  title: string;
  category: SearchType;
  city: string | null;
  state: string | null;
}

export interface SuggestionsResponse {
  success?: boolean;
  locations: SuggestionLocation[];
  listings: SuggestionListing[];
}

export interface PublicListingImage {
  url: string;
  isCover?: boolean;
  sortOrder?: number;
}

export interface PublicListingBase {
  id: string;
  vendorId?: string;
  vendor_id?: string;
  title: string;
  description?: string | null;
  status?: string;
  isPublished?: boolean;
  locationJson?: HotelLocationJson | null;
  cancellationPolicyId?: string | null;
  avgRating?: number | null;
  reviewCount?: number;
  coverImage?: string | null;
  metaJson?: Record<string, unknown> | null;
  images?: PublicListingImage[];
  highlights?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivitySlot {
  id: string;
  label?: string;
  startTime?: string;
  durationMinutes?: number;
  maxParticipants?: number;
}

export interface PublicActivity extends PublicListingBase {
  activityType?: ActivityTypeEnum;
  basePriceAdult?: number;
  basePriceInfant?: number;
  minAge?: number;
  totalSlotsPerDay?: number;
  aboutExperience?: string;
  inclusions?: string[];
  exclusions?: string[];
  whatsprovided?: string[];
  thingsToCarry?: string[];
  howToReach?: string;
  slots?: ActivitySlot[];
}

export interface ActivityDetail extends PublicActivity {}

export interface ActivityDetailResponse {
  success?: boolean;
  activity: ActivityDetail;
}

export interface GlampingSite {
  id: string;
  name?: string;
  totalUnits?: number;
  maxAdults?: number;
  maxInfants?: number;
  basePricePerNight?: number;
}

export interface PublicGlamping extends PublicListingBase {
  totalCamps?: number;
  adultsPerCamp?: number;
  infantsPerCamp?: number;
  pricePerCampNight?: number;
  extraAdultCharge?: number;
  extraInfantCharge?: number;
  aboutExperience?: string;
  inclusions?: string[];
  exclusions?: string[];
  whatsprovided?: string[];
  thingsToCarry?: string[];
  howToReach?: string;
  sites?: GlampingSite[];
  /** Nested site from GET /glamping/:id */
  glampingSite?: GlampingSite & Record<string, unknown>;
  mealPlans?: HotelMealPlan[];
}

export interface GlampingDetail extends PublicGlamping {}

export interface GlampingDetailResponse {
  success?: boolean;
  glamping: GlampingDetail;
}

export interface PackageItineraryDay {
  id?: string;
  dayNumber: number;
  title: string;
  description?: string;
  activities?: string[];
  activitiesJson?: string[];
  mealsCovered?: string[];
}

export interface PackageDeparture {
  id: string;
  startDate: string;
  endDate: string;
  seatsAvailable?: number;
  pricePerPerson?: number;
}

export interface PackageProductInfo {
  id: string;
  listingId?: string;
  totalDays?: number;
  totalNights?: number;
  pricePerPerson?: number;
  minGroupSize?: number;
  maxGroupSize?: number;
  inclusions?: string[];
  exclusions?: string[];
  whatsprovided?: string[];
  bookingMode?: PackageBookingMode;
  itineraries?: PackageItineraryDay[];
}

export interface PublicPackage extends PublicListingBase {
  category?: string;
  package?: PackageProductInfo;
  /** @deprecated flattened — prefer package.* */
  totalDays?: number;
  totalNights?: number;
  pricePerPerson?: number;
  minGroupSize?: number;
  maxGroupSize?: number;
  bookingMode?: PackageBookingMode;
  inclusions?: string[];
  exclusions?: string[];
  whatsprovided?: string[];
  itineraries?: PackageItineraryDay[];
  departures?: PackageDeparture[];
}

export interface PackageDetail extends PublicPackage {}

export interface PackageDetailResponse {
  success?: boolean;
  package: PackageDetail;
}

export interface PackageEnquiryRequest {
  adults: number;
  infants?: number;
  travelDate?: string;
  message?: string;
}

export interface PackageEnquiry {
  id: string;
  listingId: string;
  userId?: string;
  travelDate?: string | null;
  adults: number;
  infants?: number;
  message?: string | null;
  status: 'open' | 'replied' | 'closed' | 'converted' | string;
  vendorReply?: string | null;
  repliedAt?: string | null;
  createdAt?: string;
  listing?: { title?: string; id?: string };
}

export interface PackageEnquiryResponse {
  success?: boolean;
  message?: string;
  enquiry?: PackageEnquiry;
}

export interface PackageEnquiriesResponse {
  success?: boolean;
  data: PackageEnquiry[];
  total: number;
  limit: number;
  offset: number;
}

export interface BookingHoldGuest {
  fullName: string;
  age?: number;
  isPrimary?: boolean;
  idType?: string;
  idNumber?: string;
}

export interface BookingHoldRequest {
  listingId: string;
  entityType: AvailabilityEntityType;
  entityId: string;
  checkIn: string;
  checkOut?: string;
  adults: number;
  children?: number;
  infants?: number;
  unitsBooked?: number;
  mealPlanId?: string;
  /** Activity bookings — same as slot entityId */
  activitySlotId?: string;
  slotId?: string;
  glampingSiteId?: string;
  roomTypeId?: string;
  couponCode?: string;
  specialRequests?: string;
  guests?: BookingHoldGuest[];
  /** Links two holds for a cross_room_type combo booking */
  comboRef?: string;
}

export interface BookingHoldResponse {
  success?: boolean;
  holdId?: string;
  bookingId?: string;
  booking?: Booking;
  expiresAt?: string;
  priceBreakdown?: BookingPriceBreakdown;
}

export interface InitiatePaymentRequest {
  bookingId: string;
  receipt?: string;
}

export interface InitiatePaymentResponse {
  success?: boolean;
  message?: string;
  /** Normalized client shape used by checkout UI */
  data?: {
    order_id: string;
    amount: number;
    currency: string;
    key_id: string;
    booking_id?: string;
  };
  /** Backend may return this shape instead of `data` */
  razorpayOrder?: {
    id: string;
    amount: number;
    currency: string;
    key?: string;
  };
  payment?: {
    id?: string;
    gatewayOrderId?: string;
    amount?: number;
  };
}

export interface AvailabilityDay {
  date: string;
  total_units?: number;
  booked_units?: number;
  blocked_units?: number;
  available_units?: number;
  is_blocked?: boolean;
  effective_price?: number;
}

export interface AvailabilityResponse {
  success?: boolean;
  availability: AvailabilityDay[];
}

export interface ListingReviewsResponse {
  success?: boolean;
  reviews: ListingReview[];
}

export interface CancellationPolicy {
  id: string;
  name?: string;
  description?: string;
  policyText?: string;
  rules?: unknown;
}

export interface CancellationPoliciesResponse {
  success?: boolean;
  data?: CancellationPolicy[];
  policies?: CancellationPolicy[];
}

export interface CheckAvailabilityRequest {
  entityType: Exclude<AvailabilityEntityType, 'package'>;
  entityId: string;
  checkIn: string;
  /** Required for hotel/glamping; optional for activity (defaults to 1 night on backend) */
  checkOut?: string;
  adults: number;
  children?: number;
  infants?: number;
  unitsBooked?: number;
  mealPlanId?: string;
  slotId?: string;
  glampingSiteId?: string;
  roomTypeId?: string;
  couponCode?: string;
}

export interface BookingPriceBreakdown {
  nights?: number;
  basePrice?: number;
  extraPersonCharge?: number;
  mealCharge?: number;
  subtotal?: number;
  discountAmount?: number;
  taxableAmount?: number;
  taxRatePct?: number;
  taxAmount?: number;
  platformFee?: number;
  platformFeePct?: number;
  totalAmount?: number;
  currency?: string;
}

export interface CheckAvailabilityResponse {
  success?: boolean;
  available?: boolean;
  priceBreakdown?: BookingPriceBreakdown;
  unavailableDates?: string[];
  /** Hotel capacity hard-reject (party does not fit selected room/units) */
  capacityExceeded?: boolean;
  message?: string;
  suggestions?: CapacityFitSuggestion[];
  fallbackSearchUrl?: string | null;
}

export type VendorListingApiCategory = 'hotel' | 'package' | 'glamping' | 'activity';

export type VendorListingApiStatus =
  | 'draft'
  | 'pending_approval'
  | 'active'
  | 'suspended'
  | 'archived';

export interface VendorMyListingsQuery {
  category?: VendorListingApiCategory;
  status?: VendorListingApiStatus;
  limit?: number;
  offset?: number;
}

export interface VendorMyListingsMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface VendorMyListingsResult {
  listings: Listing[];
  meta: VendorMyListingsMeta;
}

export interface VendorMyListingsResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: Listing[];
  listings?: Listing[];
  total?: number;
  limit?: number;
  offset?: number;
  meta?: Partial<VendorMyListingsMeta> & Partial<ListingsMeta>;
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
  user?: { full_name?: string; name?: string };
  reviewerName?: string;
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
  bookingRef?: string;
  user_id?: string;
  listing_id?: string;
  listingId?: string;
  start_date?: string;
  end_date?: string;
  check_in?: string;
  check_out?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  adults?: number;
  children?: number;
  infants?: number;
  rooms?: number;
  /** Shared id when this booking is part of a multi-room-type combo */
  comboRef?: string | null;
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
    category?: string;
    coverImage?: string;
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
  page?: number;
  limit: number;
  total: number;
  offset?: number;
  totalPages?: number;
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

// ─── Vendor profile ────────────────────────────────────────────────────────

export type VendorKycStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface VendorProfileFull {
  id: string;
  userId?: string;
  businessName: string;
  panNumber?: string | null;
  gstNumber?: string | null;
  kycStatus?: VendorKycStatus;
  commissionPct?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorProfileResponse {
  success: boolean;
  message?: string;
  data?: VendorProfileFull;
}

export interface UpdateVendorProfileRequest {
  businessName?: string;
  gstNumber?: string;
}

export interface UpdateVendorBankRequest {
  accountNo: string;
  ifsc: string;
  bankName: string;
  holderName: string;
}

// ─── Vendor bookings ───────────────────────────────────────────────────────

export type VendorBookingApiStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface VendorBooking {
  id: string;
  bookingRef?: string;
  status: VendorBookingApiStatus;
  listingTitle?: string;
  listingId?: string;
  listingCategory?: string;
  guestName?: string;
  guestId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  adults?: number;
  children?: number;
  totalAmount?: number;
  currency?: string;
  createdAt?: string;
}

export interface VendorBookingsResponse {
  success: boolean;
  data: VendorBooking[];
  total?: number;
  meta?: { total: number; limit: number; offset: number };
}

export interface VendorBookingActionResponse {
  success: boolean;
  message?: string;
}

// ─── Vendor payouts ────────────────────────────────────────────────────────

export interface VendorPayout {
  id: string;
  bookingRef?: string;
  bookingId?: string;
  listingTitle?: string;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt?: string;
  settledAt?: string;
}

export interface VendorPayoutsResponse {
  success: boolean;
  data: VendorPayout[];
  total?: number;
  meta?: { total: number; limit: number; offset: number };
}

// ─── Notifications ─────────────────────────────────────────────────────────

export type NotificationCategory = 'booking' | 'payment' | 'review' | 'system' | string;

export interface AppNotification {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  category?: NotificationCategory;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  data?: Record<string, unknown>;
}

export interface NotificationsResponse {
  success: boolean;
  data: AppNotification[];
  total?: number;
  unreadCount?: number;
}

