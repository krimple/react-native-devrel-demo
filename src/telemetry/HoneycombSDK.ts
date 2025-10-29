import { HoneycombReactNativeSDK } from '@honeycombio/opentelemetry-react-native';
import {
  HONEYCOMB_API_KEY,
  OTEL_SERVICE_NAME,
  ENABLE_TELEMETRY,
  DEBUG_MODE,
} from '@env';

/**
 * Honeycomb OpenTelemetry SDK instance
 */
let honeycombSDK: HoneycombReactNativeSDK | null = null;

/**
 * Initialize the Honeycomb OpenTelemetry SDK
 * @returns Promise that resolves when SDK is initialized
 */
export const initializeHoneycombSDK = async (): Promise<void> => {
  // Skip initialization if telemetry is disabled
  if (ENABLE_TELEMETRY === 'false') {
    console.log('Telemetry disabled, skipping Honeycomb SDK initialization');
    return;
  }

  // Skip if already initialized
  if (honeycombSDK) {
    console.log('Honeycomb SDK already initialized');
    return;
  }

  try {
    // Validate required configuration
    if (!HONEYCOMB_API_KEY) {
      throw new Error('HONEYCOMB_API_KEY is required but not provided');
    }

    if (!OTEL_SERVICE_NAME) {
      throw new Error('OTEL_SERVICE_NAME is required but not provided');
    }

    // Initialize the SDK
    honeycombSDK = new HoneycombReactNativeSDK({
      apiKey: HONEYCOMB_API_KEY,
      serviceName: OTEL_SERVICE_NAME,
      debug: true || DEBUG_MODE === 'true',
      instrumentations: [
        // Automatic instrumentations will be configured separately
      ],
    });

    // Start the SDK
    await honeycombSDK.start();

    console.log(`Honeycomb SDK initialized successfully for service: ${OTEL_SERVICE_NAME}`);
  } catch (error) {
    console.error('Failed to initialize Honeycomb SDK:', error);
    throw error;
  }
};

/**
 * Get the current Honeycomb SDK instance
 * @returns The SDK instance or null if not initialized
 */
export const getHoneycombSDK = (): HoneycombReactNativeSDK | null => {
  return honeycombSDK;
};

/**
 * Shutdown the Honeycomb SDK
 * @returns Promise that resolves when SDK is shut down
 */
export const shutdownHoneycombSDK = async (): Promise<void> => {
  if (honeycombSDK) {
    try {
      await honeycombSDK.shutdown();
      honeycombSDK = null;
      console.log('Honeycomb SDK shut down successfully');
    } catch (error) {
      console.error('Failed to shutdown Honeycomb SDK:', error);
      throw error;
    }
  }
};

/**
 * Check if the SDK is initialized
 * @returns True if SDK is initialized
 */
export const isHoneycombSDKInitialized = (): boolean => {
  return honeycombSDK !== null;
};