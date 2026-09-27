import { Outlet } from 'react-router-dom'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-ivory">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer/>
    </div>
  )
}