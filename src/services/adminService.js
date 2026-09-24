import axiosClient from './axiosClient'

// ================= Overview KPI stats =================
const MOCK_OVERVIEW_STATS = {
  totalFarmers: 84,
  totalCustomers: 612,
  totalMarkets: 14,
  totalOrders: 1_248,
  pendingFarmerApprovals: 6,
  activeProducts: 356,
  readyForPickup: 23,
  reviewsAwaitingModeration: 9,
  trends: {
    totalFarmers: 8,
    totalCustomers: 12,
    totalMarkets: 0,
    totalOrders: 15,
    pendingFarmerApprovals: -4,
    activeProducts: 6,
    readyForPickup: 22,
    reviewsAwaitingModeration: -10,
  },
}

/**
 * Backend endpoint (planned): GET /admin/overview/stats
 */
export async function getOverviewStats() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/overview/stats')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_OVERVIEW_STATS), 300)
  })
}

// ================= Order analytics =================
const MOCK_ORDER_ANALYTICS = {
  '7D': [
    { label: 'Mon', orders: 32, revenue: 8400 },
    { label: 'Tue', orders: 41, revenue: 10650 },
    { label: 'Wed', orders: 28, revenue: 7200 },
    { label: 'Thu', orders: 47, revenue: 12100 },
    { label: 'Fri', orders: 58, revenue: 15300 },
    { label: 'Sat', orders: 76, revenue: 19800 },
    { label: 'Sun', orders: 64, revenue: 16700 },
  ],
  '30D': Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    orders: Math.round(30 + Math.random() * 50),
    revenue: Math.round(7000 + Math.random() * 12000),
  })),
  '3M': [
    { label: 'Jul', orders: 980, revenue: 254000 },
    { label: 'Aug', orders: 1120, revenue: 289000 },
    { label: 'Sep', orders: 1248, revenue: 312500 },
  ],
  '12M': [
    { label: 'Oct', orders: 720, revenue: 186000 },
    { label: 'Nov', orders: 810, revenue: 209000 },
    { label: 'Dec', orders: 950, revenue: 246000 },
    { label: 'Jan', orders: 880, revenue: 228000 },
    { label: 'Feb', orders: 905, revenue: 234000 },
    { label: 'Mar', orders: 970, revenue: 251000 },
    { label: 'Apr', orders: 1040, revenue: 269000 },
    { label: 'May', orders: 1105, revenue: 286000 },
    { label: 'Jun', orders: 1180, revenue: 305000 },
    { label: 'Jul', orders: 980, revenue: 254000 },
    { label: 'Aug', orders: 1120, revenue: 289000 },
    { label: 'Sep', orders: 1248, revenue: 312500 },
  ],
}

/**
 * Backend endpoint (planned): GET /admin/analytics/orders?range=7D|30D|3M|12M
 */
export async function getOrderAnalytics(range = '7D') {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get(`/admin/analytics/orders?range=${range}`)
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ORDER_ANALYTICS[range] || []), 300)
  })
}


// ================= Recent orders =================
const MOCK_RECENT_ORDERS = [
  { id: 'MKL-1042', customer: 'Sara Khalid', farmer: 'Green Valley Farms', market: 'Clifton Sunday Market', items: 4, total: 1850, pickupDate: '2026-09-26', status: 'ready_for_pickup' },
  { id: 'MKL-1041', customer: 'Bilal Ahmed', farmer: 'Sunrise Organics', market: 'DHA Farmers Hub', items: 2, total: 720, pickupDate: '2026-09-25', status: 'accepted' },
  { id: 'MKL-1040', customer: 'Ayesha Noor', farmer: 'Green Valley Farms', market: 'Clifton Sunday Market', items: 6, total: 2340, pickupDate: '2026-09-27', status: 'placed' },
  { id: 'MKL-1039', customer: 'Hamza Tariq', farmer: 'Farmhouse Fresh', market: 'Gulshan Market', items: 3, total: 980, pickupDate: '2026-09-24', status: 'completed' },
  { id: 'MKL-1038', customer: 'Mahnoor Ali', farmer: 'Sunrise Organics', market: 'DHA Farmers Hub', items: 5, total: 1620, pickupDate: '2026-09-25', status: 'completed' },
  { id: 'MKL-1037', customer: 'Usman Farooq', farmer: 'Coastal Greens', market: 'Clifton Sunday Market', items: 1, total: 340, pickupDate: '2026-09-26', status: 'accepted' },
  { id: 'MKL-1036', customer: 'Fatima Sheikh', farmer: 'Green Valley Farms', market: 'Gulshan Market', items: 7, total: 2980, pickupDate: '2026-09-28', status: 'placed' },
  { id: 'MKL-1035', customer: 'Ali Raza', farmer: 'Farmhouse Fresh', market: 'DHA Farmers Hub', items: 2, total: 610, pickupDate: '2026-09-24', status: 'cancelled' },
]

/**
 * Backend endpoint (planned): GET /admin/orders/recent
 */
export async function getRecentOrders() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/orders/recent')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RECENT_ORDERS), 300)
  })
}