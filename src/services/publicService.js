import axiosClient from './axiosClient'

const MOCK_FEATURED_PRODUCTS = [
  { id: 'PRD-401', name: 'Fresh Tomatoes', farmer: 'Green Valley Farm', price: 250, unit: 'kg', stock: 35, rating: 4.8, reviews: 124, status: 'available', image: '/src/assets/images/products/tomatoes.jpg' },
  { id: 'PRD-402', name: 'Spinach (Palak)', farmer: 'Organic Farms', price: 80, unit: 'bunch', stock: 20, rating: 4.7, reviews: 86, status: 'available', image: '/src/assets/images/products/spinach.jpg' },
  { id: 'PRD-403', name: 'Farm Eggs (10pcs)', farmer: 'Happy Hens Farm', price: 300, unit: 'pack', stock: 12, rating: 4.9, reviews: 157, status: 'limited', image: '/src/assets/images/products/eggs.jpg' },
  { id: 'PRD-404', name: 'Strawberries', farmer: 'Berry Fields', price: 450, unit: '250g', stock: 0, rating: 4.6, reviews: 64, status: 'sold_out', image: '/src/assets/images/products/strawberries.jpg' },
]

/**
 * Backend endpoint (planned): GET /public/products/featured
 */
export async function getFeaturedProducts() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/public/products/featured')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_FEATURED_PRODUCTS), 300)
  })
}

const MOCK_ALL_PRODUCTS = [
  { id: 'PRD-401', name: 'Fresh Tomatoes', farmer: 'Green Valley Farm', category: 'Vegetables', price: 250, unit: 'kg', stock: 35, rating: 4.8, reviews: 124, status: 'available', image: '/src/assets/images/products/tomatoes.jpg', marketId: 'MKT-301', marketDay: 'Sunday' },
  { id: 'PRD-402', name: 'Spinach (Palak)', farmer: 'Organic Farms', category: 'Vegetables', price: 80, unit: 'bunch', stock: 20, rating: 4.7, reviews: 86, status: 'available', image: '/src/assets/images/products/spinach.jpg', marketId: 'MKT-302', marketDay: 'Saturday' },
  { id: 'PRD-403', name: 'Farm Eggs (10pcs)', farmer: 'Happy Hens Farm', category: 'Dairy & Eggs', price: 300, unit: 'pack', stock: 12, rating: 4.9, reviews: 157, status: 'limited', image: '/src/assets/images/products/eggs.jpg', marketId: 'MKT-301', marketDay: 'Sunday' },
  { id: 'PRD-404', name: 'Strawberries', farmer: 'Berry Fields', category: 'Fruits', price: 450, unit: '250g', stock: 0, rating: 4.6, reviews: 64, status: 'sold_out', image: '/src/assets/images/products/strawberries.jpg', marketId: 'MKT-303', marketDay: 'Daily' },
  { id: 'PRD-405', name: 'Carrots', farmer: 'Green Valley Farm', category: 'Vegetables', price: 110, unit: 'kg', stock: 33, rating: 4.5, reviews: 41, status: 'available', image: '/src/assets/images/products/tomatoes.jpg', marketId: 'MKT-301', marketDay: 'Sunday' },
  { id: 'PRD-406', name: 'Wild Honey', farmer: 'Golden Harvest', category: 'Honey & Preserves', price: 1200, unit: 'jar', stock: 6, rating: 4.9, reviews: 33, status: 'limited', image: '/src/assets/images/products/eggs.jpg', marketId: 'MKT-302', marketDay: 'Saturday' },
  { id: 'PRD-407', name: 'Fresh Basil', farmer: 'Coastal Greens', category: 'Herbs', price: 60, unit: 'bunch', stock: 25, rating: 4.4, reviews: 19, status: 'available', image: '/src/assets/images/products/spinach.jpg', marketId: 'MKT-303', marketDay: 'Daily' },
  { id: 'PRD-408', name: 'Sourdough Loaf', farmer: 'Herb & Root', category: 'Baked Goods', price: 480, unit: 'loaf', stock: 12, rating: 4.3, reviews: 27, status: 'available', image: '/src/assets/images/products/strawberries.jpg', marketId: 'MKT-302', marketDay: 'Saturday' },
]

