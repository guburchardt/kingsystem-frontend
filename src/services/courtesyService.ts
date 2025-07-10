import { Courtesy, RentalCourtesy } from '../types';
import { API_BASE_URL, getAuthHeaders } from './api';

class CourtesyService {
  // Get all active courtesies
  async getActiveCourtesies(): Promise<Courtesy[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courtesies/active`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar cortesias");
      }

      const data = await response.json();
      return data.courtesies || [];
    } catch (error) {
      console.error("Erro ao buscar cortesias:", error);
      throw error;
    }
  }

  // Get all courtesies (admin only)
  async getAllCourtesies(): Promise<Courtesy[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courtesies`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar cortesias");
      }

      const data = await response.json();
      return data.courtesies || [];
    } catch (error) {
      console.error("Erro ao buscar cortesias:", error);
      throw error;
    }
  }

  // Create new courtesy (admin only)
  async createCourtesy(courtesy: Omit<Courtesy, 'id' | 'created_at' | 'updated_at'>): Promise<Courtesy> {
    try {
      const response = await fetch(`${API_BASE_URL}/courtesies`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(courtesy),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar cortesia");
      }

      const data = await response.json();
      return data.courtesy;
    } catch (error) {
      console.error("Erro ao criar cortesia:", error);
      throw error;
    }
  }

  // Update courtesy (admin only)
  async updateCourtesy(id: string, updates: Partial<Courtesy>): Promise<Courtesy> {
    try {
      const response = await fetch(`${API_BASE_URL}/courtesies/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar cortesia");
      }

      const data = await response.json();
      return data.courtesy;
    } catch (error) {
      console.error("Erro ao atualizar cortesia:", error);
      throw error;
    }
  }

  // Delete courtesy (admin only)
  async deleteCourtesy(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/courtesies/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar cortesia");
      }
    } catch (error) {
      console.error("Erro ao deletar cortesia:", error);
      throw error;
    }
  }

  // Get courtesies for a specific rental
  async getRentalCourtesies(rentalId: string): Promise<RentalCourtesy[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/courtesies`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar cortesias da locação");
      }

      const data = await response.json();
      return data.courtesies || [];
    } catch (error) {
      console.error("Erro ao buscar cortesias da locação:", error);
      throw error;
    }
  }

  // Add courtesy to rental
  async addCourtesyToRental(rentalId: string, courtesyId: string, quantity: number = 1): Promise<RentalCourtesy> {
    try {
      const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/courtesies`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          courtesy_id: courtesyId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar cortesia à locação");
      }

      const data = await response.json();
      return data.rentalCourtesy;
    } catch (error) {
      console.error("Erro ao adicionar cortesia à locação:", error);
      throw error;
    }
  }

  // Update courtesy quantity in rental
  async updateRentalCourtesyQuantity(rentalId: string, courtesyId: string, quantity: number): Promise<RentalCourtesy> {
    try {
      const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/courtesies/${courtesyId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar quantidade da cortesia");
      }

      const data = await response.json();
      return data.rentalCourtesy;
    } catch (error) {
      console.error("Erro ao atualizar quantidade da cortesia:", error);
      throw error;
    }
  }

  // Remove courtesy from rental
  async removeCourtesyFromRental(rentalId: string, courtesyId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/courtesies/${courtesyId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Erro ao remover cortesia da locação");
      }
    } catch (error) {
      console.error("Erro ao remover cortesia da locação:", error);
      throw error;
    }
  }

  // Calculate total courtesies value for a rental
  async calculateRentalCourtesiesTotal(rentalId: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/courtesies/total`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Erro ao calcular total das cortesias");
      }

      const data = await response.json();
      return data.total || 0;
    } catch (error) {
      console.error("Erro ao calcular total das cortesias:", error);
      throw error;
    }
  }
}

const courtesyService = new CourtesyService();
export default courtesyService; 