import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';
import { IFloorsQueryResDatum } from './useFloorsQuery';
import { IRoomsQueryResDatum } from './useRoomsQuery';

//====================================
// Interfaces
//====================================

export interface ICreateFloorMutationPayload {
  name: string;
}

export interface ICreateFloorMutationResData extends ICreateFloorMutationPayload {
  id: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TCreateFloorMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICreateFloorMutationPayload) => {
  const { data } = await axiosClient.post('/rooms/floor/create/', payload);
  return data;
};

//====================================
// Main Function
//====================================

export const useCreateFloorMutation = () => {
  const queryClient = useQueryClient();

  const updateFloorsQueryCache = (resData: ICreateFloorMutationResData) => {
    const prevCache = queryClient.getQueryData<IFloorsQueryResDatum[]>(QUERY_KEY.FLOORS);
    if (!prevCache) return;
    queryClient.setQueryData<IFloorsQueryResDatum[]>(QUERY_KEY.FLOORS, () => [
      ...prevCache,
      { ...resData },
    ]);
  };

  const updateRoomssQueryCache = (resData: ICreateFloorMutationResData) => {
    const prevCache = queryClient.getQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS);
    if (!prevCache) return;
    queryClient.setQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS, () => [
      ...prevCache,
      { room_floor_id: resData.id, room_floor_name: resData.name, list_rooms: [] },
    ]);
  };

  return useMutation<
    ICreateFloorMutationResData,
    AxiosError<TCreateFloorMutationResErr>,
    ICreateFloorMutationPayload
  >(fetchFn, {
    onSuccess: (resData) => {
      updateFloorsQueryCache(resData);
      updateRoomssQueryCache(resData);
    },
  });
};
