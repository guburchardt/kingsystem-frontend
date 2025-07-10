import { API_BASE_URL, getAuthHeaders } from './api';

export interface FinancialReportParams {
  startDate: string;
  endDate: string;
}

export interface RentalsReportParams {
  startDate: string;
  endDate: string;
  status?: string;
}

export interface MonthlySalesReportParams {
  month?: number;
  year?: number;
  userId?: string;
  vehicleId?: string;
}

export interface MonthlySalesData {
  rentals: any[];
  totals: {
    totalGross: number;
    totalExpenses: number;
    totalCommission: number;
    totalTaxes: number;
    totalNetProfit: number;
    totalRentals: number;
  };
  users: Array<{
    id: string;
    name: string;
    rental_count: number;
  }>;
  vehicles: Array<{
    id: string;
    name: string;
  }>;
  month: number;
  year: number;
  filters: {
    userId: string;
    vehicleId: string | null;
  };
}

class ReportService {
  async getFinancialReport(params: FinancialReportParams) {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });

    const response = await fetch(`${API_BASE_URL}/reports/financial?${queryParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch financial report');
    }

    return response.json();
  }

  async getRentalsReport(params: RentalsReportParams) {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });

    if (params.status) {
      queryParams.append('status', params.status);
    }

    const response = await fetch(`${API_BASE_URL}/reports/rentals?${queryParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rentals report');
    }

    return response.json();
  }

  async getMonthlySalesReport(params: MonthlySalesReportParams = {}): Promise<{ success: boolean; data: MonthlySalesData }> {
    const queryParams = new URLSearchParams();
    
    if (params.month) queryParams.append('month', params.month.toString());
    if (params.year) queryParams.append('year', params.year.toString());
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.vehicleId) queryParams.append('vehicleId', params.vehicleId);

    const response = await fetch(`${API_BASE_URL}/reports/monthly-sales?${queryParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly sales report');
    }

    return response.json();
  }

  async downloadReport(type: string, params: any) {
    const queryParams = new URLSearchParams(params);
    
    const response = await fetch(`${API_BASE_URL}/reports/pdf/${type}?${queryParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to download report');
    }

    return response.blob();
  }
}

export default new ReportService(); 