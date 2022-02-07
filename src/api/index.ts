import axios from 'axios'
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { getLocalStorageWithExpiry } from '@/utils/localStorage'
import { ElMessage } from 'element-plus'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PORTAL_ENDPOINT as string,
  // timeout: 5000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(function (config: AxiosRequestConfig) {
  const token = getLocalStorageWithExpiry('access_token')
  if (token) {
    (config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${token}`;
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
  const { data } : any = response
  if (data.error) {
    if (data.error === 'Header authorization not provided' || data.error.message === 'Header authorization not provided') {
      ElMessage({
        type: 'error',
        message: 'Session expired please login again'
      })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      ElMessage({
        type: 'error',
        message: data.error[0].message || data.error
      })
    }
  }
  return response
}, function (error) {
  if (error.response) {
    if (error.response.data.message === 'Header authorization not provided') {
      ElMessage({
        type: 'error',
        message: 'Session expired please login again'
      })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
    if (error.response.data != null && error.response.data.message != null) {
      ElMessage({
        type: 'error',
        message: error.response.data.message
      })
    }
  }
  return Promise.reject(error)
})

export default axiosInstance