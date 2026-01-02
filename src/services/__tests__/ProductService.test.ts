/**
 * ProductService Tests
 */

import { ProductService } from '../ProductService';
import * as api from '../api';
import { Product } from '../../types';
import { createMockTracer, verifySpanCreated } from '../../testing/telemetry';
import { trace } from '@opentelemetry/api';

jest.mock('../api');
jest.mock('@opentelemetry/api');

const mockApiEndpoint = 'https://test.example.com/api';

// API response format (before transformation)
const mockApiProducts = [
  {
    id: '1',
    name: 'Telescope',
    description: 'A great telescope',
    priceUsd: {
      units: 299,
      nanos: 990000000,
      currencyCode: 'USD',
    },
    picture: 'telescope.jpg',
    categories: ['Telescopes'],
  },
];

const mockApiProduct = mockApiProducts[0];

// Expected transformed Product format
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Telescope',
    description: 'A great telescope',
    price: 299.99,
    currencyCode: 'USD',
    picture: 'telescope.jpg',
    category: 'Telescopes',
    rating: 4.5,
    reviewCount: 0,
    inStock: true,
  },
];

const mockProduct: Product = mockProducts[0];

describe('ProductService', () => {
  let mockTracer: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTracer = createMockTracer();
    (trace.getTracer as jest.Mock).mockReturnValue(mockTracer);
  });

  describe('fetchProducts', () => {
    it('should fetch product list with currency code', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        success: true,
        data: mockApiProducts,
      });

      const result = await ProductService.fetchProducts(mockApiEndpoint, 'USD');

      expect(api.get).toHaveBeenCalledWith(
        mockApiEndpoint,
        '/products?currencyCode=USD',
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProducts);
      expect(mockTracer.hasSpan('product.fetch_list')).toBe(true);
    });

    it('should handle API errors gracefully', async () => {
      const error = new api.ApiError(500, 'Server error');
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(
        ProductService.fetchProducts(mockApiEndpoint, 'USD'),
      ).rejects.toThrow('Server error');

      const span = mockTracer.getSpanByName('product.fetch_list');
      expect(span?.exception).toBeDefined();
    });

    it('should use default currency if not provided', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        success: true,
        data: mockApiProducts,
      });

      await ProductService.fetchProducts(mockApiEndpoint);

      expect(api.get).toHaveBeenCalledWith(
        mockApiEndpoint,
        '/products?currencyCode=USD',
      );
    });
  });

  describe('fetchProductById', () => {
    it('should fetch single product by ID', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        success: true,
        data: mockApiProduct,
      });

      const result = await ProductService.fetchProductById(
        mockApiEndpoint,
        '1',
        'USD',
      );

      expect(api.get).toHaveBeenCalledWith(
        mockApiEndpoint,
        '/products/1?currencyCode=USD',
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProduct);
      expect(mockTracer.hasSpan('product.fetch_detail')).toBe(true);
    });

    it('should handle product not found', async () => {
      const error = new api.ApiError(404, 'Product not found');
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(
        ProductService.fetchProductById(mockApiEndpoint, '999', 'USD'),
      ).rejects.toThrow('Product not found');
    });

    it('should add product ID to span attributes', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        success: true,
        data: mockApiProduct,
      });

      await ProductService.fetchProductById(mockApiEndpoint, '1', 'USD');

      const span = mockTracer.getSpanByName('product.fetch_detail');
      expect(span?.attributes['product.id']).toBe('1');
      expect(span?.attributes['product.currency']).toBe('USD');
    });
  });
});
