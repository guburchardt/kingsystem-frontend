import { User, UsersResponse } from '../types';
import { API_BASE_URL, getAuthHeaders } from './api';

class UserService {
  async getUsers(): Promise<UsersResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar usuários');
    return await response.json();
  }

  async getUserById(id: string): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar usuário');
    return await response.json();
  }

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Erro ao criar usuário');
    return await response.json();
  }

  async updateUser(id: string, updates: Partial<User>): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Erro ao atualizar usuário');
    return await response.json();
  }

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao deletar usuário');
  }

  // Buscar usuários ativos (para dropdowns)
  async getActiveUsers(): Promise<{ users: User[] }> {
    const response = await fetch(`${API_BASE_URL}/users/active`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar usuários ativos');
    return await response.json();
  }

  // Ativar/desativar usuário
  async toggleUserStatus(id: string, status: 'active' | 'inactive'): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar status do usuário');
    return await response.json();
  }

  // Buscar perfil do usuário atual
  async getCurrentUserProfile(): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar perfil do usuário');
    return await response.json();
  }

  // Atualizar perfil do usuário atual
  async updateCurrentUserProfile(userData: Partial<User>): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Erro ao atualizar perfil do usuário');
    return await response.json();
  }
}

export const userService = new UserService();
export default userService; 