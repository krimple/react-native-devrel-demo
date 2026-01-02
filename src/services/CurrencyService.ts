/**
 * Currency Service
 * Handles currency-related API calls with telemetry
 */

import { trace, SpanStatusCode } from '@opentelemetry/api';
import { get } from './api';
import type { Currency, ApiResponse } from '../types';

const tracer = trace.getTracer('astronomy-shop-rn');

export class CurrencyService {
  /**
   * Fetch available currencies
   */
  static async fetchCurrencies(
    apiEndpoint: string,
  ): Promise<ApiResponse<Currency[]>> {
    const span = tracer.startSpan('currency.fetch_list');

    try {
      const response = await get<Currency[]>(apiEndpoint, '/currency');

      span.setAttribute('currency.count', response.data?.length || 0);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();

      return response;
    } catch (error: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.recordException(error);
      span.end();
      throw error;
    }
  }
}
