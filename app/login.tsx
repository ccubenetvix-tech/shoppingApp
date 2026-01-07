/**
 * Login Screen
 * Handles email/password and Google OAuth authentication
 * SECURITY: All secrets come from environment variables
 */

import { APP_CONSTANTS, OAUTH_CONFIG } from '@/config/constants';
import { config } from '@/config/env';
import { Colors } from '@/constants/Colors';
import { useApp } from '@/contexts/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { apiClient } from '@/lib/api-client';
import { SecureStorage } from '@/lib/storage';
import { Ionicons } from '@expo/vector-icons';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; phone?: string }>({});

  // Google OAuth configuration - SECURITY: Client ID from environment
  const redirectUri = makeRedirectUri({
    scheme: config.appScheme,
    path: OAUTH_CONFIG.REDIRECT_PATH,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: config.googleClientId,
    redirectUri: redirectUri,
    scopes: [...OAUTH_CONFIG.SCOPES],
  });

  // Handle Google OAuth response
  useEffect(() => {
    handleGoogleResponse();
  }, [response]);

  const handleGoogleResponse = async () => {
    if (response?.type === 'success') {
      const { authentication } = response;
      setGoogleLoading(true);
      
      try {
        const result = await apiClient.googleSignIn(authentication?.accessToken || '');
        
        // Store token securely
        await SecureStorage.setAuthToken(result.token);
        
        // Update app context with user data
        await login(result.user);
        
        // Navigate to main app
        router.replace('/(tabs)');
      } catch (error: any) {
        // SECURITY: Don't expose internal error details to users
        const errorMessage = config.isDevelopment 
          ? error.message 
          : 'Failed to sign in with Google. Please try again.';
          
        Alert.alert('Google Sign-In Error', errorMessage);
      } finally {
        setGoogleLoading(false);
      }
    } else if (response?.type === 'error') {
      Alert.alert(
        'Authentication Failed',
        'Google Sign-In failed. Please try again.'
      );
    }
    // Silently handle cancel - no alert needed
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to initiate Google Sign-In');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string; phone?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < APP_CONSTANTS.MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${APP_CONSTANTS.MIN_PASSWORD_LENGTH} characters`;
    }

    if (!isLogin) {
      if (!name) {
        newErrors.name = 'Name is required';
      }
      if (!phone) {
        newErrors.phone = 'Phone is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = isLogin
        ? await apiClient.login(email, password)
        : await apiClient.register({ name, email, password, phone });

      // Store token securely
      await SecureStorage.setAuthToken(response.token);
      
      // Update app context with user data
      await login(response.user);

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error: any) {
      // SECURITY: Don't expose internal error details in production
      const errorMessage = config.isDevelopment
        ? error.message
        : `Failed to ${isLogin ? 'login' : 'sign up'}. Please try again.`;
        
      Alert.alert('Authentication Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>  
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.primary }]}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        
        {!isLogin && (
          <>
            <TextInput
              style={[styles.input, { borderColor: errors.name ? '#EF4444' : colors.primary }]}
              placeholder="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors({ ...errors, name: undefined });
              }}
              autoCapitalize="words"
              editable={!loading}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </>
        )}
        
        <TextInput
          style={[styles.input, { borderColor: errors.email ? '#EF4444' : colors.primary }]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors({ ...errors, email: undefined });
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        
        {!isLogin && (
          <>
            <TextInput
              style={[styles.input, { borderColor: errors.phone ? '#EF4444' : colors.primary }]}
              placeholder="Phone Number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setErrors({ ...errors, phone: undefined });
              }}
              keyboardType="phone-pad"
              editable={!loading}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </>
        )}
        
        <TextInput
          style={[styles.input, { borderColor: errors.password ? '#EF4444' : colors.primary }]}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: undefined });
          }}
          secureTextEntry
          editable={!loading}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]} 
          onPress={handleSubmit}
          disabled={loading || googleLoading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          )}
        </TouchableOpacity>
        
        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>
        
        {/* Google Sign-In Button */}
        <TouchableOpacity 
          style={[styles.googleButton, { borderColor: colors.border }]} 
          onPress={handleGoogleSignIn}
          disabled={loading || googleLoading || !request}
        >
          {googleLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <Text style={[styles.googleButtonText, { color: colors.text }]}>
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => {
          setIsLogin(!isLogin);
          setErrors({});
        }} disabled={loading || googleLoading}>
          <Text style={[styles.switchText, { color: colors.secondary }]}>  
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});
