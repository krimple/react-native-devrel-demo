/**
 * Currency Context
 * Manages currency selection and persistence with telemetry
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import { CurrencyService } from '../services/CurrencyService';
import { Currency } from '../types';
import { DEFAULT_CURRENCY, STORAGE_KEYS } from '../utils/constants';

const tracer = trace.getTracer('astronomy-shop-rn');

interface CurrencyContextType {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  selectCurrency: (currency: Currency) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
  apiEndpoint: string;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
  apiEndpoint,
}) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrencies();
  }, [apiEndpoint]);

  const loadCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch currencies from API
      const response = await CurrencyService.fetchCurrencies(apiEndpoint);
      const currencyList = response.data || [];
      setCurrencies(currencyList);

      // Load saved currency from storage
      const savedCurrencyCode = await AsyncStorage.getItem(
        STORAGE_KEYS.selectedCurrency,
      );

      // Find the saved currency or default to USD
      if (currencyList.length > 0) {
        const currencyCode = savedCurrencyCode || DEFAULT_CURRENCY;
        const currency =
          currencyList.find((c) => c.code === currencyCode) ||
          currencyList.find((c) => c.code === DEFAULT_CURRENCY) ||
          currencyList[0];

        if (currency) {
          setSelectedCurrency(currency);
          // Save to storage only if we have a valid currency code
          if (currency.code && savedCurrencyCode !== currency.code) {
            await AsyncStorage.setItem(STORAGE_KEYS.selectedCurrency, currency.code);
          }
        }
      } else {
        console.warn('No currencies available from API');
        setError('No currencies available');
      }
    } catch (err: any) {
      console.error('Failed to load currencies:', err);
      setError(err.message || 'Failed to load currencies');
    } finally {
      setLoading(false);
    }
  };

  const selectCurrency = async (currency: Currency) => {
    const span = tracer.startSpan('currency.change');
    span.setAttribute('currency.from', selectedCurrency?.code || 'none');
    span.setAttribute('currency.to', currency.code);

    try {
      if (!currency || !currency.code) {
        throw new Error('Invalid currency');
      }

      setSelectedCurrency(currency);
      await AsyncStorage.setItem(STORAGE_KEYS.selectedCurrency, currency.code);

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    } catch (err: any) {
      console.error('Failed to select currency:', err);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      });
      span.recordException(err);
      span.end();
      throw err;
    }
  };

  const value: CurrencyContextType = {
    currencies,
    selectedCurrency,
    selectCurrency,
    loading,
    error,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
