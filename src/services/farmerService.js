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

// ================= Farmer's own products =================
const MOCK_FARMER_PRODUCTS = [
  {
    id: "PRD-401",
    name: "Organic Tomatoes",
    category: "Vegetables",
    price: 180,
    unit: "kg",
    stock: 42,
    description: "Vine-ripened, pesticide-free tomatoes picked fresh each week.",
    image: null,
    availability: "available", // 'available' | 'sold_out' | 'unavailable'
  },
  {
    id: "PRD-406",
    name: "Carrots",
    category: "Vegetables",
    price: 110,
    unit: "kg",
    stock: 33,
    description: "Sweet, crunchy carrots grown without synthetic fertilizer.",
    image: null,
    availability: "available",
  },
  {
    id: "PRD-410",
    name: "Green Chilies",
    category: "Vegetables",
    price: 90,
    unit: "kg",
    stock: 0,
    description: "Spicy green chilies, harvested twice a week.",
    image: null,
    availability: "sold_out",
  },
  {
    id: "PRD-411",
    name: "Okra (Bhindi)",
    category: "Vegetables",
    price: 130,
    unit: "kg",
    stock: 15,
    description: "Tender okra, best when cooked fresh within 2 days.",
    image: null,
    availability: "unavailable",
  },
];

/**
 * Backend endpoint (planned): GET /farmer/products
 * Scoped to logged-in farmer (Products.Farmer_id = current user).
 */
export async function getFarmerProducts() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FARMER_PRODUCTS), 300);
  });
}

/**
 * Backend endpoint (planned): GET /farmer/products/stats
 */
export async function getFarmerProductStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = MOCK_FARMER_PRODUCTS.length;
      const available = MOCK_FARMER_PRODUCTS.filter((p) => p.availability === "available").length;
      const soldOut = MOCK_FARMER_PRODUCTS.filter((p) => p.availability === "sold_out").length;
      resolve({ total, available, soldOut });
    }, 250);
  });
}

/**
 * Backend endpoint (planned): POST /farmer/products
 * multipart/form-data, same Cloudinary-via-backend pattern as Admin categories.
 */
export async function createFarmerProduct(productData) {
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    if (key === "image" && value instanceof File) {
      formData.append("image", value);
    } else if (key !== "image") {
      formData.append(key, value);
    }
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct = {
        id: `PRD-${Math.floor(400 + Math.random() * 600)}`,
        availability: "available",
        ...productData,
        image: productData.image ? URL.createObjectURL(productData.image) : null,
      };
      MOCK_FARMER_PRODUCTS.push(newProduct);
      resolve(newProduct);
    }, 400);
  });
}

/**
 * Backend endpoint (planned): PATCH /farmer/products/:id
 */
export async function updateFarmerProduct(productId, productData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_FARMER_PRODUCTS.find((p) => p.id === productId);
      if (product) {
        Object.assign(product, productData);
        if (productData.image instanceof File) {
          product.image = URL.createObjectURL(productData.image);
        }
      }
      resolve(product);
    }, 400);
  });
}

/**
 * Backend endpoint (planned): PATCH /farmer/products/:id/availability
 * availability: 'available' | 'sold_out' | 'unavailable'
 */
export async function updateFarmerProductAvailability(productId, availability) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_FARMER_PRODUCTS.find((p) => p.id === productId);
      if (product) product.availability = availability;
      resolve({ id: productId, availability });
    }, 300);
  });
}

/**
 * Backend endpoint (planned): DELETE /farmer/products/:id
 */
export async function deleteFarmerProduct(productId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_FARMER_PRODUCTS.findIndex((p) => p.id === productId);
      if (index !== -1) MOCK_FARMER_PRODUCTS.splice(index, 1);
      resolve({ id: productId });
    }, 300);
  });
}

