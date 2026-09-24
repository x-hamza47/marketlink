import axiosClient from './axiosClient'

export async function loginRequest(credentials) {
  // POST /auth/login → Express validates email/password, returns { user, token }
  const { data } = await axiosClient.post('/auth/login', credentials)
  return data // { user: { id, name, email, role, avatarUrl }, token: '...' }
}