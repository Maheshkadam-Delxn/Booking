import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const serviceApi = {
  // Get all services with optional filters
  getAllServices: async (params = {}) => {
    const response = await axios.get(`${API_URL}/services`, { params });
    return response.data;
  },

  // Get a single service by ID
  getService: async (id) => {
    const response = await axios.get(`${API_URL}/services/${id}`);
    return response.data;
  },

  // Create a new service
  createService: async (serviceData) => {
    const response = await axios.post(`${API_URL}/services`, serviceData);
    return response.data;
  },

  // Update an existing service
  updateService: async (id, serviceData) => {
    const response = await axios.put(`${API_URL}/services/${id}`, serviceData);
    return response.data;
  },

  // Delete a service
  deleteService: async (id) => {
    const response = await axios.delete(`${API_URL}/services/${id}`);
    return response.data;
  },

  // Upload service photo
  uploadServicePhoto: async (id, photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    const response = await axios.put(
      `${API_URL}/services/${id}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get services by category
  getServicesByCategory: async (category) => {
    const response = await axios.get(`${API_URL}/services/category/${category}`);
    return response.data;
  },

  // Get service packages
  getServicePackages: async (id) => {
    const response = await axios.get(`${API_URL}/services/${id}/packages`);
    return response.data;
  },
}; 