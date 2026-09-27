import axiosClient from './axiosClient'

export async function loginRequest(credentials) {
  const { data } = await axiosClient.post('/auth/login', credentials)
  return data.data 
}