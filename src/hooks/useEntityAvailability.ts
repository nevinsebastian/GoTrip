import { useMutation, useQuery } from '@tanstack/react-query';

import { checkAvailability } from '@/src/api/booking.service';
import { fetchAvailability } from '@/src/api/consumerListing.service';
import type {
  APIError,
  AvailabilityEntityType,
  AvailabilityResponse,
  CheckAvailabilityRequest,
  CheckAvailabilityResponse,
} from '@/src/api/types';
import {
  buildDisabledDatesFromAvailability,
  monthRangeAround,
} from '@/src/utils/availabilityCalendar';
import { useMemo } from 'react';

export const entityAvailabilityQueryKey = (
  entityType: AvailabilityEntityType,
  entityId: string,
  startDate: string,
  endDate: string,
) => ['availability', entityType, entityId, startDate, endDate] as const;

export function useEntityAvailability(
  entityType: AvailabilityEntityType | undefined,
  entityId: string | undefined,
  anchorDate?: string | null,
  enabled = true,
) {
  const anchor = anchorDate?.trim() || new Date().toISOString().slice(0, 10);
  const { startDate, endDate } = monthRangeAround(anchor, 2);

  const query = useQuery<AvailabilityResponse, APIError>({
    queryKey: entityAvailabilityQueryKey(entityType ?? 'room_type', entityId ?? '', startDate, endDate),
    queryFn: () => {
      if (!entityType || !entityId) throw new Error('Availability entity is required');
      return fetchAvailability(entityType, entityId, startDate, endDate);
    },
    enabled: enabled && Boolean(entityType && entityId),
    staleTime: 60_000,
  });

  const disabledDates = useMemo(
    () => buildDisabledDatesFromAvailability(query.data?.availability),
    [query.data?.availability],
  );

  return {
    ...query,
    disabledDates,
    startDate,
    endDate,
  };
}

export function useCheckAvailability() {
  return useMutation<CheckAvailabilityResponse, APIError, CheckAvailabilityRequest>({
    mutationFn: checkAvailability,
  });
}
