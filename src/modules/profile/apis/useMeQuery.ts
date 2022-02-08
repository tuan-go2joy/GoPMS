import { AxiosError } from 'axios';
import { useQuery } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { GENDER } from '~/api/common/useConstantsQuery';
import { QUERY_KEY } from '~/api/queryKeys';

//====================================
// Interfaces
//====================================

export interface IMeQueryResData {
  id: number;
  name: string;
  email: string;
  mobile: string;
  sex: GENDER;
  profile: {
    id: number;
    name: string;
  };
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<IMeQueryResData>('/accounts/me/get');
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useMeQuery = () => {
  return useQuery<IMeQueryResData, AxiosError<unknown>>(QUERY_KEY.ME, fetchFn);
};
