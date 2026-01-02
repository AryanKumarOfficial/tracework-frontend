// lib/services/authService.ts
import { apiClient } from '../api/client';
import type { 
  RegisterRequest, 
  LoginRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest, 
  VerifyAccountRequest,
  LoginResponse,
  ApiResponse,
  UserProfile,
  LeadFilters,
  LeadData,
  ApplicationData,
} from '../types/auth.types';
import Cookies from 'js-cookie';

export class AuthService {
  private categoryToUserType: Record<string, number> = {
    photographer: 1,
    makeup: 2,
    developer: 3,
    tutor: 4,
  };

  // Reverse mapping for display purposes
  private userTypeToCategory: Record<number, string> = {
    1: 'photographer',
    2: 'makeup',
    3: 'developer',
    4: 'tutor',
  };

  // Cookie options
  private cookieOptions = {
    expires: 7, // 7 days
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  // ==========================================
  // AUTHENTICATION METHODS
  // ==========================================

  async register(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  category: string,
  captcha?: string
): Promise<ApiResponse<{ message: string; userId: string; email: string }>> {
  const userType = this.categoryToUserType[category] || 1;
  
  const request = {
    name,
    email,
    password,
       confirm_password: confirmPassword, 
    user_type: userType,                       
  };

  return apiClient.register(request as any);
}
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const request: LoginRequest = { email, password };
    const result = await apiClient.login(request);
    
    if (result.success && result.data) {
      const userData = {
        userId: result.data.userId,
        email: result.data.email,
        name: result.data.name,
        userType: result.data.userType,
        // isVerified: result.data.isVerified,
        category: this.userTypeToCategory[result.data.userType] || 'photographer',
      };
      
      Cookies.set('user', JSON.stringify(userData), this.cookieOptions);
      
      if (result.data.token) {
        Cookies.set('token', result.data.token, this.cookieOptions);
      }
      
      if (result.data.refreshToken) {
        Cookies.set('refreshToken', result.data.refreshToken, this.cookieOptions);
      }
    }
    
    return result;
  }

  async logout(): Promise<ApiResponse> {
    const result = await apiClient.logout();
    
    // Clear all auth-related cookies
    this.clearAuthCookies();
    
    // Clear any stored user data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      localStorage.removeItem('pendingVerificationEmail');
    }
    
