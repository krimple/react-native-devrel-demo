export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:9191'
  : 'https://www.zurelia.honeydemo.io';

export const DEFAULT_CURRENCY = 'USD';

export const STORAGE_KEYS = {
  SELECTED_CURRENCY: 'selectedCurrency',
  CART_ITEMS: 'cartItems',
  USER_PREFERENCES: 'userPreferences',
} as const;

export const TELEMETRY_CONFIG = {
  SERVICE_NAME: 'react-native-otel-demo',
  JAEGER_ENDPOINT: 'http://localhost:14268/api/traces',
  HONEYCOMB_ENDPOINT: 'https://api.honeycomb.io/v1/traces',
} as const;

export const SCREEN_NAMES = {
  HOME: 'Home',
  PRODUCT_LIST: 'ProductList',
  PRODUCT_DETAIL: 'ProductDetail',
  CART: 'Cart',
  CHECKOUT: 'Checkout',
  SETTINGS: 'Settings',
} as const;

export const COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#f59e0b',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  LIGHT: '#f3f4f6',
  DARK: '#1f2937',
  WHITE: '#ffffff',
  BLACK: '#000000',
} as const;

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;