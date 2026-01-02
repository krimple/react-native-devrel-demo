/**
 * CurrencyService Tests
 */

import { CurrencyService } from '../CurrencyService';
import * as api from '../api';
import { Currency } from '../../types';
import { createMockTracer } from '../../testing/telemetry';
import { trace } from '@opentelemetry/api';

jest.mock('../api');
jest.mock('@opentelemetry/api');

const mockApiEndpoint = 'https://test.example.com/api';

const mockCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
];

describe('CurrencyService', () => {
  let mockTracer: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTracer = createMockTracer();
    (trace.getTracer as jest.Mock).mockReturnValue(mockTracer);
  });

  describe('fetchCurrencies', () => {
    it('should fetch currency list successfully', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCurrencies,
      });

      const result = await CurrencyService.fetchCurrencies(mockApiEndpoint);

      expect(api.get).toHaveBeenCalledWith(
        mockApiEndpoint,
        '/currency',
        undefined,
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCurrencies);
      expect(mockTracer.hasSpan('currency.fetch_list')).toBe(true);
    });

    it('should handle network errors', async () => {
      const error = new api.ApiError(0, 'Network error');
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(
        CurrencyService.fetchCurrencies(mockApiEndpoint),
      ).rejects.toThrow('Network error');

      const span = mockTracer.getSpanByName('currency.fetch_list');
      expect(span?.exception).toBeDefined();
    });

    it('should add currency count to span attributes', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        success: true,
        data: mockCurrencies,
      });

      await CurrencyService.fetchCurrencies(mockApiEndpoint);

      const span = mockTracer.getSpanByName('currency.fetch_list');
      expect(span?.attributes['currency.count']).toBe(3);
    });
  });
});