    return result;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.refreshToken();
  }

  async verifyAccount(email: string, code: string): Promise<ApiResponse<{ message: string; userId: string }>> {
    const request: VerifyAccountRequest = { email, code };
    return apiClient.verifyAccount(request);
  }

  async resendVerificationCode(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.resendVerificationCode(email);
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    const request: ForgotPasswordRequest = { email };
    return apiClient.forgotPassword(request);
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    const request: ResetPasswordRequest = { email, token, newPassword };
    return apiClient.resetPassword(request);
  }

  // ==========================================
  // USER PROFILE METHODS
  // ==========================================

  async getUserProfile(userId: string): Promise<ApiResponse<{ user: UserProfile }>> {
    return apiClient.getUserProfile(userId);
  }

  async getMyProfile(): Promise<ApiResponse<{ user: UserProfile }>> {
    return apiClient.getMyProfile();
  }

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<{ message: string; user: UserProfile }>> {
    const userId = this.getUserId();
    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }
    
    const result = await apiClient.updateProfile(userId, data);
    
    // Update user data in cookies if successful
    if (result.success && result.data?.user) {
      this.updateUserInCookies({
        name: result.data.user.name,
        email: result.data.user.email,
      });
    }
    
    return result;
  }

  // ==========================================
  // LEAD/JOB METHODS
  // ==========================================

  async getLeads(filters: LeadFilters = {}): Promise<ApiResponse<{ leads: LeadData[]; total: number }>> {
    return apiClient.getLeads(filters);
  }

  async getLeadById(leadId: string): Promise<ApiResponse<{ lead: LeadData }>> {
    return apiClient.getLeadById(leadId);
  }

  async createLead(data: any): Promise<ApiResponse<{ message: string; leadId: string; lead: LeadData }>> {
    return apiClient.createLead(data);
  }

  async updateLead(leadId: string, data: any): Promise<ApiResponse<{ message: string; lead: LeadData }>> {
    return apiClient.updateLead(leadId, data);
  }

  async deleteLead(leadId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.deleteLead(leadId);
  }

  async applyToLead(
    leadId: string, 
    coverLetter: string, 
    proposedRate?: number
  ): Promise<ApiResponse<{ message: string; applicationId: string }>> {
    return apiClient.applyToLead({
      leadId,
      coverLetter,
      proposedRate,
    });
  }

  async getMyApplications(filters: {
    status?: number;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<{ applications: ApplicationData[]; total: number }>> {
    return apiClient.getMyApplications(filters);
  }

  async updateApplicationStatus(
    applicationId: string,
    status: number,
    notes?: string
  ): Promise<ApiResponse<{ message: string; application: ApplicationData }>> {
    return apiClient.updateApplicationStatus(applicationId, { status, notes });
  }

  // ==========================================
  // SAVED LEADS (Legacy - to be implemented)
  // ==========================================

  async saveLead(leadId: string): Promise<ApiResponse> {
    const userId = this.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return apiClient.saveLead(leadId, userId);
  }

  async unsaveLead(leadId: string): Promise<ApiResponse> {
    const userId = this.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return apiClient.unsaveLead(leadId, userId);
  }

  async getSavedLeads(): Promise<ApiResponse<{ leads: any[] }>> {
    const userId = this.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }
    return apiClient.getSavedLeads(userId);
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  getCurrentUser(): any {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        return JSON.parse(userCookie);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const token = this.getToken();
    return !!(user && token);
  }

  getUserType(): number | null {
    const user = this.getCurrentUser();
    return user?.userType || null;
  }

  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user?.userId || null;
  }

  getUserCategory(): string | null {
    const user = this.getCurrentUser();
    return user?.category || null;
  }

  clearAuthCookies(): void {
    Cookies.remove('user', this.cookieOptions);
    Cookies.remove('token', this.cookieOptions);
    Cookies.remove('refreshToken', this.cookieOptions);
    
    // Clear all cookies related to auth
    if (typeof document !== 'undefined') {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }

  // Token management
  getToken(): string | null {
    return Cookies.get('token') || null;
  }

  getRefreshToken(): string | null {
    return Cookies.get('refreshToken') || null;
  }

  // Update user data in cookies (e.g., after profile update)
  updateUserInCookies(updatedData: Partial<any>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      Cookies.set('user', JSON.stringify(updatedUser), this.cookieOptions);
    }
  }

  // Check if user is verified
  isUserVerified(): boolean {
    const user = this.getCurrentUser();
    return user?.isVerified || false;
  }

  // Handle token expiration
  async handleTokenExpiration(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.clearAuthCookies();
        return false;
      }

      const result = await this.refreshToken();
      if (result.success && result.data?.token) {
        // Update token in cookies
        Cookies.set('token', result.data.token, this.cookieOptions);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    this.clearAuthCookies();
    return false;
  }

  // Check authentication status with backend
  async checkAuthStatus(): Promise<boolean> {
    try {
      const result = await this.getMyProfile();
      return result.success;
    } catch (error) {
      return false;
    }
  }

  // Get enum values for forms
  getExperienceLevels() {
    return [
      { value: 1, label: 'Fresher' },
      { value: 2, label: 'Intermediate' },
      { value: 3, label: 'Experienced' },
    ];
  }

  getJobTypes() {
    return [
      { value: 1, label: 'Hourly' },
      { value: 2, label: 'Daily' },
      { value: 3, label: 'Project' },
    ];
  }

  getApplicationStatuses() {
    return [
      { value: 1, label: 'Pending' },
      { value: 2, label: 'Shortlisted' },
      { value: 3, label: 'Rejected' },
      { value: 4, label: 'Accepted' },
    ];
  }
}

// Singleton instance
export const authService = new AuthService();