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

  const farmerProfile = p.farmerId || null

  return {
    id: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    unit: p.unit,
    stock: stockQuantity,
    image: p.imageUrl || '',
    farmer: farmerProfile?.userId?.name || farmerProfile?.stallName || 'Unknown farmer',
    status,
    rating: null,
    reviews: 0,

    farmerId: farmerProfile?._id || null,
    stallName: farmerProfile?.stallName || '',
    farmerMarkets: (farmerProfile?.markets || []).map((m) => ({
      marketId: m.marketId?._id || m.marketId,
      marketName: m.marketId?.name || '',
      marketAddress: m.marketId?.address || '',
      operatingDays: m.operatingDays,
      pickupStart: m.pickupStart,
      pickupEnd: m.pickupEnd,
      cutoffHours: m.cutoffHours,
    })),
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

// ! Market Apis
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
  const { items: products } = await getMarketProducts(marketId, { page: 1, limit: 200 })
  const seen = new Map()
  products.forEach((p) => {
    if (!seen.has(p.farmer)) seen.set(p.farmer, { id: p.farmer, name: p.farmer, stall: p.farmer })
  })
  return Array.from(seen.values())
}

function mapOrderStatus(status) {
  return status === 'ready' ? 'ready_for_pickup' : status
}

function mapOrder(o) {
  return {
    id: o._id,
    items: (o.items || []).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      image: item.imageUrl || '',
    })),
    farmer: o.farmerId?.stallName || 'Unknown farmer',
    market: o.marketId?.name || o.marketId?.address || '',
    total: o.totalAmount,
    pickupDate: o.pickupDate,
    pickupSlot:
      o.pickupWindow?.startTime && o.pickupWindow?.endTime
        ? `${o.pickupWindow.startTime} – ${o.pickupWindow.endTime}`
        : '',
    status: mapOrderStatus(o.status),
    cutoffTime: o.cutoffTime,
    notes: o.notes || '',
  }
}

export async function getCustomerOrders() {
  const { data } = await axiosClient.get('/orders/my')
  return (data.data || []).map(mapOrder)
}

export async function cancelCustomerOrder(orderId) {
  const { data } = await axiosClient.patch(`/orders/${orderId}/cancel`)
  return mapOrder(data.data)
}
export async function placeOrder({ farmerId, marketId, items, pickupDate, pickupWindow, notes }) {
  const { data } = await axiosClient.post('/orders', {
    farmerId,
    marketId,
    items,
    pickupDate,
    pickupWindow,
    notes,
  })
  return mapOrder(data.data)
}

export async function getAllMarketsPublic() {
  const { data } = await axiosClient.get('/markets')
  return data.data
}