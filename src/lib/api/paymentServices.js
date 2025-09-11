import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create axios instance with auth header
const createAuthenticatedRequest = (token) => {
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const paymentServices = {
  // Process payment
  processPayment: async (paymentData, token) => {
    const config = createAuthenticatedRequest(token);
    const response = await axios.post(`${API_BASE_URL}/payments/process`, paymentData, config);
    return response.data;
  },

  // Get customer payments
  getMyPayments: async (token) => {
    const config = createAuthenticatedRequest(token);
    const response = await axios.get(`${API_BASE_URL}/payments/my-payments`, config);
    return response.data;
  },

  // Get payment receipt
  getReceipt: async (paymentId, token) => {
    const config = createAuthenticatedRequest(token);
    config.responseType = 'blob';
    const response = await axios.get(`${API_BASE_URL}/payments/${paymentId}/receipt`, config);
    return response.data;
  },

  // Get single payment
  getPayment: async (paymentId, token) => {
    const config = createAuthenticatedRequest(token);
    const response = await axios.get(`${API_BASE_URL}/payments/${paymentId}`, config);
    return response.data;
  }
};

export default paymentServices;