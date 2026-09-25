import axiosClient from "./axiosClient";

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
};

/**
 * Backend endpoint (planned): GET /admin/overview/stats
 */
export async function getOverviewStats() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/overview/stats')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_OVERVIEW_STATS), 300);
  });
}

// ================= Order analytics =================
const MOCK_ORDER_ANALYTICS = {
  "7D": [
    { label: "Mon", orders: 32, revenue: 8400 },
    { label: "Tue", orders: 41, revenue: 10650 },
    { label: "Wed", orders: 28, revenue: 7200 },
    { label: "Thu", orders: 47, revenue: 12100 },
    { label: "Fri", orders: 58, revenue: 15300 },
    { label: "Sat", orders: 76, revenue: 19800 },
    { label: "Sun", orders: 64, revenue: 16700 },
  ],
  "30D": Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    orders: Math.round(30 + Math.random() * 50),
    revenue: Math.round(7000 + Math.random() * 12000),
  })),
  "3M": [
    { label: "Jul", orders: 980, revenue: 254000 },
    { label: "Aug", orders: 1120, revenue: 289000 },
    { label: "Sep", orders: 1248, revenue: 312500 },
  ],
  "12M": [
    { label: "Oct", orders: 720, revenue: 186000 },
    { label: "Nov", orders: 810, revenue: 209000 },
    { label: "Dec", orders: 950, revenue: 246000 },
    { label: "Jan", orders: 880, revenue: 228000 },
    { label: "Feb", orders: 905, revenue: 234000 },
    { label: "Mar", orders: 970, revenue: 251000 },
    { label: "Apr", orders: 1040, revenue: 269000 },
    { label: "May", orders: 1105, revenue: 286000 },
    { label: "Jun", orders: 1180, revenue: 305000 },
    { label: "Jul", orders: 980, revenue: 254000 },
    { label: "Aug", orders: 1120, revenue: 289000 },
    { label: "Sep", orders: 1248, revenue: 312500 },
  ],
};

/**
 * Backend endpoint (planned): GET /admin/analytics/orders?range=7D|30D|3M|12M
 */
export async function getOrderAnalytics(range = "7D") {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get(`/admin/analytics/orders?range=${range}`)
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ORDER_ANALYTICS[range] || []), 300);
  });
}

// ================= Recent orders =================
const MOCK_RECENT_ORDERS = [
  {
    id: "MKL-1042",
    customer: "Sara Khalid",
    farmer: "Green Valley Farms",
    market: "Clifton Sunday Market",
    items: 4,
    total: 1850,
    pickupDate: "2026-09-26",
    status: "ready_for_pickup",
  },
  {
    id: "MKL-1041",
    customer: "Bilal Ahmed",
    farmer: "Sunrise Organics",
    market: "DHA Farmers Hub",
    items: 2,
    total: 720,
    pickupDate: "2026-09-25",
    status: "accepted",
  },
  {
    id: "MKL-1040",
    customer: "Ayesha Noor",
    farmer: "Green Valley Farms",
    market: "Clifton Sunday Market",
    items: 6,
    total: 2340,
    pickupDate: "2026-09-27",
    status: "placed",
  },
  {
    id: "MKL-1039",
    customer: "Hamza Tariq",
    farmer: "Farmhouse Fresh",
    market: "Gulshan Market",
    items: 3,
    total: 980,
    pickupDate: "2026-09-24",
    status: "completed",
  },
  {
    id: "MKL-1038",
    customer: "Mahnoor Ali",
    farmer: "Sunrise Organics",
    market: "DHA Farmers Hub",
    items: 5,
    total: 1620,
    pickupDate: "2026-09-25",
    status: "completed",
  },
  {
    id: "MKL-1037",
    customer: "Usman Farooq",
    farmer: "Coastal Greens",
    market: "Clifton Sunday Market",
    items: 1,
    total: 340,
    pickupDate: "2026-09-26",
    status: "accepted",
  },
  {
    id: "MKL-1036",
    customer: "Fatima Sheikh",
    farmer: "Green Valley Farms",
    market: "Gulshan Market",
    items: 7,
    total: 2980,
    pickupDate: "2026-09-28",
    status: "placed",
  },
  {
    id: "MKL-1035",
    customer: "Ali Raza",
    farmer: "Farmhouse Fresh",
    market: "DHA Farmers Hub",
    items: 2,
    total: 610,
    pickupDate: "2026-09-24",
    status: "cancelled",
  },
];

/**
 * Backend endpoint (planned): GET /admin/orders/recent
 */
export async function getRecentOrders() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/orders/recent')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RECENT_ORDERS), 300);
  });
}

