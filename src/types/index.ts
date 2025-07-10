// User types
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: 'admin' | 'seller';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Client types
export interface Client {
  id: string;
  name: string;
  cpf?: string;
  cnpj?: string;
  phone: string;
  mobile?: string;
  email?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  zip_code?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Vehicle types
export interface Vehicle {
  id: string;
  name: string;
  capacity: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Driver types
export interface Driver {
  id: string;
  name: string;
  phone?: string;
  license_number?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Rental types
export interface Rental {
  id: string;
  client_id: string;
  seller_id: string;
  vehicle_id: string;
  driver_id: string;
  
  // Event details
  event_date: string;
  event_date_return?: string;
  event_day_of_week?: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  
  // Location details
  pickup_location: string;
  dropoff_location?: string;
  
  // Contract details
  category?: string;
  pit_stop?: boolean;

  route_description?: string;
  courtesies?: string;
  pit_stop_details?: string;
  
  // Contact method
  contact_method?: 'sms' | 'instagram' | 'person' | 'whatsapp' | 'email';
  
  // Financial details
  base_price: number;
  additional_costs: number;
  total_cost: number;
  net_amount: number;
  total_value?: number;
  payment_method?: 'a_vista' | 'pagseguro' | 'credito' | 'debito' | 'cheque' | 'permuta' | 'outros' | 'cupom' | 'pix';
  payment_description?: string;
  
  // Status and payment
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  situation?: 'adiado' | 'remarcado';
  payment_status: 'pending' | 'paid' | 'overdue';
  
  // Contract file
  contract_url?: string;
  
  // Additional info
  has_pending_issues: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Related data
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  seller_name?: string;
  vehicle_name?: string;
  vehicle_capacity?: number;
  driver_name?: string;
}

// Payment types
export interface Payment {
  id: string;
  rental_id: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  method?: string;
  payment_form?: string;
  receipt_url?: string;
  rejection_reason?: string;
  status: 'pending' | 'paid' | 'overdue' | 'aberto' | 'atrasado' | 'pendente' | 'a_receber';
  created_at: string;
  updated_at: string;
}

// Expense types
export interface Expense {
  id: string;
  rental_id: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
}

// Dashboard types
export interface DashboardMetrics {
  totalClients: number;
  pendingRentals: number;
  pendingPayments: number;
  approvedRentals: number;
  completedRentals: number;
  todayRentals: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  activeVehicles: number;
  activeDrivers: number;
}

export interface WeeklyPerformance {
  week: number;
  period: string;
  rentals_count: number;
  total_revenue: number;
  net_sales: number;
}

export interface SalesPerformance {
  id?: string;
  seller_id?: string;
  seller_name: string;
  total_rentals: number;
  total_revenue?: number;
  total_commission?: number;
  gross_sales?: number;
  net_sales?: number;
  performance_category?: string;
  weeklyData?: WeeklyPerformance[];
}

export interface SalesGoals {
  currentRevenue: number;
  target: number;
  progress: number;
  currentLevel: string;
  levels: Record<string, { min: number; max: number; color: string }>;
  remaining: number;
}

// API Response types
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Specific API response types for backend compatibility
export interface ClientsResponse {
  clients: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VehiclesResponse {
  vehicles: Vehicle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DriversResponse {
  drivers: Driver[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RentalsResponse {
  rentals: Rental[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaymentsResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Cost {
  id: string;
  name: string;
  value: number;
}

export interface RentalCost {
  id: string;
  rental_id: string;
  cost_id: string;
  quantity: number;
  total_value: number;
  name: string;
  value: number;
}

export interface Courtesy {
  id: string;
  name: string;
  description?: string;
  value?: number;
  price?: string | number;
  status?: 'active' | 'inactive';
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface RentalCourtesy {
  id: string;
  rental_id: string;
  courtesy_id: string;
  quantity: number;
  total_value: number;
  created_at: string;
  courtesy?: Courtesy;
} 