import axiosClient from './axiosClient'


// Products

export async function getFeaturedProducts() {
  const { data } = await axiosClient.get('/products', {
    params: { limit: 8, availableOnly: 'true', sort: '-createdAt' },
  })
  return mapProducts(data.data.items)
}

export async function getProducts(filters = {}) {
  const { search, category, maxPrice, inStockOnly, sort, page = 1, limit = 24 } = filters
  const sortMap = { price_asc: 'price', price_desc: '-price', rating: '-createdAt' }

  const { data } = await axiosClient.get('/products', {
    params: {
      search: search || undefined,
      category: category || undefined,
      maxPrice: maxPrice || undefined,
      availableOnly: inStockOnly ? 'true' : undefined,
      sort: sortMap[sort] || undefined,
      page,
      limit,
    },
  })

  return {
    items: mapProducts(data.data.items),
    total: data.data.total,
    page: data.data.page,
    pages: data.data.pages,
  }
}

export async function getProductById(productId) {
  const { data } = await axiosClient.get(`/products/${productId}`)
  return mapProduct(data.data)
}

function mapProduct(p) {
  const stockQuantity = p.stockQuantity ?? 0
  const status = !p.isAvailable || stockQuantity === 0
    ? 'sold_out'
    : stockQuantity < 5
      ? 'limited'
      : 'available'

  return {
    id: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    unit: p.unit,
    stock: stockQuantity,
    image: p.imageUrl || '',
    farmer: p.farmerId?.userId?.name || 'Unknown farmer',
    status,
    rating: null,
    reviews: 0,
    marketId: null,
    marketDay: null,
  }
}
function mapProducts(items) {
  return (items || []).map(mapProduct)
}


export async function getPublicCategories() {
  const { data } = await axiosClient.get('/products/meta/categories')
  return data.data
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

export async function getRelatedProducts(productId, category) {
  if (!category) return []
  const all = await getProducts({ category })
  return all.filter((p) => p.id !== productId).slice(0, 4)
}


export async function getNearbyMarkets(filters = {}) {
  const { lat, lng, maxDistanceKm, day, search } = filters

  if (lat == null || lng == null) {
    const { data } = await axiosClient.get('/markets', {
      params: { day, search },
    })
    return data.data
  }

  const { data } = await axiosClient.get('/markets/near', {
    params: {
      lat,
      lng,
      radiusKm: maxDistanceKm || undefined,
      day,
      search,
    },
  })
  return data.data
}

// ! Market Apis
export async function getMarketById(marketId) {
  const { data } = await axiosClient.get(`/markets/${marketId}`)
  return data.data
}

export async function getMarketProducts(marketId, { page = 1, limit = 2 } = {}) {
  const { data } = await axiosClient.get('/products', {
    params: { marketId, page, limit, sort: '-createdAt' },
  })
  return {
    items: mapProducts(data.data.items),
    total: data.data.total,
    page: data.data.page,
    pages: data.data.pages,
  }
}
export async function getMarketFarmers(marketId) {
  // fetch a large page since we need the full set to derive distinct farmers, not just one page
  const { items: products } = await getMarketProducts(marketId, { page: 1, limit: 200 })
  const seen = new Map()
  products.forEach((p) => {
    if (!seen.has(p.farmer)) seen.set(p.farmer, { id: p.farmer, name: p.farmer, stall: p.farmer })
  })
  return Array.from(seen.values())
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