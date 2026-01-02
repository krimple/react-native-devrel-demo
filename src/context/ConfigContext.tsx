/**
 * Configuration Context
 * Manages API and OpenTelemetry endpoint configuration with AsyncStorage persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_API_ENDPOINT = '@config_api_endpoint';
const STORAGE_KEY_OTEL_ENDPOINT = '@config_otel_endpoint';

const DEFAULT_API_ENDPOINT = 'https://kenrimple-local.zurelia.honeydemo.io/api';
const DEFAULT_OTEL_ENDPOINT = 'https://kenrimple-local.zurelia.honeydemo.io/otlp-http/v1/traces';

interface ConfigContextType {
  apiEndpoint: string;
  otelEndpoint: string;
  setApiEndpoint: (endpoint: string) => Promise<void>;
  setOtelEndpoint: (endpoint: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [apiEndpoint, setApiEndpointState] = useState<string>(DEFAULT_API_ENDPOINT);
  const [otelEndpoint, setOtelEndpointState] = useState<string>(DEFAULT_OTEL_ENDPOINT);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedApiEndpoint = await AsyncStorage.getItem(STORAGE_KEY_API_ENDPOINT);
        const savedOtelEndpoint = await AsyncStorage.getItem(STORAGE_KEY_OTEL_ENDPOINT);

        if (savedApiEndpoint) {
          setApiEndpointState(savedApiEndpoint);
        }
        if (savedOtelEndpoint) {
          setOtelEndpointState(savedOtelEndpoint);
        }
      } catch (error) {
        console.error('Failed to load configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const setApiEndpoint = async (endpoint: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_API_ENDPOINT, endpoint);
      setApiEndpointState(endpoint);
    } catch (error) {
      console.error('Failed to save API endpoint:', error);
      throw error;
    }
  };

  const setOtelEndpoint = async (endpoint: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_OTEL_ENDPOINT, endpoint);
      setOtelEndpointState(endpoint);
    } catch (error) {
      console.error('Failed to save OTEL endpoint:', error);
      throw error;
    }
  };

  const resetToDefaults = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY_API_ENDPOINT, STORAGE_KEY_OTEL_ENDPOINT]);
      setApiEndpointState(DEFAULT_API_ENDPOINT);
      setOtelEndpointState(DEFAULT_OTEL_ENDPOINT);
    } catch (error) {
      console.error('Failed to reset configuration:', error);
      throw error;
    }
  };

  const value: ConfigContextType = {
    apiEndpoint,
    otelEndpoint,
    setApiEndpoint,
    setOtelEndpoint,
    resetToDefaults,
    isLoading,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export { DEFAULT_API_ENDPOINT, DEFAULT_OTEL_ENDPOINT };
