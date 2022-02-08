import { useQuery } from 'vue-query';
import { QueryFunctionContext, QueryKey } from 'vue-query/types';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';

//====================================
// Interfaces & Types
//====================================

export interface IRoomTypeQueryResData {
  id: number;
  code: string;
  name: string;
  capacity_adult: number;
  capacity_child?: number;
  num_of_bed: number;
  is_active: boolean;
}

type TRoomTypeQueryKey = [QUERY_KEY.ROOM_TYPES, number];

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ queryKey }: QueryFunctionContext<QueryKey>) => {
  const [, roomTypeId] = queryKey as TRoomTypeQueryKey;
  if (!roomTypeId) return;
  const { data } = await axiosClient.get<IRoomTypeQueryResData>(
    `/rooms/room_type/get/${roomTypeId}`,
  );
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRoomTypeQuery = (id: number) => {
  const queryKey: TRoomTypeQueryKey = [QUERY_KEY.ROOM_TYPES, id];
  return useQuery<IRoomTypeQueryResData | undefined>(queryKey, fetchFn);
};
