import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';
import { IRoomTypesQueryResDatum } from './useRoomTypesQuery';

//====================================
// Interfaces
//====================================

export interface ICreateRoomTypeMutationPayload {
  code: string;
  name: string;
  capacity_adult: number;
  capacity_child?: number;
  num_of_bed: number;
}

export interface ICreateRoomTypeMutationResData extends ICreateRoomTypeMutationPayload {
  id: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TCreateRoomTypeMutationResErr = {
  [key in string]?: string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICreateRoomTypeMutationPayload) => {
  const { data } = await axiosClient.post('/rooms/room_type/create/', payload);
  return data;
};

//====================================
// Main Function
//====================================

export const useCreateRoomTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ICreateRoomTypeMutationResData,
    AxiosError<TCreateRoomTypeMutationResErr>,
    ICreateRoomTypeMutationPayload
  >(fetchFn, {
    onSuccess: (resData) => {
      const prevCache = queryClient.getQueryData<IRoomTypesQueryResDatum[]>(QUERY_KEY.ROOM_TYPES);
      if (!prevCache) return;
      queryClient.setQueryData<IRoomTypesQueryResDatum[]>(QUERY_KEY.ROOM_TYPES, () => {
        return [
          { id: resData.id, num_of_room: 0, code: resData.code, name: resData.name },
          ...prevCache,
        ];
      });
    },
  });
};
