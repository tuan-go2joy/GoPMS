import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';

//====================================
// Interfaces
//====================================

export interface IUpdatePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface IUpdatePasswordResErr {
  message: string[];
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: IUpdatePasswordPayload) => {
  const { data } = await axiosClient.put('/accounts/me/update-password', payload);

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useUpdatePasswordMutation = () => {
  return useMutation<undefined, AxiosError<IUpdatePasswordResErr>, IUpdatePasswordPayload>(fetchFn);
};
