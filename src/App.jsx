import { BrowserRouter } from 'react-router-dom'
import AdminRoutes from '@/routes/AdminRoutes'
import FarmerRoutes from '@/routes/FarmerRoutes'
import PublicRoutes from './routes/PublicRoutes'

function App() {
  return (
    <BrowserRouter>
      <PublicRoutes />
      <AdminRoutes />
      <FarmerRoutes />
    </BrowserRouter>
  )
}

export default App