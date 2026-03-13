// src/utils/errorHandler.ts
// Utilities for normalizing and working with API/network errors.

import axios, { AxiosError } from 'axios';
import type { APIError } from '../api/types';

export const normalizeApiError = (error: unknown): APIError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    if (!axiosError.response) {
      return {
        message:
          'Network error. Please check your internet connection and try again.',
        isNetworkError: true,
      };
    }

    const { status, data } = axiosError.response;

    const apiError: APIError = {
      message:
        (data?.message as string) ||
        (data?.error as string) ||
        `Request failed with status ${status}`,
      statusCode: status,
      code: data?.code,
      details: data,
      fieldErrors: data?.errors,
      isUnauthorized: status === 401,
    };

    if (status >= 500) {
      apiError.message =
        'Server error. Please try again later or contact support.';
    } else if (status === 401) {
      apiError.message = 'Your session has expired. Please log in again.';
    } else if (status === 403) {
      apiError.message =
        'You do not have permission to perform this action.';
    }

    return apiError;
  }

  return {
    message:
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again.',
  };
};

export const getErrorMessage = (error: unknown): string => {
  const normalized = normalizeApiError(error);
  return normalized.message;
};

