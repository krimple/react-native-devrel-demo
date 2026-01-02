/**
 * Product Service
 * Handles product-related API calls with telemetry
 */

import { trace, SpanStatusCode } from '@opentelemetry/api';
import { get } from './api';
import type { Product, ApiResponse } from '../types';
import { DEFAULT_CURRENCY } from '../utils/constants';

const tracer = trace.getTracer('astronomy-shop-rn');

export class ProductService {
  /**
   * Fetch all products
   */
  static async fetchProducts(
    apiEndpoint: string,
    currencyCode: string = DEFAULT_CURRENCY,
  ): Promise<ApiResponse<Product[]>> {
    const span = tracer.startSpan('product.fetch_list');
    span.setAttribute('product.currency', currencyCode);

    try {
      const response = await get<any>(
        apiEndpoint,
        `/products?currencyCode=${currencyCode}`,
      );

      // Transform API response to match our Product type
      const transformedData: Product[] = (response.data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        // Convert priceUsd object to simple number: units + (nanos / 1000000000)
        price: (item.priceUsd?.units || 0) + (item.priceUsd?.nanos || 0) / 1000000000,
        currencyCode: item.priceUsd?.currencyCode || currencyCode,
        picture: item.picture,
        category: item.categories?.[0] || 'general',
        // These fields don't exist in API - using defaults
        rating: 4.5,
        reviewCount: 0,
        inStock: true,
      }));

      span.setAttribute('product.count', transformedData.length);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();

      return { success: true, data: transformedData };
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

  /**
   * Fetch a single product by ID
   */
  static async fetchProductById(
    apiEndpoint: string,
    productId: string,
    currencyCode: string = DEFAULT_CURRENCY,
  ): Promise<ApiResponse<Product>> {
    const span = tracer.startSpan('product.fetch_detail');
    span.setAttribute('product.id', productId);
    span.setAttribute('product.currency', currencyCode);

    try {
      const response = await get<any>(
        apiEndpoint,
        `/products/${productId}?currencyCode=${currencyCode}`,
      );

      // Transform single product response
      const item = response.data;
      const transformedData: Product = {
        id: item.id,
        name: item.name,
        description: item.description,
        price: (item.priceUsd?.units || 0) + (item.priceUsd?.nanos || 0) / 1000000000,
        currencyCode: item.priceUsd?.currencyCode || currencyCode,
        picture: item.picture,
        category: item.categories?.[0] || 'general',
        rating: 4.5,
        reviewCount: 0,
        inStock: true,
      };

      span.setAttribute('product.name', transformedData.name);
      span.setAttribute('product.price', transformedData.price);
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();

      return { success: true, data: transformedData };
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
