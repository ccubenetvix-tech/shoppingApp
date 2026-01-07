/**
 * Secure Storage Utility
 * Abstracts storage implementation for better security and flexibility
 * 
 * SECURITY NOTE: Currently uses AsyncStorage for development.
 * For production, consider migrating sensitive data to expo-secure-store:
 * - Auth tokens
 * - User credentials
 * - Payment information
 */

import { STORAGE_KEYS } from '@/config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class SecureStorage {
  /**
   * Store a value securely
   * @param key - Storage key
   * @param value - Value to store
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      throw new Error(`Failed to store ${key}`);
    }
  }

  /**
   * Retrieve a value
   * @param key - Storage key
   * @returns Stored value or null
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  /**
   * Remove a value
   * @param key - Storage key
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Store an object as JSON
   * @param key - Storage key
   * @param value - Object to store
   */
  static async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      throw new Error(`Failed to store object ${key}`);
    }
  }

  /**
   * Retrieve an object from JSON
   * @param key - Storage key
   * @returns Parsed object or null
   */
  static async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear all storage (use with caution)
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      // Silent fail
    }
  }

  // Auth-specific helpers
  static async setAuthToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static async getAuthToken(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  static async removeAuthToken(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  static async setUserData<T>(userData: T): Promise<void> {
    await this.setObject(STORAGE_KEYS.USER_DATA, userData);
  }

  static async getUserData<T>(): Promise<T | null> {
    return this.getObject<T>(STORAGE_KEYS.USER_DATA);
  }

  static async removeUserData(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Clear all auth-related data
   */
  static async clearAuth(): Promise<void> {
    await this.removeAuthToken();
    await this.removeUserData();
  }
}

/**
 * TODO for Production:
 * 1. Install expo-secure-store: npx expo install expo-secure-store
 * 2. Replace AsyncStorage with SecureStore for sensitive data:
 *    - Auth tokens
 *    - User credentials
 * 3. Keep AsyncStorage for non-sensitive data like preferences
 * 
 * Example migration:
 * ```typescript
 * import * as SecureStore from 'expo-secure-store';
 * 
 * static async setAuthToken(token: string): Promise<void> {
 *   await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
 * }
 * ```
 */