const MOCK_CATEGORIES = ['Vegetables', 'Fruits', 'Dairy & Eggs', 'Herbs', 'Baked Goods', 'Honey & Preserves']

/**
 * Backend endpoint (planned): GET /public/products
 * Query params: search, category, minPrice, maxPrice, inStockOnly, sort
 */
export async function getProducts(filters = {}) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/public/products', { params: filters })
  // return data

  // --- STATIC MOCK (filters applied client-side over the mock array) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...MOCK_ALL_PRODUCTS]

      if (filters.search) {
        const q = filters.search.toLowerCase()
        results = results.filter(
          (p) => p.name.toLowerCase().includes(q) || p.farmer.toLowerCase().includes(q)
        )
      }
      if (filters.category) {
        results = results.filter((p) => p.category === filters.category)
      }
      if (filters.maxPrice) {
        results = results.filter((p) => p.price <= Number(filters.maxPrice))
      }
      if (filters.inStockOnly) {
        results = results.filter((p) => p.status !== 'sold_out')
      }
      if (filters.sort === 'price_asc') {
        results.sort((a, b) => a.price - b.price)
      } else if (filters.sort === 'price_desc') {
        results.sort((a, b) => b.price - a.price)
      } else if (filters.sort === 'rating') {
        results.sort((a, b) => b.rating - a.rating)
      }

      resolve(results)
    }, 300)
  })
}

/**
 * Backend endpoint (planned): GET /public/categories
 */
export async function getPublicCategories() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/public/categories')
  // return data

  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CATEGORIES), 200)
  })
}

const MOCK_PRODUCT_REVIEWS = {
  'PRD-401': [
    { id: 'REV-1', customerName: 'Sara Khalid', rating: 5, comment: 'Super fresh, exactly as described.', date: '2026-09-20' },
    { id: 'REV-2', customerName: 'Fatima Sheikh', rating: 5, comment: 'Crunchy and sweet, kids loved them.', date: '2026-09-14' },
    { id: 'REV-3', customerName: 'Bilal Ahmed', rating: 4, comment: 'Good quality but a bit pricey.', date: '2026-09-10' },
  ],
  'PRD-403': [
    { id: 'REV-4', customerName: 'Hamza Tariq', rating: 5, comment: 'Best eggs I have had from a local farmer.', date: '2026-09-17' },
  ],
}

/**
 * Backend endpoint (planned): GET /public/products/:id
 */
export async function getProductById(productId) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get(`/public/products/${productId}`)
  // return data

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = MOCK_ALL_PRODUCTS.find((p) => p.id === productId)
      if (product) resolve(product)
      else reject(new Error('Product not found'))
    }, 300)
  })
}

/**
 * Backend endpoint (planned): GET /public/products/:id/reviews
 */
export async function getProductReviews(productId) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get(`/public/products/${productId}/reviews`)
  // return data

  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PRODUCT_REVIEWS[productId] || []), 250)
  })
}

/**
 * Backend endpoint (planned): POST /public/products/:id/reviews
 */
export async function addProductReview(productId, reviewData) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.post(`/public/products/${productId}/reviews`, reviewData)
  // return data

  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview = {
        id: `REV-${Math.floor(Math.random() * 9000 + 1000)}`,
        date: new Date().toISOString().slice(0, 10),
        ...reviewData,
      }
      if (!MOCK_PRODUCT_REVIEWS[productId]) MOCK_PRODUCT_REVIEWS[productId] = []
      MOCK_PRODUCT_REVIEWS[productId].unshift(newReview)
      resolve(newReview)
    }, 300)
  })
}

