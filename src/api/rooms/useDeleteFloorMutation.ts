import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'vue-query';
import { axiosClient } from '~/api/axiosClient';
import { QUERY_KEY } from '~/api/queryKeys';
import { IFloorsQueryResDatum } from './useFloorsQuery';
import { IRoomsQueryResDatum } from './useRoomsQuery';

//====================================
// Interfaces
//====================================

export interface IDeleteFloorMutationVariables {
  floor_id: number;
}

/**
 * @todo Compare this interface with the real response data.
 */
export type TDeleteFloorMutationResErr = {
  [key in string]?: string | string[];
};

//====================================
// Fetch Function
//====================================

const fetchFn = async ({ floor_id }: IDeleteFloorMutationVariables) => {
  await axiosClient.delete(`/rooms/floor/delete/${floor_id}`);
  return;
};

//====================================
// Main Function
//====================================

export const useDeleteFloorMutation = () => {
  const queryClient = useQueryClient();

  const updateFloorsQuery = (variables: IDeleteFloorMutationVariables) => {
    const prevCache = queryClient.getQueryData<IFloorsQueryResDatum[]>(QUERY_KEY.FLOORS);
    if (!prevCache) return;

    queryClient.setQueryData<IFloorsQueryResDatum[]>(QUERY_KEY.FLOORS, () =>
      prevCache.filter((floor) => floor.id !== variables.floor_id),
    );
  };

  const updateRoomsQuery = (variables: IDeleteFloorMutationVariables) => {
    const prevCache = queryClient.getQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS);
    if (!prevCache) return;

    queryClient.setQueryData<IRoomsQueryResDatum[]>(QUERY_KEY.ROOMS, () =>
      prevCache.filter((floor) => floor.room_floor_id !== variables.floor_id),
    );
  };

  return useMutation<void, AxiosError<TDeleteFloorMutationResErr>, IDeleteFloorMutationVariables>(
    fetchFn,
    {
      onSuccess: (_, variables) => {
        updateFloorsQuery(variables);
        updateRoomsQuery(variables);
      },
    },
  );
};
