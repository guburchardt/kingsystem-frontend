import { Client, ClientsResponse } from '../types';
import { API_BASE_URL, getAuthHeaders } from './api';

class ClientService {

  async getActiveClients(): Promise<{ clients: Client[] }> {
    const response = await fetch(`${API_BASE_URL}/clients/active`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar clientes ativos');
    return await response.json();
  }

  async getClients(): Promise<ClientsResponse> {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar clientes');
    return await response.json();
  }

  async getClientById(id: string): Promise<{ client: Client }> {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar cliente');
    return await response.json();
  }

  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<{ client: Client }> {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(client),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
        throw new Error(errorMessages);
      }
      throw new Error(data.message || 'Erro ao criar cliente');
    }
    
    return data;
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<{ client: Client }> {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
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
      throw new Error(data.message || 'Erro ao atualizar cliente');
    }
    
    return data;
  }

  async deleteClient(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao deletar cliente');
  }
}

export const clientService = new ClientService();
export default clientService; 