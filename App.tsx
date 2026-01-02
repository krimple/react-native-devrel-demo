/**
 * React Native OpenTelemetry Demo App
 * Astronomy Shop with Honeycomb Telemetry
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { HoneycombReactNativeSDK } from '@honeycombio/opentelemetry-react-native';
import { DiagLogLevel } from '@opentelemetry/api';
import { ConfigProvider, useConfig } from './src/context/ConfigContext';
import { AppNavigator } from './src/navigation/AppNavigator';

/**
 * Inner App Component
 * Handles SDK initialization with configured endpoints
 */
function AppContent() {
  const { otelEndpoint, isLoading } = useConfig();
  const [sdk, setSdk] = useState<HoneycombReactNativeSDK | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Initialize SDK with configured endpoint
    const honeycombSDK = new HoneycombReactNativeSDK({
      endpoint: otelEndpoint,
      serviceName: 'astronomy-shop-rn',
      logLevel: DiagLogLevel.DEBUG,
    });
    honeycombSDK.start();
    setSdk(honeycombSDK);

    console.log('Honeycomb SDK initialized with endpoint:', otelEndpoint);

    // Cleanup on unmount
    return () => {
      honeycombSDK.shutdown();
    };
  }, [otelEndpoint, isLoading]);

  // Show loading screen while configuration is being loaded
  if (isLoading || !sdk) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#841584" />
      </View>
    );
  }

  return <AppNavigator sdk={sdk} />;
}

/**
 * Root App Component
 * Wraps app with ConfigProvider
 */
export default function App() {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
