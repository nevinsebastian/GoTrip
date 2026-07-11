import type { CreateRoomTypeRequest, MealPlanInput } from '@/src/api/types';
import type { VendorFoodOptionId, VendorRoomConfig } from '@/src/constants/vendorListingConstants';

const BED_TYPE_MAP: Record<string, CreateRoomTypeRequest['bedType']> = {
  'King Size Bed': 'king',
  'Queen Size Bed': 'queen',
  'Twin Beds': 'twin',
  'Single Bed': 'single',
};

export function mapBedTypeToApi(bedType: string): CreateRoomTypeRequest['bedType'] {
  return BED_TYPE_MAP[bedType] ?? 'double';
}

function buildMealPlans(food: VendorFoodOptionId[]): MealPlanInput[] | undefined {
  if (food.length === 0) return undefined;

  const hasBreakfast = food.includes('breakfast');
  const hasLunch = food.includes('lunch');
  const hasDinner = food.includes('dinner');

  if (hasBreakfast && hasLunch && hasDinner) {
    return [
      {
        planCode: 'AP',
        includesBreakfast: true,
        includesLunch: true,
        includesDinner: true,
        isDefault: true,
      },
    ];
  }
  if (hasBreakfast && hasDinner) {
    return [
      {
        planCode: 'MAP',
        includesBreakfast: true,
        includesDinner: true,
        isDefault: true,
      },
    ];
  }
  if (hasBreakfast) {
    return [{ planCode: 'CP', includesBreakfast: true, isDefault: true }];
  }
  if (hasDinner) {
    return [{ planCode: 'EP', isDefault: true }];
  }
  return [{ planCode: 'EP', isDefault: true }];
}

export function mapVendorRoomToCreateRoomTypeRequest(room: VendorRoomConfig): CreateRoomTypeRequest {
  const floorAreaSqft = Number.parseInt(room.floorArea, 10);

  return {
    name: room.roomType.trim(),
    bedType: mapBedTypeToApi(room.bedType),
    numBeds: room.bedCount,
    floorAreaSqft: Number.isFinite(floorAreaSqft) && floorAreaSqft > 0 ? floorAreaSqft : undefined,
    totalUnits: room.totalUnits,
    defaultAdultOccupancy: room.adultsDefault,
    maxAdultOccupancy: room.adultsMax,
    defaultChildOccupancy: room.childrenDefault,
    maxChildOccupancy: room.childrenMax,
    basePricePerNight: room.basePricePerNight,
    extraAdultCharge: room.extraAdultCharge,
    extraChildCharge: room.extraChildCharge,
    mealPlans: buildMealPlans(room.food),
  };
}
