import { useQuery } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';

//====================================
// Interfaces
//====================================

export interface IFloorsQueryResDatum {
  id: number;
  name: string;
}

//====================================
// Fetch Function
//====================================

const fetchFn = async () => {
  const { data } = await axiosClient.get<IFloorsQueryResDatum[]>('/rooms/floor/list-for-display/');
  return data;
};

//====================================
// MAIN FUNCTION
//====================================

export const useFloorsQuery = () => {
  return useQuery<IFloorsQueryResDatum[]>(QUERY_KEY.FLOORS, fetchFn);
};
