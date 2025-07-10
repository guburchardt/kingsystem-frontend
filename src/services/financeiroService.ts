import { API_BASE_URL, getAuthHeaders } from './api';

export interface Receita {
  id: string;
  rental_id: string;
  amount: string;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue';
  created_at: string;
  rental_status: string;
  client_name: string;
  seller_name: string;
  payment_method: string;
}

export interface Despesa {
  rental_id: string;
  event_date: string;
  client_id: string;
  client_name: string;
  seller_name: string;
  vehicle_name: string;
  total_expenses: string;
  rental_costs_total: string;
  rental_courtesies_total: string;
  costs_details: Array<{
    id: string;
    cost_name: string;
    quantity: number;
    unit_price: string;
    total_value: string;
  }>;
  courtesies_details: Array<{
    id: string;
    courtesy_name: string;
    quantity: number;
    unit_price: string;
    total_value: string;
  }>;
}

export interface FinanceiroTotals {
  totalReceitas: number;
  receitasPagas: number;
  receitasPendentes: number;
  receitasAtrasadas: number;
  totalDespesas: number;
  totalContasFixas: number;
  totalComissoes: number;
  totalImpostos: number;
  totalLucro: number;
  totalParcelas: number;
}

export interface GetReceitasParams {
  month?: number;
  year?: number;
  status?: string;
}

export interface GetDespesasParams {
  month?: number;
  year?: number;
}

export const financeiroService = {
  async getReceitas(params: GetReceitasParams) {
    const queryParams = new URLSearchParams();
    if (params.month) queryParams.append('month', params.month.toString());
    if (params.year) queryParams.append('year', params.year.toString());
    if (params.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/financeiro/receitas?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getDespesas(params: GetDespesasParams) {
    const queryParams = new URLSearchParams();
    if (params.month) queryParams.append('month', params.month.toString());
    if (params.year) queryParams.append('year', params.year.toString());

    const response = await fetch(`${API_BASE_URL}/financeiro/despesas?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async updateReceitaStatus(receitaId: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/financeiro/receitas/${receitaId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
}; 