/**
 * Navigation Types
 * Type definitions for navigation stack
 */

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  ProductList: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  CheckoutSuccess: { orderId: string };
};
