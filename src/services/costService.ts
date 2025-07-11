import { Cost, RentalCost } from '../types';
import { API_BASE_URL, getAuthHeaders } from './api';

class CostService {
  async getCosts(): Promise<{ costs: Cost[] }> {
    const response = await fetch(`${API_BASE_URL}/api/costs`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar custos');
    return await response.json();
  }

  async getCostById(id: string): Promise<{ cost: Cost }> {
    const response = await fetch(`${API_BASE_URL}/api/costs/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar custo');
    return await response.json();
  }

  async createCost(cost: Omit<Cost, 'id'>): Promise<{ cost: Cost }> {
    const response = await fetch(`${API_BASE_URL}/api/costs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(cost),
    });
    if (!response.ok) throw new Error('Erro ao criar custo');
    return await response.json();
  }

  async updateCost(id: string, updates: Partial<Cost>): Promise<{ cost: Cost }> {
    const response = await fetch(`${API_BASE_URL}/api/costs/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Erro ao atualizar custo');
    return await response.json();
  }

  async deleteCost(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/costs/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao deletar custo');
  }

  async getRentalCosts(rentalId: string): Promise<{ rentalCosts: RentalCost[] }> {
    const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}/costs`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar custos da locação');
    return await response.json();
  }

  async addRentalCost(rentalId: string, costId: string, quantity: number): Promise<{ rentalCost: RentalCost }> {
    const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}/costs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ cost_id: costId, quantity }),
    });
    if (!response.ok) throw new Error('Erro ao adicionar custo à locação');
    return await response.json();
  }

  async updateRentalCost(rentalId: string, costId: string, value: number): Promise<{ rentalCost: RentalCost }> {
    const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}/costs/${costId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ value }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar custo da locação');
    return await response.json();
  }

  async removeRentalCost(rentalId: string, costId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}/costs/${costId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao remover custo da locação');
  }
}

export const costService = new CostService();
export default costService; 