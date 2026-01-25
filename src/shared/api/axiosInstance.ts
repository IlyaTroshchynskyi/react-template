import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../constants'
import { tokenService } from './tokenService'

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: AxiosError) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else if (token) {
      resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor - adds auth token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`)

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request error:', error.message)
    return Promise.reject(error)
  }
)

// Response interceptor - handles token refresh on 401
axiosInstance.interceptors.response.use(
  response => {
    console.log(`📥 Response: ${response.status} ${response.config.url}`)
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If 401 error and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for token refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              resolve(axiosInstance(originalRequest))
            },
            reject: (err: AxiosError) => {
              reject(err)
            },
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        console.log('🔐 Token expired, attempting refresh...')
        const { accessToken } = await tokenService.refreshTokens()

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        processQueue(null, accessToken)

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null)
        tokenService.clearTokens()

        // In real app, redirect to login
        console.error('🚫 Token refresh failed, user should be logged out')

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    console.error(`❌ Response error: ${error.response?.status} ${error.config?.url}`)
    return Promise.reject(error)
  }
)
