import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useFavoritesStore } from './favoritesStore'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (userData, token) => {
        localStorage.setItem('marketlink_token', token)
        set({ user: userData, isAuthenticated: true })
        useFavoritesStore.getState().loadFavorites()
      },

      logout: () => {
        localStorage.removeItem('marketlink_token')
        set({ user: null, isAuthenticated: false })
        useFavoritesStore.getState().clearFavorites()
      },
    }),
    { name: 'marketlink-auth' }
  )
)