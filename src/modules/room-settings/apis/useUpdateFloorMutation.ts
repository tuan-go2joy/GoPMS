import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';
import { IFloorsQueryResDatum } from './useFloorsQuery';
import { IRoomsQueryResDatum } from './useRoomsQuery';
import { ICreateFloorMutationResData } from './useCreateFloorMutation';

//====================================
// Interfaces
//====================================

export interface IUpdateFloorMutationPayload {
  floor_id: number;
  name: string;
}

export interface IUpdateFloorMutationResData extends ICreateFloorMutationResData {}

/**
 * @todo Compare this interface with the real response data.
 */
export type TUpdateFloorMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ floor_id, name }: IUpdateFloorMutationPayload) => {
  const { data } = await axiosClient.put(`/rooms/floor/update/${floor_id}`, { name });
  return data;
};

//====================================
// Main Function
//====================================

export const useUpdateFloorMutation = () => {
  const queryClient = useQueryClient();

  const updateFloorsQueryCache = (resData: IUpdateFloorMutationResData) => {
    const prevCache = queryClient.getQueryData<IFloorsQueryResDatum[]>(QUERY_KEY.FLOORS);
    if (!prevCache) return;
    queryClient.setQueryData<IFloorsQueryResDatum[]>(QUERY_KEY.FLOORS, () =>
      prevCache.map((floor) => (floor.id !== resData.id ? floor : { ...resData })),
    );
  };

  const updateRoomsQueryCache = (resData: IUpdateFloorMutationResData) => {
    const prevCache = queryClient.getQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS);
    if (!prevCache) return;
    queryClient.setQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS, () =>
      prevCache.map((floor) => {
        if (floor.room_floor_id !== resData.id) return floor;
        return {
          room_floor_id: resData.id,
          room_floor_name: resData.name,
          list_rooms: floor.list_rooms,
        };
      }),
    );
  };

  return useMutation<
    IUpdateFloorMutationResData,
    AxiosError<TUpdateFloorMutationResErr>,
    IUpdateFloorMutationPayload
  >(fetchFn, {
    onSuccess: (resData) => {
      updateFloorsQueryCache(resData);
      updateRoomsQueryCache(resData);
    },
  });
};
