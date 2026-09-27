import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userData, token) => {
        localStorage.setItem('marketlink_token', token)
        set({ user: userData, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('marketlink_token')
        set({ user: null, isAuthenticated: false })
      },
    }),
    { name: 'marketlink-auth' }
  )
)