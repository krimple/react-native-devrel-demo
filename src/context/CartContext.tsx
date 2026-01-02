/**
 * Cart Context
 * Manages shopping cart with persistence and telemetry
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import { Cart, CartItem, Product } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

const tracer = trace.getTracer('astronomy-shop-rn');

interface CartContextType {
  cart: Cart;
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    currencyCode: 'USD',
  });

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cart.items]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem(STORAGE_KEYS.cartItems);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const saveCart = async (updatedCart: Cart) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.cartItems, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const calculateTotal = () => {
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    setCart((prev) => ({ ...prev, total }));
  };

  const addItem = async (product: Product, quantity: number) => {
    const span = tracer.startSpan('cart.add_item');
    span.setAttribute('product.id', product.id);
    span.setAttribute('product.name', product.name);
    span.setAttribute('cart.quantity', quantity);
    span.setAttribute('product.price', product.price);

    try {
      setCart((prev) => {
        const existingItem = prev.items.find((item) => item.productId === product.id);

        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = prev.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        } else {
          updatedItems = [
            ...prev.items,
            { productId: product.id, quantity, product },
          ];
        }

        const updatedCart = {
          ...prev,
          items: updatedItems,
          currencyCode: product.currencyCode,
        };
        saveCart(updatedCart);
        return updatedCart;
      });

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    } catch (error: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      span.recordException(error);
      span.end();
      throw error;
    }
  };

  const removeItem = async (productId: string) => {
    const span = tracer.startSpan('cart.remove_item');
    span.setAttribute('product.id', productId);

    try {
      setCart((prev) => {
        const updatedItems = prev.items.filter((item) => item.productId !== productId);
        const updatedCart = { ...prev, items: updatedItems };
        saveCart(updatedCart);
        return updatedCart;
      });

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    } catch (error: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      span.recordException(error);
      span.end();
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const span = tracer.startSpan('cart.update_quantity');
    span.setAttribute('product.id', productId);
    span.setAttribute('cart.new_quantity', quantity);

    try {
      setCart((prev) => {
        const updatedItems = prev.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );
        const updatedCart = { ...prev, items: updatedItems };
        saveCart(updatedCart);
        return updatedCart;
      });

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    } catch (error: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      span.recordException(error);
      span.end();
      throw error;
    }
  };

  const clearCart = async () => {
    const span = tracer.startSpan('cart.clear');

    try {
      const clearedCart: Cart = {
        items: [],
        total: 0,
        currencyCode: cart.currencyCode,
      };
      setCart(clearedCart);
      await saveCart(clearedCart);

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
    } catch (error: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      span.recordException(error);
      span.end();
      throw error;
    }
  };

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total: cart.total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
