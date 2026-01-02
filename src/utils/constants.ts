export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:9191'
  : 'https://www.zurelia.honeydemo.io';

export const DEFAULT_CURRENCY = 'USD';

export const STORAGE_KEYS = {
  selectedCurrency: '@currency_selected',
  cartItems: '@cart_items',
  userPreferences: '@user_preferences',
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
  primary: '#6366f1',
  primaryLight: '#eef2ff',
  secondary: '#f59e0b',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  background: '#f3f4f6',
  white: '#ffffff',
  black: '#000000',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  disabled: '#d1d5db',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;