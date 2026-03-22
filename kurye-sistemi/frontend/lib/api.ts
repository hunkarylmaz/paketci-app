// API Configuration
const API_BASE_URL = 'http://185.153.220.170:3000';

// Get token from localStorage
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.access_token || null;
    }
  }
  return null;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    apiRequest<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  me: () =>
    apiRequest<any>('/auth/me', {
      method: 'GET',
    }),
};

// Restaurants API
export const restaurantsApi = {
  getAll: () =>
    apiRequest<any[]>('/restaurants', {
      method: 'GET',
    }),
    
  getById: (id: string) =>
    apiRequest<any>(`/restaurants/${id}`, {
      method: 'GET',
    }),
    
  create: (data: any) =>
    apiRequest<any>('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: any) =>
    apiRequest<any>(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  delete: (id: string) =>
    apiRequest<void>(`/restaurants/${id}`, {
      method: 'DELETE',
    }),
};

// Couriers API
export const couriersApi = {
  getAll: () =>
    apiRequest<any[]>('/couriers', {
      method: 'GET',
    }),
    
  create: (data: any) =>
    apiRequest<any>('/couriers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: any) =>
    apiRequest<any>(`/couriers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  delete: (id: string) =>
    apiRequest<void>(`/couriers/${id}`, {
      method: 'DELETE',
    }),
};

// Users API
export const usersApi = {
  getAll: () =>
    apiRequest<any[]>('/users', {
      method: 'GET',
    }),
    
  getById: (id: string) =>
    apiRequest<any>(`/users/${id}`, {
      method: 'GET',
    }),
    
  create: (data: any) =>
    apiRequest<any>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  update: (id: string, data: any) =>
    apiRequest<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  delete: (id: string) =>
    apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
};
