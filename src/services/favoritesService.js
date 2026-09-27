import axiosClient from './axiosClient'

// Farmers
export async function toggleFavoriteFarmer(farmerId) {
  const { data } = await axiosClient.post(`/favorites/farmer/${farmerId}`)
  return data.data 
}

export async function getFavoriteFarmers() {
  const { data } = await axiosClient.get('/favorites/farmer')
  return data.data 
}

// Products
export async function toggleFavoriteProduct(productId) {
  const { data } = await axiosClient.post(`/favorites/product/${productId}`)
  return data.data 
}

export async function getFavoriteProducts() {
  const { data } = await axiosClient.get('/favorites/product')
  return data.data 
}