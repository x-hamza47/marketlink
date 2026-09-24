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

// ================= Order actions (mutations) =================

/**
 * Backend endpoint (planned): PATCH /admin/orders/:id/status
 */
export async function updateOrderStatus(orderId, status) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.patch(`/admin/orders/${orderId}/status`, { status })
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: orderId, status }), 300)
  })
}

/**
 * Backend endpoint (planned): DELETE /admin/orders/:id
 */
export async function deleteOrder(orderId) {
  // --- LIVE API CALL ---
  // await axiosClient.delete(`/admin/orders/${orderId}`)
  // return { id: orderId }

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: orderId }), 300)
  })
}

// ================= Farmers management =================
const MOCK_FARMERS = [
  { id: 'FRM-101', name: 'Tariq Mehmood', stall: 'Green Valley Farms', markets: 2, registered: '2026-03-14', status: 'approved' },
  { id: 'FRM-102', name: 'Sana Iqbal', stall: 'Sunrise Organics', markets: 1, registered: '2026-05-02', status: 'approved' },
  { id: 'FRM-103', name: 'Waqas Ahmed', stall: 'Farmhouse Fresh', markets: 3, registered: '2026-06-19', status: 'approved' },
  { id: 'FRM-104', name: 'Zainab Malik', stall: 'Coastal Greens', markets: 1, registered: '2026-08-01', status: 'pending' },
  { id: 'FRM-105', name: 'Hassan Raza', stall: 'Orchard & Co.', markets: 2, registered: '2026-08-20', status: 'pending' },
  { id: 'FRM-106', name: 'Nadia Sheikh', stall: 'Herb & Root', markets: 1, registered: '2026-04-11', status: 'suspended' },
  { id: 'FRM-107', name: 'Imran Baig', stall: 'Golden Harvest', markets: 2, registered: '2026-07-08', status: 'approved' },
]

/**
 * Backend endpoint (planned): GET /admin/farmers
 */
export async function getFarmers() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/farmers')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FARMERS), 300)
  })
}

/**
 * Backend endpoint (planned): PATCH /admin/farmers/:id/status
 * status: 'approved' | 'suspended' | 'rejected'
 */
export async function updateFarmerStatus(farmerId, status) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.patch(`/admin/farmers/${farmerId}/status`, { status })
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const farmer = MOCK_FARMERS.find((f) => f.id === farmerId)
      if (farmer) farmer.status = status
      resolve({ id: farmerId, status })
    }, 300)
  })
}

/**
 * Backend endpoint (planned): DELETE /admin/farmers/:id
 */
export async function deleteFarmer(farmerId) {
  // --- LIVE API CALL ---
  // await axiosClient.delete(`/admin/farmers/${farmerId}`)
  // return { id: farmerId }

  // --- STATIC MOCK ---
return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_FARMERS.findIndex((f) => f.id === farmerId)
      if (index !== -1) MOCK_FARMERS.splice(index, 1)
      resolve({ id: farmerId })
    }, 300)
  })
}