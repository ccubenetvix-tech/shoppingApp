/**
 * Storage Keys
 * Centralized storage key constants to avoid typos and ensure consistency
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  ONBOARDING_SEEN: 'onboarding_seen',
  CART: 'cart_data',
  FAVORITES: 'favorites_data',
  LANGUAGE: 'app_language',
  THEME: 'app_theme',
} as const;

/**
 * API Endpoints
 * Centralized API endpoint paths
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    GOOGLE_VERIFY: '/api/auth/google/verify-token',
    REFRESH_TOKEN: '/auth/refresh',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAILS: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
  },

  // Orders
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAILS: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },

  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/profile',
    ADDRESSES: '/user/addresses',
    PAYMENT_METHODS: '/user/payment-methods',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
  },

  // Stores
  STORES: {
    LIST: '/stores',
    DETAILS: (id: string) => `/stores/${id}`,
  },
} as const;

/**
 * OAuth Configuration
 */
export const OAUTH_CONFIG = {
  SCOPES: ['profile', 'email'],
  REDIRECT_PATH: 'auth',
} as const;

/**
 * App Constants
 */
export const APP_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_CART_ITEMS: 50,
  REQUEST_TIMEOUT: 30000, // 30 seconds
  DEFAULT_LANGUAGE: 'en' as const,
  SUPPORTED_LANGUAGES: ['en', 'af'] as const,
} as const;
