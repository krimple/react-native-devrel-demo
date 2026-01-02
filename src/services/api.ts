/**
 * Base API Client
 * HTTP client with fetch wrapper
 * Telemetry handled automatically by HoneycombReactNativeSDK
 */

import type { ApiResponse } from '../types';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public response?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base HTTP request
 * Fetch auto-instrumented by Honeycomb SDK
 */
export async function apiRequest<T>(
  endpoint: string,
  url: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  try {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 30000,
    } = options;

    const fullUrl = `${endpoint}${url}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const response = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || response.statusText, {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout');
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(0, error.message || 'Network error');
  }
}

/**
 * GET request helper
 */
export async function get<T>(
  endpoint: string,
  url: string,
  options?: Omit<RequestOptions, 'method' | 'body'>,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, url, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function post<T>(
  endpoint: string,
  url: string,
  body: any,
  options?: Omit<RequestOptions, 'method' | 'body'>,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, url, { ...options, method: 'POST', body });
}
