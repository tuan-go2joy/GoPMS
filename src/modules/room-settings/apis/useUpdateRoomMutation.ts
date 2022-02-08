import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';
import { IRoomsQueryResDatum } from './useRoomsQuery';
import { IRoomTypesQueryResDatum, useRoomTypesQuery } from './useRoomTypesQuery';
import { ICreateRoomMutationPayload, ICreateRoomMutationResData } from './useCreateRoomMutation';

//====================================
// Interfaces
//====================================

export interface IUpdateRoomMutationPayload extends ICreateRoomMutationPayload {
  room_id: number;
}

export interface IUpdateRoomMutationResData extends ICreateRoomMutationResData {}

/**
 * @todo Compare this interface with the real response data.
 */
export type TUpdateRoomMutationResErr = {
  [key in string]?: string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ room_id, ...rest }: IUpdateRoomMutationPayload) => {
  const { data } = await axiosClient.put<IUpdateRoomMutationResData>(`/rooms/update/${room_id}`, {
    ...rest,
  });
  return data;
};

//====================================
// Main Function
//====================================

export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient();
  const { findRoomTypeCodeById } = useRoomTypesQuery();

  const updateRoomsCache = (resData: IUpdateRoomMutationResData) => {
    const prevCache = queryClient.getQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS);
    if (!prevCache) return;

    const prevRoom = prevCache
      .flatMap(({ list_rooms, room_floor_id, room_floor_name }) =>
        list_rooms.map((room) => ({ ...room, room_floor_id, room_floor_name })),
      )
      .find((room) => room.id === resData.id);
    if (!prevRoom) return;

    const roomTypeCode = findRoomTypeCodeById(resData.room_type);
    if (!roomTypeCode) return;

    queryClient.setQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS, () => {
      const isFloorUpdated = prevRoom.room_floor_id !== resData.room_floor;
      switch (isFloorUpdated) {
        case true:
          return prevCache.map((floor) => {
            if (floor.room_floor_id !== resData.room_floor) {
              return {
                ...floor,
                list_rooms: floor.list_rooms.filter((room) => room.id !== resData.id),
              };
            } else {
              return {
                ...floor,
                list_rooms: [
                  ...floor.list_rooms,
                  {
                    id: resData.id,
                    name: resData.name,
                    room_type_code: roomTypeCode,
                    room_type_id: resData.room_type,
                  },
                ],
              };
            }
          });
        case false:
          return prevCache.map((floor) => {
            if (floor.room_floor_id !== resData.room_floor) {
              return floor;
            } else {
              return {
                ...floor,
                list_rooms: floor.list_rooms.map((room) => {
                  if (room.id !== resData.id) return room;
                  return {
                    id: resData.id,
                    name: resData.name,
                    room_type_code: roomTypeCode,
                    room_type_id: resData.room_type,
                  };
                }),
              };
            }
          });
      }
    });

    return prevRoom.room_type_code;
  };

  const updateRoomTypesCache = (resData: IUpdateRoomMutationResData, prevRoomTypeCode?: string) => {
    const prevCache = queryClient.getQueryData<IRoomTypesQueryResDatum[]>(QUERY_KEY.ROOM_TYPES);
    if (!prevCache || !prevRoomTypeCode) return;
    queryClient.setQueryData<IRoomTypesQueryResDatum[]>(QUERY_KEY.ROOM_TYPES, () => {
      return prevCache.map((roomType) => {
        if (roomType.id === resData.room_type)
          return { ...roomType, num_of_room: roomType.num_of_room + 1 };
        if (roomType.code === prevRoomTypeCode)
          return { ...roomType, num_of_room: roomType.num_of_room - 1 };
        return roomType;
      });
    });
  };

  return useMutation<
    IUpdateRoomMutationResData,
    AxiosError<TUpdateRoomMutationResErr>,
    IUpdateRoomMutationPayload
  >(fetchFn, {
    onSuccess: (resData) => {
      const prevRoomTypeCode = updateRoomsCache(resData);
      updateRoomTypesCache(resData, prevRoomTypeCode);
    },
  });
};
