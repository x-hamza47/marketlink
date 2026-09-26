import { Routes, Route } from "react-router-dom";
import FarmerLayout from "@/layouts/FarmerLayout";
import ProfilePage from "@/pages/shared/ProfilePage";
import FarmerOverview from "../pages/farmer/Overview";
import ProductsPage from "../pages/farmer/products/ProductsPage";
import OrdersPage from "../pages/farmer/orders/OrdersPage";
import ReviewsPage from "../pages/reviews/ReviewsPage";
import StallProfilePage from "../pages/farmer/stall/StallProfilePage";

function ComingSoon({ title }) {
  return (
    <div className="flex items-center justify-center h-64 text-text-secondary text-sm">
      {title} — coming soon
    </div>
  );
}

export default function FarmerRoutes() {
  return (
    <Routes>
      <Route path="/farmer" element={<FarmerLayout />}>
        <Route index element={<FarmerOverview />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="stall" element={<StallProfilePage />} />
        <Route path="profile" element={<ProfilePage />} />

      </Route>
    </Routes>
  );
}