/**
 * CartContext Tests
 */

import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { CartProvider, useCart } from '../CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../../types';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('@opentelemetry/api');

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

const TestComponent = () => {
  const { cart, addItem, removeItem, updateQuantity, clearCart, total } = useCart();
  return (
    <>
      <Text testID="count">{cart.items.length}</Text>
      <Text testID="total">{total}</Text>
      <Button title="Add" onPress={() => addItem(mockProduct, 2)} />
      <Button title="Remove" onPress={() => removeItem('1')} />
      <Button title="Update" onPress={() => updateQuantity('1', 5)} />
      <Button title="Clear" onPress={clearCart} />
    </>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should add items to cart', async () => {
    const { getByTestID, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    await act(async () => {
      getByText('Add').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestID('count').props.children).toBe(1);
    });
  });

  it('should calculate total correctly', async () => {
    const { getByTestID, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    await act(async () => {
      getByText('Add').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestID('total').props.children).toBe(599.98);
    });
  });

  it('should remove items from cart', async () => {
    const { getByTestID, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    await act(async () => {
      getByText('Add').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestID('count').props.children).toBe(1);
    });

    await act(async () => {
      getByText('Remove').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestID('count').props.children).toBe(0);
    });
  });

  it('should persist cart to AsyncStorage', async () => {
    const { getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    await act(async () => {
      getByText('Add').props.onPress();
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