/**
 * Backend endpoint (planned): GET /admin/orders/stats
 */
export async function getOrderStats() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/orders/stats')
  // return data

  // --- STATIC MOCK (derived from MOCK_RECENT_ORDERS so it never drifts out of sync) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = MOCK_RECENT_ORDERS.length;
      const pending = MOCK_RECENT_ORDERS.filter(
        (o) => o.status === "placed" || o.status === "accepted",
      ).length;
      const completed = MOCK_RECENT_ORDERS.filter(
        (o) => o.status === "completed",
      ).length;
      const revenue = MOCK_RECENT_ORDERS.filter(
        (o) => o.status === "completed",
      ).reduce((sum, o) => sum + o.total, 0);
      resolve({ total, pending, completed, revenue });
    }, 250);
  });
}

// ================= Order actions (mutations) =================

/**
 * Backend endpoint (planned): PATCH /admin/orders/:id/status
 */
export async function updateOrderStatus(orderId, status) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.patch(`/admin/orders/${orderId}/status`, { status })
  // return data

  // --- STATIC MOCK (mutates in-memory array so refetch reflects the change) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = MOCK_RECENT_ORDERS.find((o) => o.id === orderId);
      if (order) order.status = status;
      resolve({ id: orderId, status });
    }, 300);
  });
}

/**
 * Backend endpoint (planned): DELETE /admin/orders/:id
 */
export async function deleteOrder(orderId) {
  // --- LIVE API CALL ---
  // await axiosClient.delete(`/admin/orders/${orderId}`)
  // return { id: orderId }

  // --- STATIC MOCK (removes from in-memory array so refetch reflects the change) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_RECENT_ORDERS.findIndex((o) => o.id === orderId);
      if (index !== -1) MOCK_RECENT_ORDERS.splice(index, 1);
      resolve({ id: orderId });
    }, 300);
  });
}

// ================= Farmers management =================
const MOCK_FARMERS = [
  {
    id: "FRM-101",
    name: "Tariq Mehmood",
    stall: "Green Valley Farms",
    markets: 2,
    registered: "2026-03-14",
    status: "approved",
  },
  {
    id: "FRM-102",
    name: "Sana Iqbal",
    stall: "Sunrise Organics",
    markets: 1,
    registered: "2026-05-02",
    status: "approved",
  },
  {
    id: "FRM-103",
    name: "Waqas Ahmed",
    stall: "Farmhouse Fresh",
    markets: 3,
    registered: "2026-06-19",
    status: "approved",
  },
  {
    id: "FRM-104",
    name: "Zainab Malik",
    stall: "Coastal Greens",
    markets: 1,
    registered: "2026-08-01",
    status: "pending",
  },
  {
    id: "FRM-105",
    name: "Hassan Raza",
    stall: "Orchard & Co.",
    markets: 2,
    registered: "2026-08-20",
    status: "pending",
  },
  {
    id: "FRM-106",
    name: "Nadia Sheikh",
    stall: "Herb & Root",
    markets: 1,
    registered: "2026-04-11",
    status: "suspended",
  },
  {
    id: "FRM-107",
    name: "Imran Baig",
    stall: "Golden Harvest",
    markets: 2,
    registered: "2026-07-08",
    status: "approved",
  },
];

/**
 * Backend endpoint (planned): GET /admin/farmers
 */
export async function getFarmers() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/farmers')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FARMERS), 300);
  });
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
      const farmer = MOCK_FARMERS.find((f) => f.id === farmerId);
      if (farmer) farmer.status = status;
      resolve({ id: farmerId, status });
    }, 300);
  });
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
      const index = MOCK_FARMERS.findIndex((f) => f.id === farmerId);
      if (index !== -1) MOCK_FARMERS.splice(index, 1);
      resolve({ id: farmerId });
    }, 300);
  });
}

