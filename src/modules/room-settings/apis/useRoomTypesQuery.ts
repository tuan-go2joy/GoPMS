import { useQuery, useQueryClient } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';

//====================================
// Interfaces
//====================================

export interface IRoomTypesQueryResDatum {
  id: number;
  code: string;
  name: string;
  num_of_room: number;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<IRoomTypesQueryResDatum[]>('/rooms/room_type/list/');
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRoomTypesQuery = () => {
  const queryClient = useQueryClient();
  const useQueryResult = useQuery(QUERY_KEY.ROOM_TYPES, fetchFn);

  const findRoomTypeCodeById = (id: number) => {
    const roomTypesCache = queryClient.getQueryData<IRoomTypesQueryResDatum[]>(
      QUERY_KEY.ROOM_TYPES,
    );
    return roomTypesCache?.find((roomType) => roomType.id === id)?.code;
  };

  const findRoomTypeIdByCode = (code?: string) => {
    if (!code) return;
    const roomTypesCache = queryClient.getQueryData<IRoomTypesQueryResDatum[]>(
      QUERY_KEY.ROOM_TYPES,
    );
    return roomTypesCache?.find((roomType) => roomType.code === code)?.id;
  };

  return { ...useQueryResult, findRoomTypeCodeById, findRoomTypeIdByCode };
};
