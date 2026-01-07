/**
 * Centralized API Client
 * All API calls should go through this service
 * Handles: auth headers, timeouts, error normalization, logging
 */

import { API_ENDPOINTS, APP_CONSTANTS } from '@/config/constants';
import { config as envConfig } from '@/config/env';
import { SecureStorage } from '@/lib/storage';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  store: string;
  inStock: boolean;
  description?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * API Client Class
 * Singleton pattern for consistent API access
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = envConfig.apiBaseUrl;
    this.timeout = APP_CONSTANTS.REQUEST_TIMEOUT;
  }

  /**
   * Generic request handler with auth, timeout, and error handling
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Get auth token if available - SECURITY: Never log the actual token
    const token = await SecureStorage.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.normalizeError(errorData, response.status);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw this.normalizeError({ message: 'Request timeout' }, 408);
      }
      
      throw error;
    }
  }

  /**
   * Normalize API errors for consistent handling
   */
  private normalizeError(errorData: any, status: number): ApiError {
    return {
      message: errorData.message || 'An unexpected error occurred',
      code: errorData.code,
      status,
    };
  }

  // ============ AUTHENTICATION ============

  /**
   * Email/Password Login
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Use mock API in development if configured
    if (envConfig.useMockApi) {
      return this.mockLogin(email, password);
    }

    return this.request<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * User Registration
   */
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<AuthResponse> {
    if (envConfig.useMockApi) {
      return this.mockRegister(userData);
    }

    return this.request<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Google OAuth Sign-In
   * @param accessToken - Google access token from OAuth flow
   */
  async googleSignIn(accessToken: string): Promise<AuthResponse> {
    if (envConfig.useMockApi) {
      return this.mockGoogleSignIn(accessToken);
    }

    return this.request<AuthResponse>(API_ENDPOINTS.AUTH.GOOGLE_VERIFY, {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  }

  /**
   * Logout (clears server-side session if applicable)
   */
  async logout(): Promise<void> {
    try {
      if (!envConfig.useMockApi) {
        await this.request(API_ENDPOINTS.AUTH.LOGOUT, { method: 'POST' });
      }
    } finally {
      // Always clear local storage
      await SecureStorage.removeAuthToken();
      await SecureStorage.removeUserData();
    }
  }

  // ============ MOCK API (Development Only) ============

  private async mockLogin(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= APP_CONSTANTS.MIN_PASSWORD_LENGTH) {
          resolve({
            user: {
              id: '1',
              name: email.split('@')[0],
              email,
              phone: '+27 123 456 789',
            },
            token: 'mock-token-' + Date.now(),
          });
        } else {
          reject(
            this.normalizeError(
              { message: 'Invalid email or password' },
              401
            )
          );
        }
      }, 1000);
    });
  }

  private async mockRegister(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          userData.email &&
          userData.password.length >= APP_CONSTANTS.MIN_PASSWORD_LENGTH &&
          userData.name &&
          userData.phone
        ) {
          resolve({
            user: {
              id: '1',
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
            },
            token: 'mock-token-' + Date.now(),
          });
        } else {
          reject(
            this.normalizeError(
              { message: 'Invalid registration data' },
              400
            )
          );
        }
      }, 1000);
    });
  }

  private async mockGoogleSignIn(
    accessToken: string
  ): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            name: 'Google User',
            email: 'googleuser@gmail.com',
            phone: '+27 123 456 789',
          },
          token: 'mock-google-token-' + Date.now(),
        });
      }, 1000);
    });
  }

  // ============ OTHER API METHODS ============
  // Add more methods as needed (products, orders, etc.)
}

// Export singleton instance
export const apiClient = new ApiClient();
