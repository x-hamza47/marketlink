import axiosClient from "./axiosClient";

// ================= Farmer Overview stats =================
const MOCK_FARMER_STATS = {
  totalOrders: 187,
  pendingOrders: 14,
  revenue: 48250,
  trends: {
    totalOrders: 11,
    pendingOrders: -6,
    revenue: 9,
  },
};

/**
 * Backend endpoint (planned): GET /farmer/overview/stats
 * Scoped to the logged-in farmer's own orders (via Products.Farmer_id join),
 * not platform-wide like the Admin version.
 */
export async function getFarmerOverviewStats() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/farmer/overview/stats')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FARMER_STATS), 300);
  });
}

// ================= Farmer's recent pre-orders =================
const MOCK_FARMER_RECENT_ORDERS = [
  {
    id: "MKL-1042",
    customer: "Sara Khalid",
    market: "Clifton Sunday Market",
    items: 4,
    total: 1850,
    pickupDate: "2026-09-26",
    status: "ready_for_pickup",
  },
  {
    id: "MKL-1040",
    customer: "Ayesha Noor",
    market: "Clifton Sunday Market",
    items: 6,
    total: 2340,
    pickupDate: "2026-09-27",
    status: "placed",
  },
  {
    id: "MKL-1036",
    customer: "Fatima Sheikh",
    market: "Gulshan Market",
    items: 7,
    total: 2980,
    pickupDate: "2026-09-28",
    status: "placed",
  },
  {
    id: "MKL-1031",
    customer: "Zara Malik",
    market: "Clifton Sunday Market",
    items: 3,
    total: 1120,
    pickupDate: "2026-09-25",
    status: "accepted",
  },
  {
    id: "MKL-1028",
    customer: "Omar Sheikh",
    market: "Gulshan Market",
    items: 2,
    total: 640,
    pickupDate: "2026-09-24",
    status: "completed",
  },
];

/**
 * Backend endpoint (planned): GET /farmer/orders/recent
 */
export async function getFarmerRecentOrders() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/farmer/orders/recent')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FARMER_RECENT_ORDERS), 300);
  });

}

// ================= Farmer order analytics =================
const MOCK_FARMER_ORDER_ANALYTICS = {
  "7D": [
    { label: "Mon", orders: 6, revenue: 1450 },
    { label: "Tue", orders: 9, revenue: 2100 },
    { label: "Wed", orders: 5, revenue: 1180 },
    { label: "Thu", orders: 11, revenue: 2640 },
    { label: "Fri", orders: 14, revenue: 3350 },
    { label: "Sat", orders: 19, revenue: 4580 },
    { label: "Sun", orders: 16, revenue: 3920 },
  ],
  "30D": Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    orders: Math.round(5 + Math.random() * 15),
    revenue: Math.round(1200 + Math.random() * 3500),
  })),
  "3M": [
    { label: "Jul", orders: 210, revenue: 52500 },
    { label: "Aug", orders: 245, revenue: 61200 },
    { label: "Sep", orders: 187, revenue: 48250 },
  ],
  "12M": [
    { label: "Oct", orders: 150, revenue: 37500 },
    { label: "Nov", orders: 168, revenue: 42000 },
    { label: "Dec", orders: 195, revenue: 49800 },
    { label: "Jan", orders: 172, revenue: 43600 },
    { label: "Feb", orders: 180, revenue: 45200 },
    { label: "Mar", orders: 198, revenue: 50100 },
    { label: "Apr", orders: 210, revenue: 53000 },
    { label: "May", orders: 225, revenue: 56800 },
    { label: "Jun", orders: 238, revenue: 60200 },
    { label: "Jul", orders: 210, revenue: 52500 },
    { label: "Aug", orders: 245, revenue: 61200 },
    { label: "Sep", orders: 187, revenue: 48250 },
  ],
};

/**
 * Backend endpoint (planned): GET /farmer/analytics/orders?range=7D|30D|3M|12M
 * Scoped to the logged-in farmer's own orders only.
 */
export async function getFarmerOrderAnalytics(range = "7D") {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get(`/farmer/analytics/orders?range=${range}`)
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FARMER_ORDER_ANALYTICS[range] || []), 300);
  });
}