/**
 * Product List Screen
 * Displays product catalog with currency selection
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import { RootStackParamList } from '../navigation/types';
import { ProductService } from '../services/ProductService';
import { useConfig } from '../context/ConfigContext';
import { useCurrency } from '../context/CurrencyContext';
import { ProductCard } from '../components/ProductCard';
import { CurrencyPicker } from '../components/CurrencyPicker';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Product } from '../types';
import { COLORS, SPACING } from '../utils/constants';

const tracer = trace.getTracer('astronomy-shop-rn');

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

export const ProductListScreen: React.FC<Props> = ({ navigation }) => {
  const { apiEndpoint } = useConfig();
  const { currencies, selectedCurrency, selectCurrency, loading: currencyLoading, error: currencyError } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  useEffect(() => {
    // Create screen view span
    const span = tracer.startSpan('screen.product_list.view');
    span.setAttribute('screen.name', 'ProductList');
    span.end();
  }, []);

  useEffect(() => {
    if (selectedCurrency) {
      loadProducts();
    }
  }, [selectedCurrency, apiEndpoint]);

  const loadProducts = async () => {
    if (!selectedCurrency) return;

    const span = tracer.startSpan('product_list.load');
    span.setAttribute('currency', selectedCurrency.code);

    try {
      setLoading(true);
      setError(null);

      const response = await ProductService.fetchProducts(
        apiEndpoint,
        selectedCurrency.code,
      );

      setProducts(response.data || []);
      span.setAttribute('product.count', response.data?.length || 0);
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products');
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      span.recordException(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      span.end();
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleProductPress = (product: Product) => {
    const span = tracer.startSpan('product.select');
    span.setAttribute('product.id', product.id);
    span.setAttribute('product.name', product.name);
    span.end();

    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleCurrencyChange = async (currency: any) => {
    const span = tracer.startSpan('currency.change');
    span.setAttribute('currency.from', selectedCurrency?.code || 'none');
    span.setAttribute('currency.to', currency.code);

    try {
      await selectCurrency(currency);
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (err: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      span.recordException(err);
    } finally {
      span.end();
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.currencyButton}
          onPress={() => setShowCurrencyPicker(true)}
        >
          <Text style={styles.currencyButtonText}>
            {selectedCurrency?.code || 'USD'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedCurrency]);

  // Show loading while currencies are loading
  if (currencyLoading || (loading && !refreshing)) {
    return <LoadingSpinner />;
  }

  // Show currency error if that failed
  if (currencyError) {
    return (
      <ErrorMessage
        message={`Failed to load currencies: ${currencyError}. Check Settings for API endpoint.`}
      />
    );
  }

  // Show general error
  if (error) {
    return <ErrorMessage message={error} onRetry={loadProducts} />;
  }

  // Show error if no currency is selected
  if (!selectedCurrency && !currencyLoading) {
    return (
      <ErrorMessage
        message="No currency available. Check your network connection and API endpoint in Settings."
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => handleProductPress(item)} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
      <CurrencyPicker
        visible={showCurrencyPicker}
        currencies={currencies}
        selectedCurrency={selectedCurrency}
        onSelect={handleCurrencyChange}
        onClose={() => setShowCurrencyPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.xs,
  },
  currencyButton: {
    marginRight: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  currencyButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
