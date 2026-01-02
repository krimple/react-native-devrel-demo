/**
 * CheckoutService Tests
 */

import { CheckoutService } from '../CheckoutService';
import * as api from '../api';
import { Order, CartItem, ShippingAddress } from '../../types';
import { createMockTracer } from '../../testing/telemetry';
import { trace } from '@opentelemetry/api';

jest.mock('../api');
jest.mock('@opentelemetry/api');

const mockApiEndpoint = 'https://test.example.com/api';

const mockShippingAddress: ShippingAddress = {
  street: '123 Main St',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94102',
  country: 'USA',
};

const mockCartItems: CartItem[] = [
  {
    productId: '1',
    quantity: 2,
    product: {
      id: '1',
      name: 'Telescope',
      description: 'A great telescope',
      price: 299.99,
      currencyCode: 'USD',
      picture: 'telescope.jpg',
      category: 'Telescopes',
      rating: 4.5,
      reviewCount: 10,
      inStock: true,
    },
  },
];

const mockOrder: Order = {
  id: 'order-123',
  items: mockCartItems,
  total: 599.98,
  shippingCost: 9.99,
  currencyCode: 'USD',
  shippingAddress: mockShippingAddress,
  status: 'pending',
};

describe('CheckoutService', () => {
  let mockTracer: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTracer = createMockTracer();
    (trace.getTracer as jest.Mock).mockReturnValue(mockTracer);
  });

  describe('submitOrder', () => {
    it('should submit order successfully', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        success: true,
        data: mockOrder,
      });

      const result = await CheckoutService.submitOrder(
        mockApiEndpoint,
        mockCartItems,
        mockShippingAddress,
        599.98,
        'USD',
      );

      expect(api.post).toHaveBeenCalledWith(
        mockApiEndpoint,
        '/checkout?currencyCode=USD',
        {
          items: mockCartItems,
          shippingAddress: mockShippingAddress,
          total: 599.98,
        },
        undefined,
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockOrder);
      expect(mockTracer.hasSpan('checkout.submit')).toBe(true);
    });

    it('should handle validation errors', async () => {
      const error = new api.ApiError(400, 'Invalid shipping address');
      (api.post as jest.Mock).mockRejectedValue(error);

      await expect(
        CheckoutService.submitOrder(
          mockApiEndpoint,
          mockCartItems,
          mockShippingAddress,
          599.98,
          'USD',
        ),
      ).rejects.toThrow('Invalid shipping address');

      const span = mockTracer.getSpanByName('checkout.submit');
      expect(span?.exception).toBeDefined();
    });

    it('should add order details to span attributes', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        success: true,
        data: mockOrder,
      });

      await CheckoutService.submitOrder(
        mockApiEndpoint,
        mockCartItems,
        mockShippingAddress,
        599.98,
        'USD',
      );

      const span = mockTracer.getSpanByName('checkout.submit');
      expect(span?.attributes['checkout.total']).toBe(599.98);
      expect(span?.attributes['checkout.currency']).toBe('USD');
      expect(span?.attributes['checkout.item_count']).toBe(1);
      expect(span?.attributes['checkout.order_id']).toBe('order-123');
    });

    it('should use default currency if not provided', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        success: true,
        data: mockOrder,
      });

      await CheckoutService.submitOrder(
        mockApiEndpoint,
        mockCartItems,
        mockShippingAddress,
        599.98,
      );

      expect(api.post).toHaveBeenCalledWith(
        mockApiEndpoint,
        '/checkout?currencyCode=USD',
        expect.any(Object),
        undefined,
      );
    });
  });
});
