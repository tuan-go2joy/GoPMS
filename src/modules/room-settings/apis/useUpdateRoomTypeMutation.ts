import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';
import { IRoomsQueryResDatum, IRoomsQueryResDatum__room } from './useRoomsQuery';
import { IRoomTypesQueryResDatum } from './useRoomTypesQuery';

//====================================
// Interfaces
//====================================

export interface IUpdateRoomTypeMutationPayload {
  id: number;
  code: string;
  name: string;
  capacity_adult: number;
  capacity_child?: number;
  num_of_bed: number;
  is_active: boolean;
}

export interface IUpdateRoomTypeMutationResData extends IUpdateRoomTypeMutationPayload {}

/**
 * @todo Compare this interface with the real response data.
 */
export type TUpdateRoomTypeMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ id, ...rest }: IUpdateRoomTypeMutationPayload) => {
  const { data } = await axiosClient.put(`/rooms/room_type/update/${id}`, rest);
  return data;
};

//====================================
// Main Function
//====================================

export const useUpdateRoomTypeMutation = () => {
  const queryClient = useQueryClient();

  const updateRoomTypesQueryCache = (resData: IUpdateRoomTypeMutationResData) => {
    const prevCache = queryClient.getQueryData<IRoomTypesQueryResDatum[]>(QUERY_KEY.ROOM_TYPES);
    if (!prevCache) return;
    queryClient.setQueryData<IRoomTypesQueryResDatum[]>(QUERY_KEY.ROOM_TYPES, () => {
      return prevCache.map((roomType) => {
        if (roomType.id !== resData.id) return roomType;
        return {
          id: resData.id,
          num_of_room: roomType.num_of_room,
          name: resData.name,
          code: resData.code,
        };
      });
    });
  };

  const updateRoomsQueryCache = (resData: IUpdateRoomTypeMutationResData) => {
    const prevCache = queryClient.getQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS);
    if (!prevCache) return;
    queryClient.setQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS, () => {
      return prevCache.map((floor) => {
        const listRooms: IRoomsQueryResDatum__room[] = floor.list_rooms.map((room) => ({
          ...room,
          room_type_code: resData.code,
        }));
        return { ...floor, list_rooms: listRooms };
      });
    });
  };

  return useMutation<
    IUpdateRoomTypeMutationResData,
    AxiosError<TUpdateRoomTypeMutationResErr>,
    IUpdateRoomTypeMutationPayload
  >(fetchFn, {
    onSuccess: (resData) => {
      updateRoomTypesQueryCache(resData);
      updateRoomsQueryCache(resData);
    },
  });
};
