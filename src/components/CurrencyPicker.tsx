import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Currency } from '../types';
import { COLORS, SPACING } from '../utils/constants';

interface CurrencyPickerProps {
  visible: boolean;
  currencies: Currency[];
  selectedCurrency: Currency | null;
  onSelect: (currency: Currency) => void;
  onClose: () => void;
}

export const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
  visible,
  currencies,
  selectedCurrency,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCurrencies = currencies.filter(
    (c) =>
      (c.code?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (currency: Currency) => {
    onSelect(currency);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Currency</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search currencies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  selectedCurrency?.code === item.code && styles.itemSelected,
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.itemCode}>{item.code}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSymbol}>{item.symbol}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    fontSize: 36,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  searchInput: {
    margin: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  itemCode: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    width: 60,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  itemSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
