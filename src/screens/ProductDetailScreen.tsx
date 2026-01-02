/**
 * Product Detail Screen - Placeholder for checkpoint
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<Props> = ({ route }) => {
  const { productId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Product Detail Screen</Text>
      <Text style={styles.subtext}>Product ID: {productId}</Text>
      <Text style={styles.subtext}>(Full implementation coming next)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
});
