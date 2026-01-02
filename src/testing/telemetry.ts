/**
 * Telemetry Test Helpers
 * Mock utilities for testing OpenTelemetry instrumentation
 */

import { Span, SpanStatusCode, Tracer } from '@opentelemetry/api';

export interface MockSpan {
  name: string;
  attributes: Record<string, any>;
  status?: { code: SpanStatusCode; message?: string };
  exception?: Error;
  ended: boolean;
}

export class MockSpanImpl implements Partial<Span> {
  public name: string;
  public attributes: Record<string, any> = {};
  public status?: { code: SpanStatusCode; message?: string };
  public exception?: Error;
  public ended = false;

  constructor(name: string) {
    this.name = name;
  }

  setAttribute(key: string, value: any): this {
    this.attributes[key] = value;
    return this;
  }

  setAttributes(attributes: Record<string, any>): this {
    Object.assign(this.attributes, attributes);
    return this;
  }

  setStatus(status: { code: SpanStatusCode; message?: string }): this {
    this.status = status;
    return this;
  }

  recordException(exception: Error): void {
    this.exception = exception;
  }

  end(): void {
    this.ended = true;
  }
}

export class MockTracer {
  public spans: MockSpan[] = [];

  startSpan(name: string): MockSpanImpl {
    const span = new MockSpanImpl(name);
    this.spans.push(span);
    return span;
  }

  getSpans(): MockSpan[] {
    return this.spans;
  }

  getSpanByName(name: string): MockSpan | undefined {
    return this.spans.find((span) => span.name === name);
  }

  clearSpans(): void {
    this.spans = [];
  }

  hasSpan(name: string): boolean {
    return this.spans.some((span) => span.name === name);
  }

  getSpanCount(): number {
    return this.spans.length;
  }
}

/**
 * Create a mock tracer for testing
 */
export const createMockTracer = (): MockTracer => {
  return new MockTracer();
};

/**
 * Verify a span was created with the expected name
 */
export const verifySpanCreated = (tracer: MockTracer, spanName: string): void => {
  expect(tracer.hasSpan(spanName)).toBe(true);
};

/**
 * Verify a span has the expected attributes
 */
export const verifySpanAttributes = (
  tracer: MockTracer,
  spanName: string,
  expectedAttributes: Record<string, any>,
): void => {
  const span = tracer.getSpanByName(spanName);
  expect(span).toBeDefined();
  expect(span!.attributes).toMatchObject(expectedAttributes);
};

/**
 * Verify a span has the expected status
 */
export const verifySpanStatus = (
  tracer: MockTracer,
  spanName: string,
  expectedStatus: SpanStatusCode,
): void => {
  const span = tracer.getSpanByName(spanName);
  expect(span).toBeDefined();
  expect(span!.status?.code).toBe(expectedStatus);
};

/**
 * Verify a span recorded an exception
 */
export const verifySpanException = (
  tracer: MockTracer,
  spanName: string,
): void => {
  const span = tracer.getSpanByName(spanName);
  expect(span).toBeDefined();
  expect(span!.exception).toBeDefined();
};

/**
 * Verify a span was ended
 */
export const verifySpanEnded = (tracer: MockTracer, spanName: string): void => {
  const span = tracer.getSpanByName(spanName);
  expect(span).toBeDefined();
  expect(span!.ended).toBe(true);
};

/**
 * Mock trace module for jest
 */
export const mockTraceModule = (mockTracer: MockTracer) => {
  return {
    getTracer: jest.fn().mockReturnValue(mockTracer),
  };
};
