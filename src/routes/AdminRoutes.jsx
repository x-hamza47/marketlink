import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import RequireRole from "@/components/routing/RequireRole";
import OverviewKpiStrip from "@/pages/admin/Overview";
import OrderAnalyticsChart from "@/pages/admin/OrderAnalyticsChart";
import RecentOrdersTable from "@/pages/admin/RecentOrdersTable";
import FarmersTable from "@/pages/admin/farmers/FarmersTable";
import CustomersPage from "../pages/admin/customers/CustomersPage";
import MarketsPage from "../pages/admin/markets/MarketsPage";
import ProductsPage from "../pages/admin/products/ProductsPage";
import OrdersPage from "../pages/admin/orders/OrdersPage";
import ReviewsPage from "../pages/admin/reviews/ReviewsPage";
import CategoriesPage from "../pages/admin/categories/CategoriesPage";
import ReportsPage from "../pages/admin/reports/ReportsPage";
import AnnouncementsPage from "../pages/admin/announcement/AnnouncementsPage";
import ProfilePage from "../pages/shared/ProfilePage";

function OverviewPage() {
  return (
    <div className="space-y-6">
      <OverviewKpiStrip />
      <OrderAnalyticsChart />
      <RecentOrdersTable />
    </div>
  );
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<RequireRole role="admin" />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="farmers" element={<FarmersTable />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="markets" element={<MarketsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}