import axiosClient from "./axiosClient";

// ================= Farmer Overview stats =================
export async function getFarmerOverviewStats() {
  const { data } = await axiosClient.get('/orders/farmer/insights');
  const stats = data.data;
  return {
    totalOrders: stats.totalOrders,
    pendingOrders: stats.pendingOrders,
    revenue: stats.totalRevenue,
  };
}

// ================= Farmer's recent pre-orders =================
export async function getFarmerRecentOrders() {
  const { data } = await axiosClient.get('/orders/farmer/recent');
  return data.data;
}

// ================= Farmer order analytics =================
export async function getFarmerOrderAnalytics(range = '7D') {
  const { data } = await axiosClient.get(`/orders/farmer/analytics?range=${range}`);
  return data.data;
}

// ================= Farmer's own products =================
function mapAvailability(product) {
  if (!product.isAvailable) return 'unavailable';
  if (product.stockQuantity <= 0) return 'sold_out';
  return 'available';
}

function mapProduct(p) {
  return {
    id: p._id,
    name: p.name,
    category: p.category,
    price: p.price,
    unit: p.unit,
    stock: p.stockQuantity,
    description: p.description,
    image: p.imageUrl || null,
    availability: mapAvailability(p),
  };
}

export async function getFarmerProducts() {
  const { data } = await axiosClient.get('/products/mine/list');
  return data.data.map(mapProduct);
}

export async function getFarmerProductStats() {
  const { data } = await axiosClient.get('/products/mine/stats');
  return data.data;
}


export async function createFarmerProduct(productData) {
  let imageUrl = '';
  if (productData.image instanceof File) {
    const formData = new FormData();
    formData.append('file', productData.image);
    const { data: uploadRes } = await axiosClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    imageUrl = uploadRes.data.url;
  }

  const payload = {
    name: productData.name,
    category: productData.category,
    price: Number(productData.price),
    unit: productData.unit,
    stockQuantity: Number(productData.stock),
    description: productData.description || '',
    imageUrl,
    isAvailable: true,
  };

  const { data } = await axiosClient.post('/products', payload);
  return mapProduct(data.data);
}


export async function updateFarmerProduct(productId, productData) {
  let imageUrl = productData.image;
  if (productData.image instanceof File) {
    const formData = new FormData();
    formData.append('file', productData.image);
    const { data: uploadRes } = await axiosClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    imageUrl = uploadRes.data.url;
  }

  const payload = {
    name: productData.name,
    category: productData.category,
    price: Number(productData.price),
    unit: productData.unit,
    stockQuantity: Number(productData.stock),
    description: productData.description || '',
  };
  if (imageUrl) payload.imageUrl = imageUrl;

  const { data } = await axiosClient.put(`/products/${productId}`, payload);
  return mapProduct(data.data);
}


export async function updateFarmerProductAvailability(productId, availability) {
  const isAvailable = availability !== 'unavailable';
  const { data } = await axiosClient.patch(`/products/${productId}/availability`, { isAvailable });
  let product = data.data;

  if (availability === 'sold_out' && product.stockQuantity > 0) {
    const { data: updated } = await axiosClient.put(`/products/${productId}`, { stockQuantity: 0 });
    product = updated.data;
  }

  return { id: productId, availability: mapAvailability(product) };
}

export async function deleteFarmerProduct(productId) {
  await axiosClient.delete(`/products/${productId}`);
  return { id: productId };
}

// ================= Farmer's incoming pre-orders =================
const STATUS_TO_FRONTEND = {
  placed: 'placed',
  accepted: 'accepted',
  ready: 'ready_for_pickup',
  completed: 'completed',
  declined: 'declined',
  cancelled: 'cancelled',
};
const STATUS_TO_BACKEND = {
  placed: 'placed',
  accepted: 'accepted',
  ready_for_pickup: 'ready',
  completed: 'completed',
  declined: 'declined',
  cancelled: 'cancelled',
};

function mapOrder(o) {
  return {
    id: o._id,
    customer: o.customerId?.name || 'Unknown',
    market: o.marketId?.name || '',
    items: o.items.map((it) => ({
      name: it.name,
      quantity: it.quantity,
      unit: it.unit,
    })),
    total: o.totalAmount,
    pickupDate: o.pickupDate,
    pickupSlot: o.pickupWindow?.startTime && o.pickupWindow?.endTime
      ? `${o.pickupWindow.startTime} - ${o.pickupWindow.endTime}`
      : '',
    cutoffTime: o.cutoffTime,
    status: STATUS_TO_FRONTEND[o.status] || o.status,
  };
}

export async function getFarmerOrders({ search = '', status = '', marketId = '', page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  if (marketId) params.set('marketId', marketId);
  params.set('page', page);
  params.set('limit', limit);

  const { data } = await axiosClient.get(`/orders/farmer?${params.toString()}`);
  return {
    items: data.data.items.map(mapOrder),
    total: data.data.total,
    page: data.data.page,
    pages: data.data.pages,
  };
}

export async function getFarmerOrderStats() {
  const { data } = await axiosClient.get('/orders/farmer/stats');
  return data.data;
}

export async function updateFarmerOrderStatus(orderId, status) {
  const backendStatus = STATUS_TO_BACKEND[status] || status;
  const { data } = await axiosClient.patch(`/orders/${orderId}/status`, { status: backendStatus });
  return mapOrder(data.data);
}
// ================= Reviews on the farmer's own products =================

export async function getFarmerReviews({ search = '', rating = '', unansweredOnly = false, page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (rating) params.set('rating', rating);
  if (unansweredOnly) params.set('unansweredOnly', 'true');
  params.set('page', page);
  params.set('limit', limit);

  const { data } = await axiosClient.get(`/reviews/mine/list?${params.toString()}`);
  return {
    items: data.data.items,
    total: data.data.total,
    page: data.data.page,
    pages: data.data.pages,
  };
}


export async function getFarmerReviewStats() {
  const { data } = await axiosClient.get('/reviews/mine/stats');
  return data.data;
}


export async function respondToReview(reviewId, response) {
  const { data } = await axiosClient.post(`/reviews/${reviewId}/respond`, { response });
  return data.data;
}

// ================= Farmer's stall profile =================
export async function getStallProfile() {
  const { data } = await axiosClient.get('/farmers/stall');
  return data.data;
}

export async function getAvailableMarkets() {
  const { data } = await axiosClient.get('/farmers/markets/available');
  return data.data;
}

export async function updateStallProfile(stallData) {
  const { data } = await axiosClient.patch('/farmers/stall', stallData);
  return data.data;
}