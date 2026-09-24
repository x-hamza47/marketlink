import AdminLayout from '@/layouts/AdminLayout'
import OverviewKpiStrip from '@/pages/admin/Overview'
import OrderAnalyticsChart from '@/pages/admin/OrderAnalyticsChart'
import RecentOrdersTable from '@/pages/admin/RecentOrdersTable'

function App() {
  return (
    <AdminLayout activeItem="Overview" pageTitle="Overview">
      <div className="space-y-6">
        <OverviewKpiStrip />
        <OrderAnalyticsChart />
        <RecentOrdersTable />
      </div>
    </AdminLayout>
  )
}

export default App