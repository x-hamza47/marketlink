import { create } from 'zustand'



const MOCK_USER = {
  id: 'usr_001',
  name: 'Hamza Aamir',
  email: 'hamza@marketlink.app',
  role: 'admin', // 'admin' | 'farmer' | 'customer'
  avatarUrl: null,
}

export const useAuthStore = create((set) => ({
  user: MOCK_USER, 
  isAuthenticated: true,

  login: (userData /*, token */) => {
    // --- LIVE USAGE (once backend exists) ---
    // localStorage.setItem('marketlink_token', token)
    set({ user: userData, isAuthenticated: true })
  },

  logout: () => {
    // --- LIVE USAGE (once backend exists) ---
    // localStorage.removeItem('marketlink_token')
    set({ user: null, isAuthenticated: false })
  },
}))