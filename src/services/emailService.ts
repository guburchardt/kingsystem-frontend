import { API_BASE_URL, getAuthHeaders } from './api';

export interface Email {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  contact_method: 'Telefone' | 'Whatsapp' | 'Email' | 'Outros';
  status: 'pendente' | 'respondido' | 'contratado' | 'cancelado';
  message?: string;
  internal_notes?: string;
  assigned_to?: string;
  assigned_user_name?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailStats {
  pendente: number;
  respondido: number;
  contratado: number;
  cancelado: number;
  total: number;
}

export interface EmailFilters {
  status?: string;
  contact_method?: string;
  month?: number;
  year?: number;
}

export interface CreateEmailData {
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  contact_method: 'Telefone' | 'Whatsapp' | 'Email' | 'Outros';
  status?: 'pendente' | 'respondido' | 'contratado' | 'cancelado';
  message?: string;
  internal_notes?: string;
}

export interface UpdateEmailData {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  contact_method?: 'Telefone' | 'Whatsapp' | 'Email' | 'Outros';
  status?: 'pendente' | 'respondido' | 'contratado' | 'cancelado';
  message?: string;
  internal_notes?: string;
}

class EmailService {
  async getEmails(filters?: EmailFilters): Promise<Email[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.contact_method) params.append('contact_method', filters.contact_method);
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.year) params.append('year', filters.year.toString());

    const response = await fetch(`${API_BASE_URL}/emails?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch emails');
    }
    
    const data = await response.json();
    return data.emails;
  }

  async getEmailStats(filters?: { month?: number; year?: number }): Promise<EmailStats> {
    const params = new URLSearchParams();
    
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.year) params.append('year', filters.year.toString());

    const response = await fetch(`${API_BASE_URL}/emails/stats?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch email stats');
    }
    
    return await response.json();
  }

  async getEmailById(id: string): Promise<Email> {
    const response = await fetch(`${API_BASE_URL}/emails/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch email');
    }
    
    const data = await response.json();
    return data.email;
  }

  async createEmail(data: CreateEmailData): Promise<Email> {
    const response = await fetch(`${API_BASE_URL}/emails`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create email');
    }
    
    const result = await response.json();
    return result.email;
  }

  async updateEmail(id: string, data: UpdateEmailData): Promise<Email> {
    const response = await fetch(`${API_BASE_URL}/emails/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update email');
    }
    
    const result = await response.json();
    return result.email;
  }

  async assignEmail(id: string, userId: string): Promise<Email> {
    const response = await fetch(`${API_BASE_URL}/emails/${id}/assign`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ assigned_to: userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to assign email');
    }
    
    const result = await response.json();
    return result.email;
  }

  async deleteEmail(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/emails/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete email');
    }
  }

  // Método para criar email público (sem autenticação) - para formulário do site
  async createPublicEmail(data: CreateEmailData): Promise<Email> {
    const response = await fetch(`${API_BASE_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create public email');
    }
    
    const result = await response.json();
    return result.email;
  }

  // Métodos auxiliares para formatação
  getStatusLabel(status: string): string {
    const labels = {
      'pendente': 'Pendente',
      'respondido': 'Respondido',
      'contratado': 'Contratado',
      'cancelado': 'Cancelado'
    };
    return labels[status as keyof typeof labels] || status;
  }

  getStatusColor(status: string): string {
    const colors = {
      'pendente': '#f39c12',
      'respondido': '#3498db',
      'contratado': '#27ae60',
      'cancelado': '#e74c3c'
    };
    return colors[status as keyof typeof colors] || '#6c757d';
  }

  getContactMethodIcon(method: string): string {
    const icons = {
      'Email': 'mail',
      'Telefone': 'phone',
      'Whatsapp': 'whatsapp',
      'Outros': 'contact'
    };
    return icons[method as keyof typeof icons] || 'contact';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export const emailService = new EmailService(); 