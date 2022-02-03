import { useAuth } from '~/composables/useAuth';
import { PROD_API_URL, DEV_API_URL } from '~/constants';
import axios from 'axios';

const { accessToken } = useAuth();

export const axiosClient = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? PROD_API_URL : DEV_API_URL,
  headers: { Accept: 'application/json' },
});

// ***** IMPORTANT *****
// Dynamically setting a header everytime request is sent.
axiosClient.interceptors.request.use((config) => {
  config.headers = { ...config.headers, Authorization: `Bearer ${accessToken.value}` };
  return config;
});
