import { create } from 'zustand'
import { persist } from 'zustand/middleware'


export const useUiStore = create(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isMobileNavOpen: false,

      toggleSidebarCollapsed: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      openMobileNav: () => set({ isMobileNavOpen: true }),
      closeMobileNav: () => set({ isMobileNavOpen: false }),
    }),
    {
      name: 'marketlink-ui', 
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    }
  )
)