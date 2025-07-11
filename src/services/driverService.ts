import { Driver, DriversResponse } from '../types';
import { API_BASE_URL, getAuthHeaders } from './api';

class DriverService {
  async getActiveDrivers(): Promise<{ drivers: Driver[] }> {
    const response = await fetch(`${API_BASE_URL}/api/drivers/active`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar motoristas ativos');
    return await response.json();
  }

  async getDrivers(): Promise<DriversResponse> {
    const response = await fetch(`${API_BASE_URL}/api/drivers`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar motoristas');
    return await response.json();
  }

  async getDriverById(id: string): Promise<{ driver: Driver }> {
    const response = await fetch(`${API_BASE_URL}/api/drivers/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar motorista');
    return await response.json();
  }

  async createDriver(driver: Omit<Driver, 'id' | 'created_at' | 'updated_at'>): Promise<{ driver: Driver }> {
    const response = await fetch(`${API_BASE_URL}/api/drivers`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(driver),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error(data.message || 'Erro ao criar motorista');
    }
    
    return data;
  }

  async updateDriver(id: string, updates: Partial<Driver>): Promise<{ driver: Driver }> {
    const response = await fetch(`${API_BASE_URL}/api/drivers/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error(data.message || 'Erro ao atualizar motorista');
    }
    
    return data;
  }

  async deleteDriver(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/drivers/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao deletar motorista');
  }
}

export const driverService = new DriverService();
export default driverService; 