// ================= Customers management =================
const MOCK_CUSTOMERS = [
  {
    id: "CUS-201",
    name: "Sara Khalid",
    email: "sara.khalid@gmail.com",
    phone: "0321-4567890",
    orders: 12,
    status: "active",
    joined: "2026-02-11",
  },
  {
    id: "CUS-202",
    name: "Bilal Ahmed",
    email: "bilal.ahmed@gmail.com",
    phone: "0333-1122334",
    orders: 5,
    status: "active",
    joined: "2026-03-28",
  },
  {
    id: "CUS-203",
    name: "Ayesha Noor",
    email: "ayesha.noor@gmail.com",
    phone: "0300-9988776",
    orders: 21,
    status: "active",
    joined: "2026-01-15",
  },
  {
    id: "CUS-204",
    name: "Hamza Tariq",
    email: "hamza.tariq@gmail.com",
    phone: "0345-6677889",
    orders: 3,
    status: "active",
    joined: "2026-06-02",
  },
  {
    id: "CUS-205",
    name: "Mahnoor Ali",
    email: "mahnoor.ali@gmail.com",
    phone: "0312-3344556",
    orders: 8,
    status: "inactive",
    joined: "2026-04-19",
  },
  {
    id: "CUS-206",
    name: "Usman Farooq",
    email: "usman.farooq@gmail.com",
    phone: "0301-7788990",
    orders: 1,
    status: "active",
    joined: "2026-08-07",
  },
  {
    id: "CUS-207",
    name: "Fatima Sheikh",
    email: "fatima.sheikh@gmail.com",
    phone: "0334-5566778",
    orders: 15,
    status: "active",
    joined: "2026-02-25",
  },
  {
    id: "CUS-208",
    name: "Ali Raza",
    email: "ali.raza@gmail.com",
    phone: "0322-8899001",
    orders: 0,
    status: "inactive",
    joined: "2026-09-01",
  },
];

export async function getCustomerStats() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/customers/stats')
  // return data

  // --- STATIC MOCK (derived from MOCK_CUSTOMERS so it never drifts out of sync) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = MOCK_CUSTOMERS.length;
      const active = MOCK_CUSTOMERS.filter((c) => c.status === "active").length;
      const inactive = total - active;
      const totalOrders = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.orders, 0);
      resolve({ total, active, inactive, totalOrders });
    }, 250);
  });
}
/**
 * Backend endpoint (planned): GET /admin/customers
 */
export async function getCustomers() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/customers')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CUSTOMERS), 300);
  });
}

/**
 * Backend endpoint (planned): PATCH /admin/customers/:id/status
 * status: 'active' | 'inactive'
 */
export async function updateCustomerStatus(customerId, status) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.patch(`/admin/customers/${customerId}/status`, { status })
  // return data

  // --- STATIC MOCK (mutates in-memory array so refetch reflects the change) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
      if (customer) customer.status = status;
      resolve({ id: customerId, status });
    }, 300);
  });
}

/**
 * Backend endpoint (planned): DELETE /admin/customers/:id
 */
export async function deleteCustomer(customerId) {
  // --- LIVE API CALL ---
  // await axiosClient.delete(`/admin/customers/${customerId}`)
  // return { id: customerId }

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_CUSTOMERS.findIndex((c) => c.id === customerId);
      if (index !== -1) MOCK_CUSTOMERS.splice(index, 1);
      resolve({ id: customerId });
    }, 300);
  });
}

// ================= Markets management =================
const MOCK_MARKETS = [
  {
    id: "MKT-301",
    name: "Clifton Sunday Market",
    address: "Beach Avenue, Clifton Block 4, Karachi",
    operatingDays: ["Saturday", "Sunday"],
    farmers: 18,
    products: 142,
    status: "active",
    lat: 24.8138,
    lng: 67.03,
  },
  {
    id: "MKT-302",
    name: "DHA Farmers Hub",
    address: "Khayaban-e-Ittehad, DHA Phase 6, Karachi",
    operatingDays: ["Friday", "Saturday"],
    farmers: 12,
    products: 96,
    status: "active",
    lat: 24.8007,
    lng: 67.0654,
  },
  {
    id: "MKT-303",
    name: "Gulshan Market",
    address: "Block 13-D, Gulshan-e-Iqbal, Karachi",
    operatingDays: ["Wednesday", "Saturday", "Sunday"],
    farmers: 9,
    products: 78,
    status: "active",
    lat: 24.92,
    lng: 67.093,
  },
  {
    id: "MKT-304",
    name: "North Nazimabad Weekly Bazaar",
    address: "Hyderi Market Road, North Nazimabad, Karachi",
    operatingDays: ["Sunday"],
    farmers: 5,
    products: 41,
    status: "inactive",
    lat: 24.9342,
    lng: 67.0442,
  },
];
/**
 * Backend endpoint (planned): GET /admin/markets
 */
export async function getMarkets() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/markets')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MARKETS), 300);
  });
}

/**
 * Backend endpoint (planned): GET /admin/markets/stats
 */
