import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../types';
import { COLORS, SPACING } from '../utils/constants';
import { useConfig } from '../context/ConfigContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { apiEndpoint } = useConfig();
  const price = product.price ?? 0;
  const rating = product.rating ?? 0;
  const currencyCode = product.currencyCode ?? 'USD';

  // Build image URL - remove /api suffix if present, then add image path
  const baseUrl = apiEndpoint.replace(/\/api$/, '');
  const imageUrl = product.picture
    ? `${baseUrl}/images/products/${product.picture}`
    : `https://via.placeholder.com/150?text=${encodeURIComponent(product.name || 'Product')}`;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name || 'Unknown Product'}
        </Text>
        <Text style={styles.price}>
          {currencyCode} {price.toFixed(2)}
        </Text>
        <Text style={styles.category}>{product.category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  category: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
