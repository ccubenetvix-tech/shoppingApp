/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app
 */

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console (in production, send to error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error reporting service (Sentry, Bugsnag, etc.)
    // reportErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <ThemedView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <ThemedText type="title" style={styles.title}>
              Oops! Something went wrong
            </ThemedText>
            
            <ThemedText style={styles.message}>
              We're sorry for the inconvenience. The app encountered an unexpected error.
            </ThemedText>

            {__DEV__ && this.state.error && (
              <>
                <ThemedText type="subtitle" style={styles.errorTitle}>
                  Error Details (Development Only):
                </ThemedText>
                <ThemedView style={styles.errorBox}>
                  <ThemedText style={styles.errorText}>
                    {this.state.error.toString()}
                  </ThemedText>
                  {this.state.errorInfo && (
                    <ThemedText style={styles.errorStack}>
                      {this.state.errorInfo.componentStack}
                    </ThemedText>
                  )}
                </ThemedView>
              </>
            )}

            <TouchableOpacity style={styles.button} onPress={this.resetError}>
              <ThemedText style={styles.buttonText}>Try Again</ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </ThemedView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 16,
  },
  errorTitle: {
    marginTop: 20,
    marginBottom: 8,
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
    marginBottom: 20,
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#721c24',
  },
  errorStack: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#721c24',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