// ================= Farmer's incoming pre-orders =================
const MOCK_FARMER_ORDERS = [
  {
    id: "MKL-1042",
    customer: "Sara Khalid",
    market: "Clifton Sunday Market",
    items: [
      { name: "Organic Tomatoes", quantity: 3, unit: "kg" },
      { name: "Carrots", quantity: 2, unit: "kg" },
    ],
    total: 1850,
    pickupDate: "2026-09-26",
    pickupSlot: "10:00 AM - 11:00 AM",
    cutoffTime: "2026-09-26T08:00:00",
    status: "placed", // 'placed' | 'accepted' | 'ready_for_pickup' | 'completed' | 'declined' | 'cancelled'
  },
  {
    id: "MKL-1040",
    customer: "Ayesha Noor",
    market: "Clifton Sunday Market",
    items: [
      { name: "Organic Tomatoes", quantity: 6, unit: "kg" },
    ],
    total: 2340,
    pickupDate: "2026-09-27",
    pickupSlot: "11:00 AM - 12:00 PM",
    cutoffTime: "2026-09-27T09:00:00",
    status: "placed",
  },
  {
    id: "MKL-1031",
    customer: "Zara Malik",
    market: "Gulshan Market",
    items: [
      { name: "Green Chilies", quantity: 2, unit: "kg" },
      { name: "Okra (Bhindi)", quantity: 1, unit: "kg" },
    ],
    total: 1120,
    pickupDate: "2026-09-25",
    pickupSlot: "4:00 PM - 5:00 PM",
    cutoffTime: "2026-09-25T13:00:00",
    status: "accepted",
  },
  {
    id: "MKL-1028",
    customer: "Omar Sheikh",
    market: "Clifton Sunday Market",
    items: [{ name: "Carrots", quantity: 4, unit: "kg" }],
    total: 640,
    pickupDate: "2026-09-24",
    pickupSlot: "9:00 AM - 10:00 AM",
    cutoffTime: "2026-09-24T07:00:00",
    status: "ready_for_pickup",
  },
  {
    id: "MKL-1020",
    customer: "Bilal Ahmed",
    market: "Gulshan Market",
    items: [{ name: "Okra (Bhindi)", quantity: 2, unit: "kg" }],
    total: 260,
    pickupDate: "2026-09-20",
    pickupSlot: "5:00 PM - 6:00 PM",
    cutoffTime: "2026-09-20T14:00:00",
    status: "completed",
  },
  {
    id: "MKL-1018",
    customer: "Hamza Tariq",
    market: "Clifton Sunday Market",
    items: [{ name: "Organic Tomatoes", quantity: 1, unit: "kg" }],
    total: 180,
    pickupDate: "2026-09-19",
    pickupSlot: "8:00 AM - 9:00 AM",
    cutoffTime: "2026-09-19T06:00:00",
    status: "declined",
  },
];

/**
 * Backend endpoint (planned): GET /farmer/orders
 * Scoped to logged-in farmer via Products.Farmer_id join on order items.
 */
export async function getFarmerOrders() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FARMER_ORDERS), 300);
  });
}

/**
 * Backend endpoint (planned): GET /farmer/orders/stats
 */
export async function getFarmerOrderStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = MOCK_FARMER_ORDERS.length;
      const pending = MOCK_FARMER_ORDERS.filter((o) => o.status === "placed").length;
      const readyForPickup = MOCK_FARMER_ORDERS.filter((o) => o.status === "ready_for_pickup").length;
      const completed = MOCK_FARMER_ORDERS.filter((o) => o.status === "completed").length;
      resolve({ total, pending, readyForPickup, completed });
    }, 250);
  });
}

/**
 * Backend endpoint (planned): PATCH /farmer/orders/:id/status
 * status: 'accepted' | 'declined' | 'ready_for_pickup' | 'completed'
 */
export async function updateFarmerOrderStatus(orderId, status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = MOCK_FARMER_ORDERS.find((o) => o.id === orderId);
      if (order) order.status = status;
      resolve({ id: orderId, status });
    }, 300);
  });
}

