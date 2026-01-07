/**
 * Environment Configuration
 * Centralized environment variable access with type safety
 * All secrets and configuration come from .env files
 */

export type Environment = 'development' | 'staging' | 'production';

interface Config {
  // Environment
  environment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;

  // Google OAuth
  googleClientId: string;

  // API
  apiBaseUrl: string;
  useMockApi: boolean;

  // App
  appScheme: string;
}

/**
 * Get environment variable with fallback
 * @param key - Environment variable key
 * @param fallback - Fallback value if not found
 */
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && !fallback) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || fallback || '';
}

// Determine current environment
const currentEnv = (getEnvVar('EXPO_PUBLIC_ENVIRONMENT', 'development') as Environment);

/**
 * Application configuration
 * Access via: import { config } from '@/config/env'
 */
export const config: Config = {
  // Environment
  environment: currentEnv,
  isDevelopment: currentEnv === 'development',
  isProduction: currentEnv === 'production',

  // Google OAuth - SECURITY: Never hardcode, always use env vars
  googleClientId: getEnvVar('EXPO_PUBLIC_GOOGLE_CLIENT_ID'),

  // API Configuration
  apiBaseUrl: getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'https://api.sweetshop.com'),
  useMockApi: getEnvVar('EXPO_PUBLIC_USE_MOCK_API', 'false') === 'true',

  // App Configuration
  appScheme: 'wnzee-tii-ndaku',
};

/**
 * Validate configuration on app start
 * Throws error if critical config is missing
 */
export function validateConfig(): void {
  if (!config.googleClientId) {
    throw new Error(
      'Google Client ID not configured. Please set EXPO_PUBLIC_GOOGLE_CLIENT_ID in your .env file'
    );
  }

  if (config.isProduction && config.useMockApi) {
    throw new Error(
      'Production environment cannot use mock API. Set EXPO_PUBLIC_USE_MOCK_API=false'
    );
  }
}
