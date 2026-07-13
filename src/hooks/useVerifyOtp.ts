import {
  verifyLoginOtp,
  verifyRegistrationOtp,
} from '@/src/api/auth.service';
import type {
  APIError,
  VerifyLoginOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/src/api/types';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { AUTH_SESSION_QUERY_KEY } from './useIsAuthenticated';

export type VerifyOtpFlow = 'login' | 'register';

export type VerifyOtpVariables =
  | ({ flow?: 'login' } & VerifyLoginOtpRequest)
  | ({ flow: 'register' } & VerifyOtpRequest);

export const useVerifyOtp = (
  defaultFlow: VerifyOtpFlow = 'login',
): UseMutationResult<VerifyOtpResponse, APIError, VerifyOtpVariables> => {
  const queryClient = useQueryClient();

  return useMutation<VerifyOtpResponse, APIError, VerifyOtpVariables>({
    mutationFn: (variables) => {
      const flow = variables.flow ?? defaultFlow;
      if (flow === 'register') {
        const { flow: _flow, ...payload } = variables as { flow: 'register' } & VerifyOtpRequest;
        return verifyRegistrationOtp(payload);
      }
      const { flow: _flow, ...payload } = variables as { flow?: 'login' } & VerifyLoginOtpRequest;
      return verifyLoginOtp(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
    },
  });
};