export async function getMarketStats() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/markets/stats')
  // return data

  // --- STATIC MOCK (derived so it never drifts out of sync) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = MOCK_MARKETS.length;
      const active = MOCK_MARKETS.filter((m) => m.status === "active").length;
      const totalFarmers = MOCK_MARKETS.reduce((sum, m) => sum + m.farmers, 0);
      const totalProducts = MOCK_MARKETS.reduce(
        (sum, m) => sum + m.products,
        0,
      );
      resolve({ total, active, totalFarmers, totalProducts });
    }, 250);
  });
}
/**
 * Backend endpoint (planned): POST /admin/markets
 */
export async function createMarket(marketData) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.post('/admin/markets', marketData)
  // return data

  // --- STATIC MOCK (pushes a new entry into the in-memory array) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMarket = {
        id: `MKT-${Math.floor(300 + Math.random() * 700)}`,
        farmers: 0,
        products: 0,
        status: "active",
        ...marketData,
      };
      MOCK_MARKETS.push(newMarket);
      resolve(newMarket);
    }, 400);
  });
}
/**
 * Backend endpoint (planned): PATCH /admin/markets/:id/status
 * status: 'active' | 'inactive'
 */
export async function updateMarketStatus(marketId, status) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.patch(`/admin/markets/${marketId}/status`, { status })
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const market = MOCK_MARKETS.find((m) => m.id === marketId);
      if (market) market.status = status;
      resolve({ id: marketId, status });
    }, 300);
  });
}

/**
 * Backend endpoint (planned): DELETE /admin/markets/:id
 */
export async function deleteMarket(marketId) {
  // --- LIVE API CALL ---
  // await axiosClient.delete(`/admin/markets/${marketId}`)
  // return { id: marketId }

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_MARKETS.findIndex((m) => m.id === marketId);
      if (index !== -1) MOCK_MARKETS.splice(index, 1);
      resolve({ id: marketId });
    }, 300);
  });
}

// ================= Products management =================
const MOCK_PRODUCTS = [
  {
    id: "PRD-401",
    name: "Organic Tomatoes",
    farmer: "Green Valley Farms",
    category: "Vegetables",
    price: 180,
    unit: "kg",
    stock: 42,
    availability: "available",
    moderation: "approved",
  },
  {
    id: "PRD-402",
    name: "Fresh Spinach",
    farmer: "Sunrise Organics",
    category: "Vegetables",
    price: 90,
    unit: "bundle",
    stock: 18,
    availability: "available",
    moderation: "approved",
  },
  {
    id: "PRD-403",
    name: "Farm Eggs (Dozen)",
    farmer: "Farmhouse Fresh",
    category: "Dairy & Eggs",
    price: 420,
    unit: "dozen",
    stock: 6,
    availability: "low_stock",
    moderation: "approved",
  },
  {
    id: "PRD-404",
    name: "Wild Honey",
    farmer: "Golden Harvest",
    category: "Honey & Preserves",
    price: 1200,
    unit: "jar",
    stock: 0,
    availability: "unavailable",
    moderation: "approved",
  },
  {
    id: "PRD-405",
    name: "Fresh Basil",
    farmer: "Coastal Greens",
    category: "Herbs",
    price: 60,
    unit: "bunch",
    stock: 25,
    availability: "available",
    moderation: "pending",
  },
  {
    id: "PRD-406",
    name: "Carrots",
    farmer: "Green Valley Farms",
    category: "Vegetables",
    price: 110,
    unit: "kg",
    stock: 33,
    availability: "available",
    moderation: "approved",
  },
  {
    id: "PRD-407",
    name: "Strawberries",
    farmer: "Orchard & Co.",
    category: "Fruits",
    price: 350,
    unit: "box",
    stock: 4,
    availability: "low_stock",
    moderation: "pending",
  },
  {
    id: "PRD-408",
    name: "Sourdough Loaf",
    farmer: "Herb & Root",
    category: "Baked Goods",
    price: 480,
    unit: "loaf",
    stock: 12,
    availability: "available",
    moderation: "rejected",
  },
];

/**
 * Backend endpoint (planned): GET /admin/products
 */
export async function getProducts() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/products')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PRODUCTS), 300);
  });
}

/**
 * Backend endpoint (planned): GET /admin/products/stats
 */
export async function getProductStats() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/products/stats')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = MOCK_PRODUCTS.length;
      const available = MOCK_PRODUCTS.filter(
        (p) => p.availability === "available",
      ).length;
      const lowStock = MOCK_PRODUCTS.filter(
        (p) => p.availability === "low_stock",
      ).length;
      const pendingModeration = MOCK_PRODUCTS.filter(
        (p) => p.moderation === "pending",
      ).length;
      resolve({ total, available, lowStock, pendingModeration });
    }, 250);
  });
}

/**
 * Backend endpoint (planned): PATCH /admin/products/:id/moderation
 * moderation: 'approved' | 'rejected'
 */
