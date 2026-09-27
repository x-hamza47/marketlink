import { BrowserRouter } from 'react-router-dom'
import AdminRoutes from '@/routes/AdminRoutes'
import FarmerRoutes from '@/routes/FarmerRoutes'
import PublicRoutes from './routes/PublicRoutes'
import ScrollToTop from './hooks/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <PublicRoutes />
      <AdminRoutes />
      <FarmerRoutes />
    </BrowserRouter>
  )
}

export default App