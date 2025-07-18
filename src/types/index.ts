export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currencyCode: string;
  picture: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  currencyCode: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shippingCost: number;
  currencyCode: string;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface TelemetryEvent {
  name: string;
  attributes: Record<string, any>;
  timestamp: number;
}