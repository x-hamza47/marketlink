import axiosClient from "./axiosClient";

// ================= Profile — shared across Admin / Farmer / Customer =================
// Since this mock layer has no persistence across reloads beyond in-memory,
// we key off the currently logged-in user (from useAuthStore) at call time.

/**
 * Backend endpoint (planned): GET /profile
 * Returns the logged-in user's full profile (role-aware on the backend —
 * e.g. includes stall info for farmers, order count for customers).
 */
export async function getProfile(userId) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.get('/profile')
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: "Hamza Aamir",
        email: "hamza@marketlink.app",
        phone: "0321-1234567",
        role: "admin",
        avatarUrl: null,
        createdAt: "2026-01-10T09:00:00",
      });
    }, 300);
  });
}

/**
 * Backend endpoint (planned): PATCH /profile
 * Sends multipart/form-data — same pattern as createCategory/updateCategory —
 * backend handles the Cloudinary upload, we just attach the raw File under "avatar".
 */
export async function updateProfile(profileData) {
  const formData = new FormData();
  formData.append("name", profileData.name);
  formData.append("email", profileData.email);
  formData.append("phone", profileData.phone);
  if (profileData.avatar instanceof File) {
    formData.append("avatar", profileData.avatar);
  }

  // --- LIVE API CALL ---
  // const { data } = await axiosClient.patch('/profile', formData, {
  //   headers: { 'Content-Type': 'multipart/form-data' },
  // })
  // return data

  // --- STATIC MOCK (echoes back with a local preview URL, like updateCategory) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        avatarUrl:
          profileData.avatar instanceof File
            ? URL.createObjectURL(profileData.avatar)
            : profileData.avatarUrl ?? null,
      });
    }, 400);
  });
}

/**
 * Backend endpoint (planned): PATCH /profile/password
 */
export async function changePassword(passwordData) {
  // --- LIVE API CALL ---
  // const { data } = await axiosClient.patch('/profile/password', passwordData)
  // return data

  // --- STATIC MOCK ---
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a wrong-current-password failure so the UI's error path is testable.
      if (passwordData.currentPassword === "wrongpass") {
        reject({ response: { data: { message: "Current password is incorrect." } } });
        return;
      }
      resolve({ success: true });
    }, 400);
  });
}