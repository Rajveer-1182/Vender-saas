import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ required for cookies
  headers: {
    "Content-Type": "application/json"
  }
});

// ============ AUTH ENDPOINTS ============
// export const authAPI = {
//   register: async (data) => {
//     const res = await apiClient.post("/auth/register", data);
//     return res.data;
//   },

//   login: async (data) => {
//     const res = await apiClient.post("/auth/login", data);
//     return res.data;
//   },

//   getProfile: async () => {
//     const res = await apiClient.get("/auth/profile");
//     return res.data;
//   },

//   updateProfile: async (data) => {
//     const res = await apiClient.put("/auth/update-profile", data);
//     return res.data;
//   }
// };

export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),

  login: (data) => apiClient.post("/auth/login", data),

  getProfile: () => apiClient.get("/auth/profile"),

  updateProfile: (data) => apiClient.put("/auth/update-profile", data)
};
// ============ INVENTORY ENDPOINTS ============
export const inventoryAPI = {
  addInventory: (data) => apiClient.post("/inventory/add", data),
  getAllInventory: () => apiClient.get("/inventory/all"),
  getInventoryById: (id) => apiClient.get(`/inventory/${id}`),
  getByCategory: (category) => apiClient.get(`/inventory/category/${category}`),
  updateInventory: (id, data) => apiClient.put(`/inventory/${id}`, data),
  deleteInventory: (id) => apiClient.delete(`/inventory/${id}`),
  checkAvailability: (data) => apiClient.post("/inventory/check-availability", data)
};

// ============ BOOKING ENDPOINTS ============
export const bookingAPI = {
  createBooking: (data) => apiClient.post("/bookings/create", data),
  getAllBookings: () => apiClient.get("/bookings/all"),
  getBookingById: (id) => apiClient.get(`/bookings/${id}`),
  getBookingsByMonth: (month, year) => 
    apiClient.get(`/bookings/calendar/${month}/${year}`),
  updateBookingStatus: (id, data) => 
    apiClient.put(`/bookings/${id}/update-status`, data),
  updatePayment: (id, data) => 
    apiClient.put(`/bookings/${id}/update-payment`, data),
  sendInvoice: (id) => apiClient.post(`/bookings/${id}/send-invoice`),
  markDamage: (id, data) => apiClient.post(`/bookings/${id}/mark-damage`, data),
  completeBooking: (id) => apiClient.post(`/bookings/${id}/complete`),
  cancelBooking: (id) => apiClient.delete(`/bookings/${id}/cancel`),
  getDashboardAnalytics: () => apiClient.get("/bookings/analytics/dashboard")
};

// Error handler
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      // Cookie will be cleared by server
      window.location.href = "/auth/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
