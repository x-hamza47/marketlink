import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import OverviewKpiStrip from "@/pages/admin/Overview";
import OrderAnalyticsChart from "@/pages/admin/OrderAnalyticsChart";
import RecentOrdersTable from "@/pages/admin/RecentOrdersTable";
import FarmersTable from "@/pages/admin/farmers/FarmersTable";
import CustomersPage from "../pages/admin/customers/CustomersPage";
import MarketsPage from "../pages/admin/markets/MarketsPage";
import ProductsPage from "../pages/admin/products/ProductsPage";
import OrdersPage from "../pages/admin/orders/OrdersPage";
import ReviewsPage from "../pages/admin/reviews/ReviewsPage";

// Placeholder for pages not yet built — swapped out one by one as we build them.
function ComingSoon({ title }) {
  return (
    <div className="flex items-center justify-center h-64 text-text-secondary text-sm">
      {title} — coming soon
    </div>
  );
}

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
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="farmers" element={<FarmersTable />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="markets" element={<MarketsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="reviews" element={<ReviewsPage/>} />
        <Route path="reports" element={<ComingSoon title="Reports" />} />
        <Route path="analytics" element={<ComingSoon title="Analytics" />} />
        <Route path="categories" element={<ComingSoon title="Categories" />} />
        <Route
          path="announcements"
          element={<ComingSoon title="Announcements" />}
        />
        <Route path="settings" element={<ComingSoon title="Settings" />} />
      </Route>
    </Routes>
  );
}
