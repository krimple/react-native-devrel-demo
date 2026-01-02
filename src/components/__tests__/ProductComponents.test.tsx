/**
 * Product Components Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ProductCard } from '../ProductCard';
import { QuantitySelector } from '../QuantitySelector';
import { CartItem } from '../CartItem';
import { Product } from '../../types';

const mockProduct: Product = {
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
};

describe('ProductCard', () => {
  it('renders product info', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={mockPress} />,
    );
    expect(getByText('Telescope')).toBeDefined();
    expect(getByText('USD 299.99')).toBeDefined();
  });

  it('calls onPress when tapped', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={mockPress} />,
    );
    fireEvent.press(getByText('Telescope'));
    expect(mockPress).toHaveBeenCalled();
  });
});

describe('QuantitySelector', () => {
  it('increments quantity', () => {
    const mockIncrement = jest.fn();
    const mockDecrement = jest.fn();
    const { getByText } = render(
      <QuantitySelector
        quantity={1}
        onIncrement={mockIncrement}
        onDecrement={mockDecrement}
      />,
    );
    fireEvent.press(getByText('+'));
    expect(mockIncrement).toHaveBeenCalled();
  });

  it('decrements quantity', () => {
    const mockIncrement = jest.fn();
    const mockDecrement = jest.fn();
    const { getByText } = render(
      <QuantitySelector
        quantity={2}
        onIncrement={mockIncrement}
        onDecrement={mockDecrement}
      />,
    );
    fireEvent.press(getByText('−'));
    expect(mockDecrement).toHaveBeenCalled();
  });
});

describe('CartItem', () => {
  const mockCartItem = {
    productId: '1',
    quantity: 2,
    product: mockProduct,
  };

  it('renders cart item details', () => {
    const mockUpdate = jest.fn();
    const mockRemove = jest.fn();
    const { getByText } = render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdate}
        onRemove={mockRemove}
      />,
    );
    expect(getByText('Telescope')).toBeDefined();
    expect(getByText('USD 299.99 each')).toBeDefined();
    expect(getByText('USD 599.98')).toBeDefined();
  });
});
