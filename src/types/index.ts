export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  orderDate: string;
  items: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}
