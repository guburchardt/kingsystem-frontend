import { Vehicle, VehiclesResponse } from '../types';
import { API_BASE_URL, getAuthHeaders } from './api';

class VehicleService {
  // Buscar todos os veículos com paginação
  async getVehicles(page: number = 1, limit: number = 10, search?: string, status?: string): Promise<VehiclesResponse> {
    try {
      const headers = getAuthHeaders();
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (status) params.append('status', status);

      const response = await fetch(`${API_BASE_URL}/api/vehicles?${params}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vehicles');
      }

      return data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  }

  // Buscar veículo por ID
  async getVehicleById(id: string): Promise<{ vehicle: Vehicle }> {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch vehicle');
      }

      return data;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  }

  // Criar novo veículo
  async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<{ message: string; vehicle: Vehicle }> {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
        method: 'POST',
        headers,
        body: JSON.stringify(vehicleData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Failed to create vehicle');
      }

      return data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  }

  // Atualizar veículo
  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<{ message: string; vehicle: Vehicle }> {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(vehicleData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Failed to update vehicle');
      }

      return data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  }

  // Deletar veículo (soft delete)
  async deleteVehicle(id: string): Promise<{ message: string }> {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete vehicle');
      }

      return data;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }

  // Buscar veículos ativos (para dropdowns)
  async getActiveVehicles(): Promise<{ vehicles: Vehicle[] }> {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/vehicles?status=active`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch active vehicles');
      }

      return data;
    } catch (error) {
      console.error('Error fetching active vehicles:', error);
      throw error;
    }
  }

  // Ativar/desativar veículo
  async toggleVehicleStatus(id: string, status: 'active' | 'inactive' | 'maintenance'): Promise<{ message: string; vehicle: Vehicle }> {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update vehicle status');
      }

      return data;
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      throw error;
    }
  }
}

export const vehicleService = new VehicleService();
export default vehicleService; 