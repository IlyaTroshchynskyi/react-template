// Token storage service - simulates token management
const TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

// Initial mock tokens
const INITIAL_ACCESS_TOKEN = 'mock-access-token-12345'
const INITIAL_REFRESH_TOKEN = 'mock-refresh-token-67890'

export const tokenService = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || INITIAL_ACCESS_TOKEN
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || INITIAL_REFRESH_TOKEN
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  // Simulate token refresh - in real app this would call auth endpoint
  refreshTokens: async (): Promise<{ accessToken: string; refreshToken: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const newAccessToken = `mock-access-token-${Date.now()}`
    const newRefreshToken = `mock-refresh-token-${Date.now()}`

    tokenService.setTokens(newAccessToken, newRefreshToken)

    console.log('🔄 Tokens refreshed:', { newAccessToken, newRefreshToken })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  },
}
