// Jest setup file

// Mock react-native-dotenv
jest.mock('@env', () => ({
  HONEYCOMB_API_KEY: 'test-api-key',
  OTEL_SERVICE_NAME: 'test-service',
  OTEL_RESOURCE_ATTRIBUTES: 'service.name=test-service',
  API_BASE_URL: 'http://localhost:9191',
  ENABLE_TELEMETRY: 'true',
  DEBUG_MODE: 'true',
  LOG_LEVEL: 'debug',
  JAEGER_ENDPOINT: 'http://localhost:14268/api/traces',
  JAEGER_ENABLED: 'true',
}));

// Mock Honeycomb SDK
jest.mock('@honeycombio/opentelemetry-react-native', () => ({
  HoneycombReactNativeSDK: jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue(undefined),
    shutdown: jest.fn().mockResolvedValue(undefined),
  })),
}));

// Mock OpenTelemetry API
jest.mock('@opentelemetry/api', () => ({
  trace: {
    getTracer: jest.fn().mockReturnValue({
      startSpan: jest.fn().mockReturnValue({
        setStatus: jest.fn(),
        end: jest.fn(),
        addEvent: jest.fn(),
        recordException: jest.fn(),
      }),
    }),
  },
  SpanStatusCode: {
    OK: 1,
    ERROR: 2,
  },
}));

// Silence console.log during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};