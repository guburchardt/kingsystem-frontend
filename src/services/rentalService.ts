import axios from 'axios';
import { API_BASE_URL, getAuthHeaders } from './api';
import { Rental } from '../types';

// Create axios instance with common configuration
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class RentalService {
  async getRentals(params?: any) {
    const response = await api.get('/api/rentals', { params });
    return response.data;
  }

  async getRental(id: string) {
    const response = await api.get(`/api/rentals/${id}`);
    return response.data;
  }

  async getRentalById(id: string) {
    const response = await api.get(`/api/rentals/${id}`);
    return response.data;
  }

  async createRental(rental: Partial<Rental>) {
    const response = await api.post('/api/rentals', rental);
    return response.data;
  }

  async updateRental(id: string, rental: Partial<Rental>) {
    const response = await api.put(`/api/rentals/${id}`, rental);
    return response.data;
  }

  async deleteRental(id: string) {
    const response = await api.delete(`/api/rentals/${id}`);
    return response.data;
  }

  async toggleRentalStatus(id: string) {
    const response = await api.put(`/api/rentals/${id}/toggle-status`);
    return response.data;
  }

  async completeRental(id: string) {
    const response = await api.put(`/api/rentals/${id}/complete`);
    return response.data;
  }

  async cancelRental(id: string) {
    const response = await api.put(`/api/rentals/${id}/cancel`);
    return response.data;
  }

  async generateContract(id: string) {
    const response = await api.post(`/api/rentals/${id}/generate-contract`);
    return response.data;
  }

  async downloadContract(id: string) {
    const response = await api.get(`/api/rentals/${id}/contract`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async uploadFile(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/rentals/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadPaymentFile(id: string, paymentId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('paymentId', paymentId);

    const response = await api.post(`/api/rentals/${id}/upload-payment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getRentalFiles(id: string) {
    const response = await api.get(`/api/rentals/${id}/files`);
    return response.data;
  }

  async listFiles(id: string) {
    const response = await api.get(`/api/rentals/${id}/files`);
    return response.data.files;
  }

  async downloadRentalFile(id: string, fileId: string) {
    const response = await api.get(`/api/rentals/${id}/files/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async downloadFile(id: string, fileId: string, fileName: string) {
    const response = await api.get(`/api/rentals/${id}/files/${fileId}`, {
      responseType: 'blob',
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  async deleteRentalFile(id: string, fileId: string) {
    const response = await api.delete(`/api/rentals/${id}/files/${fileId}`);
    return response.data;
  }

  async deleteFile(id: string, fileId: string) {
    const response = await api.delete(`/api/rentals/${id}/files/${fileId}`);
    return response.data;
  }

  async getRentalPayments(id: string) {
    const response = await api.get(`/api/rentals/${id}/payments`);
    return response.data;
  }

  async createRentalPayment(id: string, payment: any) {
    const response = await api.post(`/api/rentals/${id}/payments`, payment);
    return response.data;
  }

  async updateRentalPayment(id: string, paymentId: string, payment: any) {
    const response = await api.put(`/api/rentals/${id}/payments/${paymentId}`, payment);
    return response.data;
  }

  async deleteRentalPayment(id: string, paymentId: string) {
    const response = await api.delete(`/api/rentals/${id}/payments/${paymentId}`);
    return response.data;
  }

  async getRentalCourtesies(id: string) {
    const response = await api.get(`/api/rentals/${id}/courtesies`);
    return response.data;
  }

  async createRentalCourtesy(id: string, courtesy: any) {
    const response = await api.post(`/api/rentals/${id}/courtesies`, courtesy);
    return response.data;
  }

  async updateRentalCourtesy(id: string, courtesyId: string, courtesy: any) {
    const response = await api.put(`/api/rentals/${id}/courtesies/${courtesyId}`, courtesy);
    return response.data;
  }

  async deleteRentalCourtesy(id: string, courtesyId: string) {
    const response = await api.delete(`/api/rentals/${id}/courtesies/${courtesyId}`);
    return response.data;
  }

  async getRentalCourtesiesTotal(id: string) {
    const response = await api.get(`/api/rentals/${id}/courtesies/total`);
    return response.data;
  }
}

export default new RentalService();