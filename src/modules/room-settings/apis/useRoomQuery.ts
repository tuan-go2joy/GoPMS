import { useQuery } from 'vue-query';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';

//====================================
// Interfaces & Types
//====================================

export interface IRoomQueryResData {
  id: number;
  room_type: number;
  room_floor: number;
}

type TRoomQueryKey = [QUERY_KEY.ROOMS, number];

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, roomId] = queryKey as TRoomQueryKey;
  if (!roomId) return;
  const { data } = await axiosClient.get<IRoomQueryResData>(`/rooms/get/${roomId}`);
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRoomQuery = (roomId: number) => {
  const queryKey: TRoomQueryKey = [QUERY_KEY.ROOMS, roomId];
  return useQuery<IRoomQueryResData | undefined>(queryKey, fetchFn);
};
