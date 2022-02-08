import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';
import { IRoomsQueryResDatum } from './useRoomsQuery';
import { IRoomTypesQueryResDatum, useRoomTypesQuery } from './useRoomTypesQuery';

//====================================
// Interfaces
//====================================
export interface ICreateRoomMutationPayload {
  name: string;
  room_type_id: number;
  room_floor_id: number;
}

export interface ICreateRoomMutationResData {
  id: number;
  name: string;
  room_type: number;
  room_floor: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TCreateRoomMutationResErr = {
  [key in string]?: string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async (payload: ICreateRoomMutationPayload) => {
  const { data } = await axiosClient.post('/rooms/create/', payload);
  return data;
};

//====================================
// Main Function
//====================================

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();
  const { findRoomTypeCodeById } = useRoomTypesQuery();

  const updateRoomsCache = (resData: ICreateRoomMutationResData) => {
    const prevCache = queryClient.getQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS);
    const roomTypeCode = findRoomTypeCodeById(resData.room_type);
    if (!prevCache || !roomTypeCode) return;
    queryClient.setQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS, () => {
      return prevCache.map((floor) => {
        if (floor.room_floor_id !== resData.room_floor) return floor;
        return {
          ...floor,
          list_rooms: [
            {
              id: resData.id,
              name: resData.name,
              room_type_code: roomTypeCode,
              room_type_id: resData.id,
            },
            ...floor.list_rooms,
          ],
        };
      });
    });
  };

  const updateRoomTypesCache = (resData: ICreateRoomMutationResData) => {
    const prevCache = queryClient.getQueryData<IRoomTypesQueryResDatum[]>(QUERY_KEY.ROOM_TYPES);
    if (!prevCache) return;
    queryClient.setQueryData<IRoomTypesQueryResDatum[]>(QUERY_KEY.ROOM_TYPES, () => {
      return prevCache.map((roomType) => {
        if (roomType.id !== resData.room_type) return roomType;
        return { ...roomType, num_of_room: roomType.num_of_room + 1 };
      });
    });
  };

  return useMutation<
    ICreateRoomMutationResData,
    AxiosError<TCreateRoomMutationResErr>,
    ICreateRoomMutationPayload
  >(fetchFn, {
    onSuccess: (resData) => {
      updateRoomTypesCache(resData);
      updateRoomsCache(resData);
    },
  });
};
