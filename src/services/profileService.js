import axiosClient from "./axiosClient";

export async function getProfile() {
  const { data } = await axiosClient.get('/users/profile');
  return {
    id: data.data._id,
    name: data.data.name,
    email: data.data.email,
    phone: data.data.phone,
    address: data.data.address,
    role: data.data.role,
    avatarUrl: data.data.imageUrl || null,
    createdAt: data.data.createdAt,
  };
}

export async function updateProfile(profileData) {
  let imageUrl = profileData.avatarUrl;

  if (profileData.avatar instanceof File) {
    const formData = new FormData();
    formData.append('file', profileData.avatar);
    const { data: uploadRes } = await axiosClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    imageUrl = uploadRes.data.url;
  }

  const payload = {
    name: profileData.name,
    phone: profileData.phone,
    address: profileData.address || '',
  };
  if (imageUrl) payload.imageUrl = imageUrl;

  const { data } = await axiosClient.put('/users/profile', payload);
  return {
    name: data.data.name,
    email: data.data.email,
    phone: data.data.phone,
    avatarUrl: data.data.imageUrl || null,
  };
}

export async function changePassword(passwordData) {
  const { data } = await axiosClient.patch('/users/profile/password', {
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword,
  });
  return data.data;
}