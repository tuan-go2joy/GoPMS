import { AxiosError } from 'axios';
import { reactive } from 'vue';
import { useQuery, UseQueryOptions } from 'vue-query';
import { useRouter } from 'vue-router';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';
import { useAuth } from '~/composables/useAuth';
import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN, LS_USER_ID } from '~/constants';
import { ISigninMutationResData__extra } from './useSigninMutation';

//===================================
// Interfaces
//===================================

interface IRefreshTokenQueryResData {
  extra: ISigninMutationResData__extra;
  access: string;
}

interface IVerifyTokenQueryResData {
  extra: ISigninMutationResData__extra;
}

interface IVerifyTokenQueryErr {
  detail: string;
  code: string;
}

//===================================
// Functions
//===================================

const verifyFetchFn = async () => {
  const userId = localStorage.getItem(LS_USER_ID);
  const token = localStorage.getItem(LS_ACCESS_TOKEN);

  const { data } = await axiosClient.post<IVerifyTokenQueryResData>(
    '/authentication/token/verify/',
    {
      user_id: userId,
      token,
    },
  );
  return data;
};

const refreshFetchFn = async () => {
  const refresh = localStorage.getItem(LS_REFRESH_TOKEN);
  const userId = localStorage.getItem(LS_USER_ID);
  const { data } = await axiosClient.post<IRefreshTokenQueryResData>(
    '/authentication/token/refresh/',
    {
      refresh,
      user_id: userId,
    },
  );
  return data;
};

//===================================
// MAIN FUNCTION
//===================================

export const useToken = () => {
  const router = useRouter();
  const { isLoggedIn, refreshAccessToken, signout } = useAuth();

  //---------------------
  // Verify Token
  //----------------------

  const useVerifyTokenQueryOptions = reactive<
    UseQueryOptions<IVerifyTokenQueryResData, AxiosError<IVerifyTokenQueryErr>>
  >({
    enabled: isLoggedIn as unknown as boolean, // To satisfy UseQueryOptions type. This is not right. It should be taken care of by vue-query dev team.
    retry: false,
  });

  const useVerifyTokenQuery = useQuery(QUERY_KEY.TOKEN, verifyFetchFn, useVerifyTokenQueryOptions);

  //---------------------
  // Refresh Token
  //----------------------

  const useRefreshTokenQueryOptions = reactive<UseQueryOptions<IRefreshTokenQueryResData>>({
    //
    // Refresh token query will be enabled only if verify token query fails.
    enabled: useVerifyTokenQuery.isError as unknown as boolean,
    retry: false,
    //
    // If token is refreshed, update access token.
    onSuccess: (resData) => {
      refreshAccessToken(resData.access);
      useVerifyTokenQuery.refetch.value();
    },
    //
    // If refresh token is failed, log user out.
    onError: () => {
      signout(router);
    },
  });

  useQuery(QUERY_KEY.REFRESH, refreshFetchFn, useRefreshTokenQueryOptions);

  return { ...useVerifyTokenQuery };
};
