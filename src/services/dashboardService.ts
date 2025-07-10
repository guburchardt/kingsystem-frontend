import { DashboardMetrics, SalesPerformance } from '../types';
import { API_BASE_URL, getAuthHeaders } from './api';

class DashboardService {
  // Get dashboard metrics
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch metrics');
      }

      return data.metrics || data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }

  // Get seller performance (admin only)
  async getSellerPerformance(month?: number, year?: number): Promise<SalesPerformance[]> {
    try {
      const headers = getAuthHeaders();
      const params = new URLSearchParams();
      if (month) params.append('month', month.toString());
      if (year) params.append('year', year.toString());

      const response = await fetch(`${API_BASE_URL}/dashboard/seller-performance?${params}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch seller performance');
      }

      // Garantir que sempre retorne um array
      if (Array.isArray(data)) {
      return data;
      } else if (data && Array.isArray(data.data)) {
        return data.data;
      } else if (data && Array.isArray(data.performance)) {
        return data.performance;
      } else if (data && Array.isArray(data.sellers)) {
        return data.sellers;
      } else {
        console.warn('Seller performance data is not in expected format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching seller performance:', error);
      throw error;
    }
  }

  // Get recent rentals
  async getRecentRentals(limit: number = 10) {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/dashboard/recent-rentals?limit=${limit}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recent rentals');
      }

      return data;
    } catch (error) {
      console.error('Error fetching recent rentals:', error);
      throw error;
    }
  }

  // Get upcoming rentals
  async getUpcomingRentals(limit: number = 10) {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/dashboard/upcoming-rentals?limit=${limit}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch upcoming rentals');
      }

      return data;
    } catch (error) {
      console.error('Error fetching upcoming rentals:', error);
      throw error;
    }
  }

  // Get sales goals
  async getSalesGoals() {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/dashboard/sales-goals`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch sales goals');
      }

      return data;
    } catch (error) {
      console.error('Error fetching sales goals:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService; 