// ================= Reviews on the farmer's own products =================
const MOCK_FARMER_REVIEWS = [
  {
    id: "REV-501",
    customer: "Sara Khalid",
    product: "Organic Tomatoes",
    rating: 5,
    comment: "Super fresh, exactly as described.",
    date: "2026-09-20",
    response: null,
  },
  {
    id: "REV-507",
    customer: "Fatima Sheikh",
    product: "Carrots",
    rating: 5,
    comment: "Crunchy and sweet, kids loved them.",
    date: "2026-09-14",
    response: null,
  },
  {
    id: "REV-510",
    customer: "Omar Sheikh",
    product: "Organic Tomatoes",
    rating: 2,
    comment: "A few were bruised on arrival, but taste was good.",
    date: "2026-09-10",
    response: "Sorry about that, Omar! We've adjusted our packing for the next batch — thank you for the feedback.",
  },
  {
    id: "REV-512",
    customer: "Zara Malik",
    product: "Green Chilies",
    rating: 4,
    comment: "Good heat level, will order again.",
    date: "2026-09-08",
    response: null,
  },
];

/**
 * Backend endpoint (planned): GET /farmer/reviews
 * Scoped to the logged-in farmer (Reviews.farmer_id = current user,
 * per the denormalized farmer_id column on Reviews).
 */
export async function getFarmerReviews() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FARMER_REVIEWS), 300);
  });
}

/**
 * Backend endpoint (planned): GET /farmer/reviews/stats
 */
export async function getFarmerReviewStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = MOCK_FARMER_REVIEWS.length;
      const avgRating = total
        ? (MOCK_FARMER_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : 0;
      const unanswered = MOCK_FARMER_REVIEWS.filter((r) => !r.response).length;
      resolve({ total, avgRating, unanswered });
    }, 250);
  });
}

/**
 * Backend endpoint (planned): PATCH /farmer/reviews/:id/response
 */
export async function respondToReview(reviewId, response) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const review = MOCK_FARMER_REVIEWS.find((r) => r.id === reviewId);
      if (review) review.response = response;
      resolve({ id: reviewId, response });
    }, 300);
  });
}

// ================= Farmer's stall profile =================
const MOCK_STALL_PROFILE = {
  stallName: "Green Valley Farms",
  description: "Family-run organic farm supplying fresh vegetables and herbs since 2015.",
  markets: [
    {
      id: "FM-01",
      marketId: "MKT-301",
      marketName: "Clifton Sunday Market",
      operatingDays: ["Saturday", "Sunday"],
      pickupStart: "08:00",
      pickupEnd: "13:00",
      cutoffHours: 2,
    },
    {
      id: "FM-02",
      marketId: "MKT-303",
      marketName: "Gulshan Market",
      operatingDays: ["Wednesday"],
      pickupStart: "16:00",
      pickupEnd: "20:00",
      cutoffHours: 3,
    },
  ],
};

// Available markets a farmer can attach their stall to — mirrors Admin's Markets list.
const AVAILABLE_MARKETS = [
  { id: "MKT-301", name: "Clifton Sunday Market" },
  { id: "MKT-302", name: "DHA Farmers Hub" },
  { id: "MKT-303", name: "Gulshan Market" },
  { id: "MKT-304", name: "North Nazimabad Weekly Bazaar" },
];

/**
 * Backend endpoint (planned): GET /farmer/stall
 * Joins Users -> FarmerMarkets -> Markets, returns nested markets array.
 */
export async function getStallProfile() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_STALL_PROFILE), 300);
  });
}

/**
 * Backend endpoint (planned): GET /markets/list (for the "attach market" dropdown)
 */
export async function getAvailableMarkets() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(AVAILABLE_MARKETS), 200);
  });
}

/**
 * Backend endpoint (planned): PATCH /farmer/stall
 * Replaces stallName/description + the full markets array
 * (backend diffs against FarmerMarkets table: inserts new, updates changed, deletes removed).
 */
export async function updateStallProfile(stallData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      Object.assign(MOCK_STALL_PROFILE, stallData);
      resolve(MOCK_STALL_PROFILE);
    }, 400);
  });
}