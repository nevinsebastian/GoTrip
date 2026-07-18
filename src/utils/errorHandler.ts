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

    const fieldDetails = Array.isArray(data?.details) ? data.details : null;
    const firstFieldError = fieldDetails?.find(
      (item: unknown) => item && typeof item === 'object' && 'msg' in (item as object),
    ) as { path?: string; msg?: string } | undefined;

    const detailsMessage =
      typeof data?.details === 'string'
        ? data.details
        : Array.isArray(data?.errors) && data.errors.length
          ? data.errors
              .map((e: unknown) =>
                typeof e === 'string'
                  ? e
                  : e && typeof e === 'object' && 'message' in e
                    ? String((e as { message: unknown }).message)
                    : null,
              )
              .filter(Boolean)
              .join('; ')
          : undefined;

    const apiError: APIError = {
      message:
        (data?.message as string) ||
        (firstFieldError?.path && firstFieldError?.msg
          ? `${firstFieldError.path}: ${firstFieldError.msg}`
          : firstFieldError?.msg) ||
        detailsMessage ||
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
    } else if (
      !apiError.message ||
      apiError.message === 'undefined' ||
      apiError.message.toLowerCase() === 'internal server error'
    ) {
      apiError.message =
        status === 400
          ? 'Payment could not be started (server payment error). Please try again shortly.'
          : 'Something went wrong. Please try again.';
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
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as APIError).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  const normalized = normalizeApiError(error);
  return normalized.message;
};

