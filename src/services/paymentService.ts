import { Payment } from '../types';
import { API_BASE_URL, getAuthHeaders } from './api';

class PaymentService {
  async getPayments(): Promise<{ payments: Payment[] }> {
    const url = API_BASE_URL.endsWith('/') ? `${API_BASE_URL}api/payments` : `${API_BASE_URL}/api/payments`;
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar pagamentos');
    return await response.json();
  }

  async getRentalPayments(rentalId: string): Promise<Payment[]> {
    const response = await fetch(`${API_BASE_URL}/api/payments/rental/${rentalId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar pagamentos da locação');
    const data = await response.json();
    return data.payments || [];
  }

  async getPaymentById(id: string): Promise<{ payment: Payment }> {
    const response = await fetch(`${API_BASE_URL}/api/payments/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar pagamento');
    return await response.json();
  }

  async createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<{ payment: Payment }> {
    const response = await fetch(`${API_BASE_URL}/api/payments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payment),
    });
    if (!response.ok) throw new Error('Erro ao criar pagamento');
    return await response.json();
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<{ payment: Payment }> {
    const response = await fetch(`${API_BASE_URL}/api/payments/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Erro ao atualizar pagamento');
    return await response.json();
  }

  async deletePayment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/payments/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao deletar pagamento');
  }

  // Upload receipt for a payment
  async uploadReceipt(paymentId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}/receipt`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // Don't set Content-Type header for FormData, let the browser set it
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao fazer upload do comprovante');
    }

    return response.json();
  }

  // Confirm payment (Admin only)
  async confirmPayment(paymentId: string, paymentDate?: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}/confirm`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ payment_date: paymentDate }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao confirmar pagamento');
    }

    return response.json();
  }

  // Reject payment (Admin only)
  async rejectPayment(paymentId: string, reason: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao rejeitar pagamento');
    }

    return response.json();
  }

  // Recalculate payment status for all rentals (Admin only)
  async recalculateAllPaymentStatus(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/payments/recalculate-status`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao recalcular status dos pagamentos');
    }

    return response.json();
  }

  // Force refresh payment status for a specific rental
  async refreshRentalPaymentStatus(rentalId: string): Promise<Payment[]> {
    // First, get the payments (this will trigger recalculation in backend)
    const response = await fetch(`${API_BASE_URL}/api/payments/rental/${rentalId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar status dos pagamentos');
    }
    
    const data = await response.json();
    return data.payments || [];
  }
}

export const paymentService = new PaymentService();
export default paymentService; 