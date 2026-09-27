import axiosClient from './axiosClient'

export async function loginRequest(credentials) {
  const { data } = await axiosClient.post('/auth/login', credentials)
  return data.data 
}

export async function registerCustomerRequest(payload) {
  const { data } = await axiosClient.post('/auth/register', payload)
  return data.data
}

export async function registerFarmerRequest(payload) {
  const { data } = await axiosClient.post('/auth/register/farmer', payload)
  return data.data
}