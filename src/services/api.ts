/**
 * Base API Client
 * HTTP client with fetch wrapper and OpenTelemetry instrumentation
 */

import { trace, SpanStatusCode, Span } from '@opentelemetry/api';
import type { ApiResponse } from '../types';

const tracer = trace.getTracer('astronomy-shop-rn');

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
 * Base HTTP request with telemetry
 */
export async function apiRequest<T>(
  endpoint: string,
  url: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const span = tracer.startSpan('http.request');
  const startTime = Date.now();

  try {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 30000,
    } = options;

    const fullUrl = `${endpoint}${url}`;

    span.setAttribute('http.method', method);
    span.setAttribute('http.url', fullUrl);
    span.setAttribute('http.timeout', timeout);

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

    const duration = Date.now() - startTime;
    span.setAttribute('http.status_code', response.status);
    span.setAttribute('http.duration_ms', duration);

    if (!response.ok) {
      const errorText = await response.text();
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: `HTTP ${response.status}: ${errorText}`,
      });
      span.end();
      throw new ApiError(response.status, errorText || response.statusText, {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const data = await response.json();
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    span.setAttribute('http.duration_ms', duration);

    if (error.name === 'AbortError') {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: 'Request timeout',
      });
      span.recordException(error);
      span.end();
      throw new ApiError(408, 'Request timeout');
    }

    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
    span.recordException(error);
    span.end();

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
