import { AxiosError } from 'axios';
import { useMutation } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { GENDER, PERMISSION } from '~/api/common/useConstantsQuery';

//====================================
// Interfaces
//====================================

export interface ISigninMutationVariables {
  email: string;
  password: string;
}

interface ISigninMutationResData__extra__profile {
  id: number;
  name: string;
  permissions: {
    [key in keyof typeof PERMISSION]: { readable: boolean | null; editable: boolean | null };
  };
}

export interface ISigninMutationResData__extra {
  id: number;
  accomm_id: number;
  email: string;
  name: string;
  sex: GENDER;
  mobile: string;
  profile: ISigninMutationResData__extra__profile;
  is_admin: boolean;
  is_active: boolean;
  is_verified: boolean;
}

export interface ISigninMutationResData {
  extra: ISigninMutationResData__extra;
  access: string;
  refresh: string;
}

//====================================
// Response Error Interfaces
//====================================

export interface ISigninMutationResErr {
  email: string[];
  password: string[];
  detail: string;
}

//====================================
// Fetch function
//====================================

const fetchFn = async (payload: ISigninMutationVariables) => {
  const { data } = await axiosClient.post<ISigninMutationResData>(
    '/authentication/token/',
    payload,
  );

  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useSigninMutation = () => {
  return useMutation<
    ISigninMutationResData,
    AxiosError<ISigninMutationResErr>,
    ISigninMutationVariables
  >(fetchFn);
};
