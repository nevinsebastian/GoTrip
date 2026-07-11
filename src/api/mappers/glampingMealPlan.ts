import type { GlampingMealPlanRequest, MealPlanCode } from '@/src/api/types';
import type { VendorGlampingMealInclusions } from '@/src/constants/vendorGlampingConstants';

export const GLAMPING_MEAL_PLAN_DEFAULT_LABELS: Record<MealPlanCode, string> = {
  EP: 'Room Only',
  CP: 'With Breakfast',
  MAP: 'Breakfast+Dinner',
  AP: 'All Meals',
  AI: 'All Inclusive',
};

export type GlampingMealPlanPriceInput = {
  breakfastPricePp?: number;
  lunchPricePp?: number;
  dinnerPricePp?: number;
};

function buildCustomLabel(inclusions: VendorGlampingMealInclusions): string {
  const parts: string[] = [];
  if (inclusions.includesBreakfast) parts.push('Breakfast');
  if (inclusions.includesLunch) parts.push('Lunch');
  if (inclusions.includesDinner) parts.push('Dinner');
  if (inclusions.includesSnacks) parts.push('Snacks');
  return parts.length ? parts.join(', ') : GLAMPING_MEAL_PLAN_DEFAULT_LABELS.EP;
}

export function resolveGlampingMealPlanCode(
  inclusions: VendorGlampingMealInclusions,
): MealPlanCode {
  const { includesBreakfast, includesLunch, includesDinner, includesSnacks } = inclusions;

  if (includesSnacks) return 'AI';
  if (includesBreakfast && includesLunch && includesDinner) return 'AP';
  if (includesBreakfast && includesDinner && !includesLunch) return 'MAP';
  if (includesBreakfast && !includesLunch && !includesDinner) return 'CP';
  return 'EP';
}

function isStandardCombination(
  inclusions: VendorGlampingMealInclusions,
  planCode: MealPlanCode,
): boolean {
  return resolveGlampingMealPlanCode(inclusions) === planCode && !inclusions.includesSnacks;
}

export function mapGlampingMealPlanFromInclusions(
  inclusions: VendorGlampingMealInclusions,
  prices: GlampingMealPlanPriceInput = {},
  options?: { isDefault?: boolean },
): GlampingMealPlanRequest {
  const planCode = resolveGlampingMealPlanCode(inclusions);
  const label = isStandardCombination(inclusions, planCode)
    ? GLAMPING_MEAL_PLAN_DEFAULT_LABELS[planCode]
    : buildCustomLabel(inclusions);

  return {
    planCode,
    label,
    includesBreakfast: inclusions.includesBreakfast,
    includesLunch: inclusions.includesLunch,
    includesDinner: inclusions.includesDinner,
    breakfastPricePp: inclusions.includesBreakfast ? (prices.breakfastPricePp ?? 0) : 0,
    lunchPricePp: inclusions.includesLunch ? (prices.lunchPricePp ?? 0) : 0,
    dinnerPricePp: inclusions.includesDinner ? (prices.dinnerPricePp ?? 0) : 0,
    isDefault: options?.isDefault ?? true,
  };
}

/** Maps UI selections to one or more backend meal-plan bodies (POST each separately). */
export function mapGlampingMealPlansFromInclusions(
  inclusions: VendorGlampingMealInclusions,
  prices?: GlampingMealPlanPriceInput,
): GlampingMealPlanRequest[] {
  return [mapGlampingMealPlanFromInclusions(inclusions, prices)];
}
