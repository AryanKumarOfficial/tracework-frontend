import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyAccountRequest,
  UserProfile,
  LeadFilters,
  LeadData,
  ApplicationData,
} from '../types/auth.types';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

// Backend request interface (snake_case for gRPC)
interface RegisterRequestBackend {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  user_type: number;
}

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    // Try to get token from js-cookie first
    let token = Cookies.get('token');
    
    // If not found, try manual cookie parsing
    if (!token && typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }
    
    console.log('🔑 Token status:', token ? 'Token found' : 'No token found');
    
    if (token) {
      return {
        'Authorization': `Bearer ${token}`
      };
    }
    
    return {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('📤 API Request:', {
      url: fullUrl,
      method: options.method || 'GET',
      body: options.body ? JSON.parse(options.body as string) : null,
    });

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      credentials: 'include',
    });

    console.log('📥 API Response:', {
      url: fullUrl,
      status: response.status,
      statusText: response.statusText,
    });

    // Handle unauthorized responses
    if (response.status === 401) {
      // Clear cookies
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('refreshToken');
      
      if (typeof document !== 'undefined') {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      
      return {
        success: false,
        error: 'Session expired. Please login again.',
      };
    }

    // Handle other error statuses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', errorData);
      
      return {
        success: false,
        error: errorData.message || errorData.error || `Request failed with status ${response.status}`,
        message: errorData.message,
      };
    }

    const data = await response.json();
    console.log('✅ API Success:', data);
    
    // If the backend already returns success/data structure, return as-is
    if (data.success !== undefined) {
      return data;
    }
    
    // Otherwise, wrap it for consistency
    return {
      success: true,
      data,
      message: data.message,
    };
  } catch (error) {
    console.error('❌ API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

  // ==========================================
  // AUTHENTICATION METHODS
  // ==========================================

  async register(data: RegisterRequestBackend): Promise<ApiResponse<{ message: string; userId: string; email: string }>> {
    console.log('🔍 Exact data being sent to backend:', {
      name: data.name,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      user_type: data.user_type,
      passwordsMatch: data.password === data.confirm_password
    });
    
    return this.request('/api/v1/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request('/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<ApiResponse> {
  // Clear cookies using js-cookie
  Cookies.remove('token');
  Cookies.remove('user');
  Cookies.remove('refreshToken');

  // Clear cookies manually (extra safety)
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  return {
    success: true,
    message: 'Logged out successfully',
  };
}


  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request('/api/v1/users/refresh-token', {
      method: 'POST',
    });
  }

  async verifyAccount(data: VerifyAccountRequest): Promise<ApiResponse<{ message: string; userId: string }>> {
    return this.request('/api/v1/users/verify-account', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendVerificationCode(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/v1/users/resend-verification-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/v1/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/v1/users/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==========================================
  // USER PROFILE METHODS
  // ==========================================

  async getUserProfile(userId: string): Promise<ApiResponse<{ user: UserProfile }>> {
    return this.request(`/api/v1/users/profile/${userId}`);
  }

  async getMyProfile(): Promise<ApiResponse<{ user: UserProfile }>> {
    return this.request('/api/v1/users/me');
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<ApiResponse<{ message: string; user: UserProfile }>> {
    return this.request('/api/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==========================================
  // LEAD/JOB METHODS
  // ==========================================

  async getLeads(filters: LeadFilters = {}): Promise<ApiResponse<{ leads: LeadData[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    
    const queryString = queryParams.toString();
    return this.request(`/api/v1/users/leads${queryString ? `?${queryString}` : ''}`);
  }

  async getLeadById(leadId: string): Promise<ApiResponse<{ lead: LeadData }>> {
    return this.request(`/api/v1/users/leads/${leadId}`);
  }

  async createLead(data: any): Promise<ApiResponse<{ message: string; leadId: string; lead: LeadData }>> {
    return this.request('/api/v1/users/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLead(leadId: string, data: any): Promise<ApiResponse<{ message: string; lead: LeadData }>> {
    return this.request(`/api/v1/users/leads/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(leadId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/api/v1/users/leads/${leadId}`, {
      method: 'DELETE',
    });
  }

  async applyToLead(data: {
    leadId: string;
    coverLetter: string;
    proposedRate?: number;
  }): Promise<ApiResponse<{ message: string; applicationId: string }>> {
    return this.request(`/api/v1/users/leads/${data.leadId}/apply`, {
      method: 'POST',
      body: JSON.stringify({
        coverLetter: data.coverLetter,
        proposedRate: data.proposedRate,
      }),
    });
  }

  async getMyApplications(filters: {
    status?: number;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<{ applications: ApplicationData[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return this.request(`/api/v1/users/applications${queryString ? `?${queryString}` : ''}`);
  }

  async updateApplicationStatus(applicationId: string, data: {
    status: number;
    notes?: string;
  }): Promise<ApiResponse<{ message: string; application: ApplicationData }>> {
    return this.request(`/api/v1/users/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==========================================
  // LEGACY METHODS (for backward compatibility)
  // ==========================================

  async saveLead(leadId: string, userId: string): Promise<ApiResponse> {
    return {
      success: false,
      error: 'Feature not yet implemented',
    };
  }

  async unsaveLead(leadId: string, userId: string): Promise<ApiResponse> {
    return {
      success: false,
      error: 'Feature not yet implemented',
    };
  }

  async getSavedLeads(userId: string): Promise<ApiResponse<{ leads: any[] }>> {
    return {
      success: false,
      error: 'Feature not yet implemented',
    };
  }





// Add these methods to your ApiClient class in client.ts

// ==========================================
// SERVICE METHODS
// ==========================================
async getServices(userId?: string): Promise<ApiResponse<{ services: any[] }>> {
  let endpoint = '/api/v1/users/services';
  
  if (userId) {
    endpoint += `?userId=${userId}`;
  }

  return this.request(endpoint);
}

async createService(data: {
  type: string;
  description: string;
  experienceYears: number;
  experienceMonths: number;
}): Promise<ApiResponse<{ message: string; service: any }>> {
  return this.request('/api/v1/users/services', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async updateService(serviceId: string, data: {
  type?: string;
  description?: string;
  experienceYears?: number;
  experienceMonths?: number;
}): Promise<ApiResponse<{ message: string; service: any }>> {
  return this.request(`/api/v1/users/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

async deleteService(serviceId: string): Promise<ApiResponse<{ message: string }>> {
  return this.request(`/api/v1/users/services/${serviceId}`, {
    method: 'DELETE',
  });
}

// ==========================================
// PORTFOLIO METHODS
// ==========================================
async getPortfolio(userId?: string): Promise<ApiResponse<{ portfolio: any[] }>> {
  let endpoint = '/api/v1/users/portfolio';
  
  if (userId) {
    endpoint += `?userId=${userId}`;
  }

  return this.request(endpoint);
}

async createPortfolio(data: {
  projectName: string;
  projectCaption: string;
  projectTags: string[];
  projectCategory: string;
  visibility: string;
  media: string[];
  mediaType: string;
}): Promise<ApiResponse<{ message: string; portfolio: any }>> {
  return this.request('/api/v1/users/portfolio', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async updatePortfolio(portfolioId: string, data: any): Promise<ApiResponse<{ message: string; portfolio: any }>> {
  return this.request(`/api/v1/users/portfolio/${portfolioId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

async deletePortfolio(portfolioId: string): Promise<ApiResponse<{ message: string }>> {
  return this.request(`/api/v1/users/portfolio/${portfolioId}`, {
    method: 'DELETE',
  });
}
}

export const apiClient = new ApiClient();