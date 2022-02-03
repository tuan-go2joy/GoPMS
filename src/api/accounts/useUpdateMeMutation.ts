import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { GENDER } from '~/api/common/useConstantsQuery';
import { QUERY_KEY } from '~/api/queryKeys';
import { IMeQueryResData } from './useMeQuery';

//====================================
// Interfaces
//====================================

export interface IUpdateMePayload {
  name: string;
  mobile: string;
  sex: GENDER;
}

export interface IUpdateMeResErr {
  message: string[];
}

export interface IUpdateMeResData extends IUpdateMePayload {}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IUpdateMePayload) => {
  const { data } = await axiosClient.put('/accounts/me/update-details', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdateMeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<IUpdateMeResData, AxiosError<IUpdateMeResErr>, IUpdateMePayload>(fetchFn, {
    onSuccess: (resData) => {
      const queryKey = QUERY_KEY.ME;
      const prevCache = queryClient.getQueryData<IMeQueryResData>(queryKey);

      if (!prevCache) return;
      queryClient.setQueryData<IMeQueryResData>(queryKey, () => {
        return { ...prevCache, ...resData };
      });
    },
  });
};
