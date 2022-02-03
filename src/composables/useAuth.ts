import { reactive, toRefs } from 'vue';
import { Router } from 'vue-router';
import { LS_ACCESS_TOKEN, LS_ACCOMMODATION_ID, LS_REFRESH_TOKEN, LS_USER_ID } from '~/constants';

//===================================
// Interfaces
//===================================

interface IUseAuthState {
  accommodationId: number | null;
  refreshToken: string | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  userId: number | null;
}

//===================================
// Initial values from the localstorage
//===================================

const accommodationId = localStorage.getItem(LS_ACCOMMODATION_ID);
const refreshToken = localStorage.getItem(LS_REFRESH_TOKEN);
const accessToken = localStorage.getItem(LS_ACCESS_TOKEN);
const userId = localStorage.getItem(LS_USER_ID);

//===================================
// State
//===================================

const state = reactive<IUseAuthState>({
  accommodationId: accommodationId ? +accommodationId : null,
  refreshToken,
  accessToken,
  isLoggedIn: !!accessToken && !!refreshToken,
  userId: userId ? +userId : null,
});

//===================================
// MAIN FUNCTION
//===================================

export const useAuth = () => {
  const signin = (payload: {
    accommodationId: number;
    refresh: string;
    access: string;
    userId: number;
  }) => {
    localStorage.setItem(LS_ACCOMMODATION_ID, payload.accommodationId + '');
    localStorage.setItem(LS_REFRESH_TOKEN, payload.refresh);
    localStorage.setItem(LS_ACCESS_TOKEN, payload.access);
    localStorage.setItem(LS_USER_ID, payload.userId + '');
    state.accommodationId = payload.accommodationId;
    state.refreshToken = payload.refresh;
    state.accessToken = payload.access;
    state.isLoggedIn = true;
    state.userId = payload.userId;
  };

  const signout = (router: Router) => {
    localStorage.removeItem(LS_ACCOMMODATION_ID);
    localStorage.removeItem(LS_REFRESH_TOKEN);
    localStorage.removeItem(LS_ACCESS_TOKEN);
    localStorage.removeItem(LS_USER_ID);
    state.accommodationId = null;
    state.refreshToken = null;
    state.accessToken = null;
    state.isLoggedIn = false;
    state.userId = null;
    router?.push('/login');
  };

  const refreshAccessToken = (newAccessToken: string) => {
    localStorage.setItem(LS_ACCESS_TOKEN, newAccessToken);
    state.accessToken = newAccessToken;
  };

  return { ...toRefs(state), signin, signout, refreshAccessToken };
};
