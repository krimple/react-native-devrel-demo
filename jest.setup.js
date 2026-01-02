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

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

// Mock Honeycomb SDK
jest.mock('@honeycombio/opentelemetry-react-native', () => ({
  HoneycombReactNativeSDK: jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue(undefined),
    shutdown: jest.fn().mockResolvedValue(undefined),
  })),
}));

// Mock DiagLogLevel
jest.mock('@opentelemetry/api', () => {
  const actual = jest.requireActual('@opentelemetry/api');
  return {
    ...actual,
    DiagLogLevel: {
      NONE: 0,
      ERROR: 30,
      WARN: 50,
      INFO: 60,
      DEBUG: 70,
      VERBOSE: 80,
      ALL: 9999,
    },
    trace: {
      getTracer: jest.fn().mockReturnValue({
        startSpan: jest.fn().mockReturnValue({
          setAttribute: jest.fn(),
          setAttributes: jest.fn(),
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
    context: {
      active: jest.fn(),
      with: jest.fn((ctx, fn) => fn()),
    },
    propagation: {
      inject: jest.fn(),
      extract: jest.fn(),
    },
  };
});

// Silence console.log during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};