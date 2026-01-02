import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CartItem as CartItemType } from '../types';
import { QuantitySelector } from './QuantitySelector';
import { COLORS, SPACING } from '../utils/constants';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const price = item.product.price ?? 0;
  const lineTotal = price * item.quantity;
  const currencyCode = item.product.currencyCode ?? 'USD';

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `https://via.placeholder.com/80?text=${encodeURIComponent(item.product.name || 'Product')}` }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {item.product.name || 'Unknown Product'}
        </Text>
        <Text style={styles.price}>
          {currencyCode} {price.toFixed(2)} each
        </Text>
        <View style={styles.footer}>
          <QuantitySelector
            quantity={item.quantity}
            onIncrement={() => onUpdateQuantity(item.quantity + 1)}
            onDecrement={() => onUpdateQuantity(item.quantity - 1)}
          />
          <Text style={styles.lineTotal}>
            {currencyCode} {lineTotal.toFixed(2)}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  price: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    fontSize: 32,
    color: COLORS.error,
    fontWeight: '300',
  },
});
