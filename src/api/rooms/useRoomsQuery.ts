import { useQuery } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';

//====================================
// Interfaces
//====================================

export interface IRoomsQueryResDatum__room {
  id: number;
  room_type_code: string;
  name: string;
}

export interface IRoomsQueryResDatum {
  room_floor_id: number;
  room_floor_name: string;
  list_rooms: IRoomsQueryResDatum__room[];
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<IRoomsQueryResDatum[]>('/rooms/list-for-display/');
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useRoomsQuery = () => {
  const useQueryResult = useQuery<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS, fetchFn);

  const findRoomByRoomId = (roomId?: number): IRoomsQueryResDatum__room | null => {
    if (!roomId) return null;
    const floors = useQueryResult.data.value;
    if (!floors) return null;
    let result: IRoomsQueryResDatum__room | null = null;
    for (let i = 0; i < floors.length; i++) {
      const rooms = floors[i].list_rooms;
      for (let j = 0; j < rooms.length; j++) {
        const room = rooms[j];
        if (room.id === roomId) {
          result = room;
          break;
        }
      }
    }
    return result;
  };

  const findRoomsByFloorId = (floorId?: number): IRoomsQueryResDatum__room[] | null => {
    if (!floorId) return null;
    const floors = useQueryResult.data.value;
    return floors?.find((floor) => floor.room_floor_id === floorId)?.list_rooms ?? null;
  };

  return { ...useQueryResult, findRoomByRoomId, findRoomsByFloorId };
};
