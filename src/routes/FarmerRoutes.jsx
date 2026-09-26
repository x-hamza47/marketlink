import { Routes, Route } from "react-router-dom";
import FarmerLayout from "@/layouts/FarmerLayout";
import ProfilePage from "@/pages/shared/ProfilePage";
import FarmerOverview from "../pages/farmer/Overview";

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
        <Route index element={<FarmerOverview/>} />
        <Route path="products" element={<ComingSoon title="My Products" />} />
        <Route path="orders" element={<ComingSoon title="Orders" />} />
        <Route path="reviews" element={<ComingSoon title="Reviews" />} />
        <Route path="stall" element={<ComingSoon title="My Stall Profile" />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<ComingSoon title="Settings" />} />
        <Route path="help" element={<ComingSoon title="Help" />} />
      </Route>
    </Routes>
  );
}