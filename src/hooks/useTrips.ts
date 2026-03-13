// src/hooks/useTrips.ts
// React Query query hook for fetching trips.

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchTrips } from '../api/trip.service';
import type { Trip, APIError } from '../api/types';

export const TRIPS_QUERY_KEY = ['trips'];

export const useTrips = (): UseQueryResult<Trip[], APIError> => {
  return useQuery<Trip[], APIError>({
    queryKey: TRIPS_QUERY_KEY,
    queryFn: fetchTrips,
  });
};

