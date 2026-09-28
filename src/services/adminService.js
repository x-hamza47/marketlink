import axiosClient from "./axiosClient";

export async function getOverviewStats() {
  const { data } = await axiosClient.get('/admin/overview/stats');
  return data.data;
}

export async function getOrderAnalytics(range = "7D") {
  const { data } = await axiosClient.get(`/admin/analytics/orders?range=${range}`);
  return data.data;
}

export async function getRecentOrders() {
  const { data } = await axiosClient.get('/admin/orders/recent');
  return data.data;
}

export async function updateOrderStatus(orderId, status) {
  const { data } = await axiosClient.patch(`/admin/orders/${orderId}/status`, { status });
  return data.data;
}

export async function deleteOrder(orderId) {
  await axiosClient.delete(`/admin/orders/${orderId}`);
  return { id: orderId };
}

export async function getOrderStats() {
  const { data } = await axiosClient.get('/admin/orders/stats');
  return data.data;
}
// ================= Farmers management =================
export async function getFarmers() {
  const { data } = await axiosClient.get('/admin/farmers');
  return data.data;
}

export async function updateFarmerStatus(farmerId, status) {
  const { data } = await axiosClient.patch(`/admin/farmers/${farmerId}/status`, { status });
  return data.data;
}

export async function deleteFarmer(farmerId) {
  await axiosClient.delete(`/admin/farmers/${farmerId}`);
  return { id: farmerId };
}
// ================= Customers management =================
export async function getCustomerStats() {
  const { data } = await axiosClient.get('/admin/customers/stats');
  return data.data;
}

export async function getCustomers() {
  const { data } = await axiosClient.get('/admin/customers');
  return data.data;
}

export async function updateCustomerStatus(customerId, status) {
  const { data } = await axiosClient.patch(`/admin/customers/${customerId}/status`, { status });
  return data.data;
}

export async function deleteCustomer(customerId) {
  await axiosClient.delete(`/admin/customers/${customerId}`);
  return { id: customerId };
}

// ================= Markets management =================
const DAY_TO_FRONTEND = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};
const DAY_TO_BACKEND = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

export async function getMarkets() {
  const { data } = await axiosClient.get('/admin/markets');
  return data.data.map((m) => ({
    ...m,
    operatingDays: m.operatingDays.map((d) => DAY_TO_FRONTEND[d] || d),
  }));
}
export async function getMarketStats() {
  const { data } = await axiosClient.get('/admin/markets/stats');
  return data.data;
}


export async function createMarket(marketData) {
  const payload = {
    ...marketData,
    operatingDays: marketData.operatingDays.map((d) => DAY_TO_BACKEND[d] || d),
  };
  const { data } = await axiosClient.post('/markets', payload);
  return data.data;
}

export async function updateMarketStatus(marketId, status) {
  const { data } = await axiosClient.patch(`/admin/markets/${marketId}/status`, { status });
  return data.data;
}

export async function deleteMarket(marketId) {
  await axiosClient.delete(`/markets/${marketId}`);
  return { id: marketId };
}
// ================= Products management =================
export async function getProducts() {
  const { data } = await axiosClient.get('/admin/products');
  return data.data;
}

export async function getProductStats() {
  const { data } = await axiosClient.get('/admin/products/stats');
  return data.data;
}

export async function updateProductModeration(productId, moderation) {
  const { data } = await axiosClient.patch(`/admin/products/${productId}/moderation`, { moderation });
  return data.data;
}

export async function deleteProduct(productId) {
  await axiosClient.delete(`/admin/products/${productId}`);
  return { id: productId };
}
// ================= Reviews management =================
export async function getReviews() {
  const { data } = await axiosClient.get('/admin/reviews');
  return data.data;
}

export async function getReviewStats() {
  const { data } = await axiosClient.get('/admin/reviews/stats');
  return data.data;
}

export async function updateReviewStatus(reviewId, status) {
  const { data } = await axiosClient.patch(`/admin/reviews/${reviewId}/status`, { status });
  return data.data;
}

export async function deleteReview(reviewId) {
  await axiosClient.delete(`/admin/reviews/${reviewId}`);
  return { id: reviewId };
}

// ================= Categories management =================
function mapCategory(c) {
  return {
    id: c._id,
    name: c.name,
    status: c.isActive ? 'active' : 'inactive',
    image: c.imageUrl || null,
  };
}

export async function getCategories() {
  const { data } = await axiosClient.get('/admin/categories');
  return data.data.map(mapCategory);
}

export async function getCategoryStats() {
  const { data } = await axiosClient.get('/admin/categories/stats');
  return data.data;
}

async function uploadCategoryImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axiosClient.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.url;
}

export async function createCategory(categoryData) {
  const imageUrl = categoryData.image instanceof File
    ? await uploadCategoryImage(categoryData.image)
    : '';

  const { data } = await axiosClient.post('/admin/categories', {
    name: categoryData.name,
    isActive: categoryData.status === 'active',
    imageUrl,
  });
  return mapCategory(data.data);
}

export async function updateCategory(categoryId, categoryData) {
  const payload = {
    name: categoryData.name,
    isActive: categoryData.status === 'active',
  };
  if (categoryData.image instanceof File) {
    payload.imageUrl = await uploadCategoryImage(categoryData.image);
  }
  const { data } = await axiosClient.put(`/admin/categories/${categoryId}`, payload);
  return mapCategory(data.data);
}

export async function updateCategoryStatus(categoryId, status) {
  const { data } = await axiosClient.put(`/admin/categories/${categoryId}`, {
    isActive: status === 'active',
  });
  return { id: categoryId, status };
}

export async function deleteCategory(categoryId) {
  await axiosClient.delete(`/admin/categories/${categoryId}`);
  return { id: categoryId };
}
// ================= Reports & Analytics =================
export async function getReportsSummary() {
  const { data } = await axiosClient.get('/admin/reports/summary');
  return data.data;
}

export async function getRevenueByMarket() {
  const { data } = await axiosClient.get('/admin/reports/revenue-by-market');
  return data.data;
}

export async function getTopFarmers(limit = 5) {
  const { data } = await axiosClient.get(`/admin/reports/top-farmers?limit=${limit}`);
  return data.data;
}
// ================= Announcements management =================
export async function getAnnouncements() {
  const { data } = await axiosClient.get('/admin/announcements');
  return data.data;
}

export async function getAnnouncementStats() {
  const { data } = await axiosClient.get('/admin/announcements/stats');
  return data.data;
}

export async function createAnnouncement(announcementData) {
  const { data } = await axiosClient.post('/admin/announcements', announcementData);
  return data.data;
}

export async function updateAnnouncement(announcementId, announcementData) {
  const { data } = await axiosClient.patch(`/admin/announcements/${announcementId}`, announcementData);
  return data.data;
}

export async function updateAnnouncementStatus(announcementId, status) {
  const { data } = await axiosClient.patch(`/admin/announcements/${announcementId}/status`, { status });
  return data.data;
}

export async function deleteAnnouncement(announcementId) {
  await axiosClient.delete(`/admin/announcements/${announcementId}`);
  return { id: announcementId };
}