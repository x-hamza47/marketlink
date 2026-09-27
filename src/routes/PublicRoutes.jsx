import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import HomePage from '@/pages/public/HomePage'
import ProductsPage from '@/pages/public/ProductsPage'
import ProductDetailPage from '../pages/public/ProductDetailPage'
import CartPage from '../pages/public/CartPage'
import MarketsPage from '../pages/public/MarketsPage'
import MarketDetailPage from '../pages/public/MarketDetailPage'
import OrdersPage from '../pages/public/OrdersPage'
import LoginPage from '../pages/public/LoginPage'
import RegisterPage from '../pages/public/RegisterPage'
import AboutPage from '../pages/public/AboutPage'
import HowItWorksPage from '../pages/public/HowItWorksPage'
import FavoritesPage from '../pages/public/FavoritesPage'
import FarmerDetailPage from '../pages/public/FarmerDetailPage'
import GuestOnlyRoute from '@/components/routing/GuestOnlyRoute'

function ComingSoon({ title }) {
    return (
        <div className="flex items-center justify-center h-64 text-text-secondary text-sm">
            {title} - coming soon
        </div>
    )
}

export default function PublicRoutes() {
    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="markets" element={<MarketsPage />} />
                <Route path="markets/:id" element={<MarketDetailPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="account/orders" element={<OrdersPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route element={<GuestOnlyRoute />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<RegisterPage />} />
                </Route>
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="farmers" element={<ComingSoon title="Farmers" />} />
                <Route path="farmers/:id" element={<FarmerDetailPage />} />
                <Route path="how-it-works" element={<HowItWorksPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="*" element={<ComingSoon title="Page not found" />} />
            </Route>
        </Routes>
    )
}