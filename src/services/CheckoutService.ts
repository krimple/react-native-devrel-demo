/**
 * Checkout Service
 * Handles checkout and order-related API calls with telemetry
 */

import { trace, SpanStatusCode } from '@opentelemetry/api';
import { post } from './api';
import type { Order, CartItem, ShippingAddress, ApiResponse } from '../types';
import { DEFAULT_CURRENCY } from '../utils/constants';

const tracer = trace.getTracer('astronomy-shop-rn');

export class CheckoutService {
  /**
   * Submit an order
   */
  static async submitOrder(
    apiEndpoint: string,
    items: CartItem[],
    shippingAddress: ShippingAddress,
    total: number,
    currencyCode: string = DEFAULT_CURRENCY,
  ): Promise<ApiResponse<Order>> {
    const span = tracer.startSpan('checkout.submit');
    span.setAttribute('checkout.total', total);
    span.setAttribute('checkout.currency', currencyCode);
    span.setAttribute('checkout.item_count', items.length);

    try {
      const response = await post<Order>(
        apiEndpoint,
        `/checkout?currencyCode=${currencyCode}`,
        {
          items,
          shippingAddress,
          total,
        },
      );

      span.setAttribute('checkout.order_id', response.data?.id || 'unknown');
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