/**
 * Backend endpoint (planned): GET /public/products/:id/related
 */
export async function getRelatedProducts(productId, category) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get(`/public/products/${productId}/related`)
  // return data

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ALL_PRODUCTS.filter((p) => p.category === category && p.id !== productId).slice(0, 4))
    }, 250)
  })
}

const MOCK_ALL_MARKETS = [
  { id: 'MKT-301', name: 'Sunday Green Market', address: 'Gulshan-e-Iqbal, Karachi', lat: 24.885, lng: 67.03, operatingDays: ['Saturday', 'Sunday'], openingTime: '7:00 AM', closingTime: '1:00 PM', farmers: 32, products: 142, image: '/src/assets/images/markets/market1.jpg' },
  { id: 'MKT-302', name: 'Community Fresh Market', address: 'Clifton, Karachi', lat: 24.845, lng: 67.065, operatingDays: ['Friday', 'Saturday'], openingTime: '8:00 AM', closingTime: '2:00 PM', farmers: 28, products: 96, image: '/src/assets/images/markets/market2.jpg' },
  { id: 'MKT-303', name: 'Organic Bazar', address: 'DHA Phase 6, Karachi', lat: 24.82, lng: 67.01, operatingDays: ['Wednesday', 'Saturday', 'Sunday'], openingTime: '9:00 AM', closingTime: '3:00 PM', farmers: 18, products: 78, image: '/src/assets/images/markets/market3.jpg' },
  { id: 'MKT-304', name: 'North Nazimabad Weekly Bazaar', address: 'North Nazimabad, Karachi', lat: 24.9342, lng: 67.0442, operatingDays: ['Sunday'], openingTime: '8:00 AM', closingTime: '12:00 PM', farmers: 5, products: 41, image: '/src/assets/images/markets/market4.jpg' },
]

// Haversine distance (km) — placeholder for what Mongo's $near/2dsphere
// geospatial query will compute server-side once real coordinates + a
// GeoJSON index exist. Kept client-side for now since markets is a small mock list.
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Backend endpoint (planned): GET /public/markets
 * Query params: lat, lng, maxDistanceKm, day, category, openNow
 *
 * Planned Mongo query once real geo data exists:
 *   Markets.find({
 *     location: {
 *       $near: {
 *         $geometry: { type: 'Point', coordinates: [lng, lat] },
 *         $maxDistance: maxDistanceKm * 1000,
 *       },
 *     },
 *     ...(day && { operatingDays: day }),
 *   })
 * Requires a 2dsphere index on Markets.location.
 */
export async function getNearbyMarkets(filters = {}) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/public/markets', { params: filters })
  // return data

  // --- STATIC MOCK (haversine distance computed client-side) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = MOCK_ALL_MARKETS.map((m) => ({
        ...m,
        distanceKm: filters.lat != null && filters.lng != null
          ? distanceKm(filters.lat, filters.lng, m.lat, m.lng)
          : null,
      }))

      if (filters.search) {
        const q = filters.search.toLowerCase()
        results = results.filter(
          (m) => m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q)
        )
      }
      if (filters.day) {
        results = results.filter((m) => m.operatingDays.includes(filters.day))
      }
      if (filters.maxDistanceKm && filters.lat != null) {
        results = results.filter((m) => m.distanceKm <= Number(filters.maxDistanceKm))
      }

      // Sort by distance when we have a user location, else by name
      results.sort((a, b) =>
        a.distanceKm != null && b.distanceKm != null
          ? a.distanceKm - b.distanceKm
          : a.name.localeCompare(b.name)
      )

      resolve(results)
    }, 300)
  })
}

/**
 * Backend endpoint (planned): GET /public/markets/:id
 */
