import { BrowserRouter } from 'react-router-dom'
import AdminRoutes from '@/routes/AdminRoutes'
import FarmerRoutes from '@/routes/FarmerRoutes'

function App() {
  return (
    <BrowserRouter>
      <AdminRoutes />
      <FarmerRoutes />
    </BrowserRouter>
  )
}

export default App