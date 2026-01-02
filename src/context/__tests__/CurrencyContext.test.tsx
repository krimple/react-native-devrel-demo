/**
 * CurrencyContext Tests
 */

import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { CurrencyProvider, useCurrency } from '../CurrencyContext';
import { CurrencyService } from '../../services/CurrencyService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../../services/CurrencyService');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('@opentelemetry/api');

const mockCurrencies: any[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
];

const TestComponent = () => {
  const { selectedCurrency, currencies, loading } = useCurrency();
  return (
    <>
      <Text testID="currency">{selectedCurrency?.code || 'none'}</Text>
      <Text testID="count">{currencies.length}</Text>
      <Text testID="loading">{loading ? 'true' : 'false'}</Text>
    </>
  );
};

describe('CurrencyContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should load currencies from API', async () => {
    (CurrencyService.fetchCurrencies as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCurrencies,
    });

    const { getByTestID } = render(
      <CurrencyProvider apiEndpoint="https://test.com/api">
        <TestComponent />
      </CurrencyProvider>,
    );

    await waitFor(() => {
      expect(getByTestID('loading').props.children).toBe('false');
    });

    expect(getByTestID('count').props.children).toBe(2);
  });

  it('should default to USD', async () => {
    (CurrencyService.fetchCurrencies as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCurrencies,
    });

    const { getByTestID } = render(
      <CurrencyProvider apiEndpoint="https://test.com/api">
        <TestComponent />
      </CurrencyProvider>,
    );

    await waitFor(() => {
      expect(getByTestID('currency').props.children).toBe('USD');
    });
  });

  it('should persist selected currency to AsyncStorage', async () => {
    (CurrencyService.fetchCurrencies as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCurrencies,
    });

    const { getByTestID } = render(
      <CurrencyProvider apiEndpoint="https://test.com/api">
        <TestComponent />
      </CurrencyProvider>,
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@currency_selected',
        'USD',
      );
    });
  });
});
