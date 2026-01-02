/**
 * Settings Screen
 * Allows users to configure API and OpenTelemetry endpoints at runtime
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useConfig, DEFAULT_API_ENDPOINT, DEFAULT_OTEL_ENDPOINT } from '../context/ConfigContext';

export const SettingsScreen: React.FC = () => {
  const { apiEndpoint, otelEndpoint, setApiEndpoint, setOtelEndpoint, resetToDefaults } = useConfig();

  const [apiValue, setApiValue] = useState(apiEndpoint);
  const [otelValue, setOtelValue] = useState(otelEndpoint);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        setApiEndpoint(apiValue),
        setOtelEndpoint(otelValue),
      ]);
      Alert.alert(
        'Settings Saved',
        'Configuration has been updated. Restart the app for changes to take effect.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetToDefaults();
              setApiValue(DEFAULT_API_ENDPOINT);
              setOtelValue(DEFAULT_OTEL_ENDPOINT);
              Alert.alert('Success', 'Settings have been reset to defaults.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset settings.');
            }
          },
        },
      ]
    );
  };

  const hasChanges = apiValue !== apiEndpoint || otelValue !== otelEndpoint;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Configuration</Text>
        <Text style={styles.description}>
          Configure API and OpenTelemetry collector endpoints. Changes require an app restart.
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>API Endpoint</Text>
          <Text style={styles.hint}>Backend API base URL</Text>
          <TextInput
            style={styles.input}
            value={apiValue}
            onChangeText={setApiValue}
            placeholder={DEFAULT_API_ENDPOINT}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>OTEL Collector Endpoint</Text>
          <Text style={styles.hint}>OpenTelemetry traces endpoint</Text>
          <TextInput
            style={styles.input}
            value={otelValue}
            onChangeText={setOtelValue}
            placeholder={DEFAULT_OTEL_ENDPOINT}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, !hasChanges && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Settings</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>Reset to Defaults</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.defaultsSection}>
          <Text style={styles.defaultsHeader}>Default Values</Text>
          <Text style={styles.defaultText}>
            <Text style={styles.defaultLabel}>API:</Text> {DEFAULT_API_ENDPOINT}
          </Text>
          <Text style={styles.defaultText}>
            <Text style={styles.defaultLabel}>OTEL:</Text> {DEFAULT_OTEL_ENDPOINT}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#841584',
  },
  resetButton: {
    backgroundColor: '#666',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  defaultsSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  defaultsHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  defaultText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  defaultLabel: {
    fontWeight: '600',
    color: '#333',
  },
});
