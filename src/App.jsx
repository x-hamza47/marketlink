import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminRoutes from '@/routes/AdminRoutes'
import FarmerRoutes from '@/routes/FarmerRoutes'
import PublicRoutes from './routes/PublicRoutes'
import ScrollToTop from './hooks/ScrollToTop'
import { useAuthStore } from '@/stores/authStore'
import { useFavoritesStore } from '@/stores/favoritesStore'

import AiChatWidget from '@/components/public/AiChatWidget'

function App() {
  const { isAuthenticated } = useAuthStore()
  const { loadFavorites } = useFavoritesStore()

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    }
  }, [isAuthenticated, loadFavorites])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/farmer/*" element={<FarmerRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
      <AiChatWidget />
    </BrowserRouter>
  )
}

export default App