export async function getMarketById(marketId) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get(`/public/markets/${marketId}`)
  // return data

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const market = MOCK_ALL_MARKETS.find((m) => m.id === marketId)
      if (market) resolve(market)
      else reject(new Error('Market not found'))
    }, 300)
  })
}

/**
 * Backend endpoint (planned): GET /public/markets/:id/products
 */
export async function getMarketProducts(marketId) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get(`/public/markets/${marketId}/products`)
  // return data

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ALL_PRODUCTS.filter((p) => p.marketId === marketId))
    }, 250)
  })
}

/**
 * Backend endpoint (planned): GET /public/markets/:id/farmers
 */
export async function getMarketFarmers(marketId) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get(`/public/markets/${marketId}/farmers`)
  // return data

  // Mock: derive distinct farmer names from products at this market
  return new Promise((resolve) => {
    setTimeout(() => {
      const names = [...new Set(MOCK_ALL_PRODUCTS.filter((p) => p.marketId === marketId).map((p) => p.farmer))]
      resolve(names.map((name, i) => ({ id: `${marketId}-F${i}`, name, stall: name })))
    }, 250)
  })
}

// ================= Customer's own orders =================
const MOCK_CUSTOMER_ORDERS = [
  {
    id: 'MKL-1042',
    items: [
      { name: 'Fresh Tomatoes', quantity: 3, unit: 'kg', price: 250 },
      { name: 'Carrots', quantity: 2, unit: 'kg', price: 110 },
    ],
    farmer: 'Green Valley Farm',
    market: 'Sunday Green Market',
    total: 970,
    pickupDate: '2026-09-28',
    pickupSlot: '9:00 AM – 10:00 AM',
    status: 'placed', // 'placed' | 'accepted' | 'ready_for_pickup' | 'completed' | 'declined' | 'cancelled'
    cutoffTime: '2026-09-28T07:00:00',
  },
  {
    id: 'MKL-1036',
    items: [{ name: 'Farm Eggs (10pcs)', quantity: 2, unit: 'pack', price: 300 }],
    farmer: 'Happy Hens Farm',
    market: 'Sunday Green Market',
    total: 600,
    pickupDate: '2026-09-27',
    pickupSlot: '10:00 AM – 11:00 AM',
    status: 'ready_for_pickup',
    cutoffTime: '2026-09-27T09:00:00',
  },
  {
    id: 'MKL-1020',
    items: [{ name: 'Wild Honey', quantity: 1, unit: 'jar', price: 1200 }],
    farmer: 'Golden Harvest',
    market: 'Community Fresh Market',
    total: 1200,
    pickupDate: '2026-09-20',
    pickupSlot: '5:00 PM – 6:00 PM',
    status: 'completed',
    cutoffTime: '2026-09-20T14:00:00',
  },
  {
    id: 'MKL-1018',
    items: [{ name: 'Fresh Basil', quantity: 4, unit: 'bunch', price: 60 }],
    farmer: 'Coastal Greens',
    market: 'Organic Bazar',
    total: 240,
    pickupDate: '2026-09-19',
    pickupSlot: '8:00 AM – 9:00 AM',
    status: 'declined',
    cutoffTime: '2026-09-19T06:00:00',
  },
]

/**
 * Backend endpoint (planned): GET /customer/orders
 * Scoped to the logged-in customer (Orders.customer_id = current user).
 */
export async function getCustomerOrders() {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/customer/orders')
  // return data

  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CUSTOMER_ORDERS), 300)
  })
}

/**
 * Backend endpoint (planned): PATCH /customer/orders/:id/cancel
 * Only allowed before the farmer's cutoff time.
 */
export async function cancelCustomerOrder(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = MOCK_CUSTOMER_ORDERS.find((o) => o.id === orderId)
      if (order) order.status = 'cancelled'
      resolve({ id: orderId, status: 'cancelled' })
    }, 300)
  })
}


export async function getAllMarketsPublic() {
  const { data } = await axiosClient.get('/markets')
  return data.data 
}