export async function updateProductModeration(productId, moderation) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.patch(`/admin/products/${productId}/moderation`, { moderation })
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_PRODUCTS.find((p) => p.id === productId);
      if (product) product.moderation = moderation;
      resolve({ id: productId, moderation });
    }, 300);
  });
}

/**
 * Backend endpoint (planned): DELETE /admin/products/:id
 */
export async function deleteProduct(productId) {
  // --- LIVE API CALL ---
  // await axiosClient.delete(`/admin/products/${productId}`)
  // return { id: productId }

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_PRODUCTS.findIndex((p) => p.id === productId);
      if (index !== -1) MOCK_PRODUCTS.splice(index, 1);
      resolve({ id: productId });
    }, 300);
  });
}

// ================= Reviews management =================
const MOCK_REVIEWS = [
  {
    id: "REV-501",
    customer: "Sara Khalid",
    product: "Organic Tomatoes",
    farmer: "Green Valley Farms",
    rating: 5,
    comment: "Super fresh, exactly as described.",
    date: "2026-09-20",
    status: "visible",
  },
  {
    id: "REV-502",
    customer: "Bilal Ahmed",
    product: "Farm Eggs (Dozen)",
    farmer: "Farmhouse Fresh",
    rating: 4,
    comment: "Good quality but a bit pricey.",
    date: "2026-09-19",
    status: "visible",
  },
  {
    id: "REV-503",
    customer: "Ayesha Noor",
    product: "Wild Honey",
    farmer: "Golden Harvest",
    rating: 1,
    comment: "This is scam garbage, avoid this seller!!!",
    date: "2026-09-18",
    status: "flagged",
  },
  {
    id: "REV-504",
    customer: "Hamza Tariq",
    product: "Fresh Spinach",
    farmer: "Sunrise Organics",
    rating: 5,
    comment: "Best spinach in the market, will buy again.",
    date: "2026-09-17",
    status: "visible",
  },
  {
    id: "REV-505",
    customer: "Mahnoor Ali",
    product: "Sourdough Loaf",
    farmer: "Herb & Root",
    rating: 2,
    comment: "Arrived stale, disappointed.",
    date: "2026-09-16",
    status: "visible",
  },
  {
    id: "REV-506",
    customer: "Usman Farooq",
    product: "Strawberries",
    farmer: "Orchard & Co.",
    rating: 1,
    comment: "Contains inappropriate spam link to another site.",
    date: "2026-09-15",
    status: "flagged",
  },
  {
    id: "REV-507",
    customer: "Fatima Sheikh",
    product: "Carrots",
    farmer: "Green Valley Farms",
    rating: 5,
    comment: "Crunchy and sweet, kids loved them.",
    date: "2026-09-14",
    status: "visible",
  },
];

/**
 * Backend endpoint (planned): GET /admin/reviews
 */
export async function getReviews() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/reviews')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_REVIEWS), 300);
  });
}

/**
 * Backend endpoint (planned): PATCH /admin/reviews/:id/status
 * status: 'visible' | 'hidden'
 */
export async function updateReviewStatus(reviewId, status) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.patch(`/admin/reviews/${reviewId}/status`, { status })
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
      if (review) review.status = status;
      resolve({ id: reviewId, status });
    }, 300);
  });
}
/**
 * Backend endpoint (planned): GET /admin/reviews/stats
 */
export async function getReviewStats() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/admin/reviews/stats')
  // return data

  // --- STATIC MOCK (derived from MOCK_REVIEWS so it never drifts out of sync) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = MOCK_REVIEWS.length;
      const flagged = MOCK_REVIEWS.filter((r) => r.status === "flagged").length;
      const visible = MOCK_REVIEWS.filter((r) => r.status !== "hidden").length;
      const hidden = MOCK_REVIEWS.filter((r) => r.status === "hidden").length;
      const avgRating = total
        ? (MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(
            1,
          )
        : 0;
      resolve({ total, flagged, visible, hidden, avgRating });
    }, 250);
  });
}

/**
 * Backend endpoint (planned): DELETE /admin/reviews/:id
 */
export async function deleteReview(reviewId) {
  // --- LIVE API CALL ---
  // await axiosClient.delete(`/admin/reviews/${reviewId}`)
  // return { id: reviewId }

  // --- STATIC MOCK (removes from in-memory array so refetch reflects the change) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_REVIEWS.findIndex((r) => r.id === reviewId);
      if (index !== -1) MOCK_REVIEWS.splice(index, 1);
      resolve({ id: reviewId });
    }, 300);
  });
}
