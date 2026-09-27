import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminRoutes from '@/routes/AdminRoutes'
import FarmerRoutes from '@/routes/FarmerRoutes'
import PublicRoutes from './routes/PublicRoutes'
import ScrollToTop from './hooks/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/farmer/*" element={<FarmerRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App