import React from 'react';
import { View, Text } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <View className="p-4 bg-red-100 rounded-lg">
          <Text className="text-red-700 font-medium">Something went wrong</Text>
          <Text className="text-red-500 text-sm mt-1">
            {this.state.error?.message || "Unknown error"}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;