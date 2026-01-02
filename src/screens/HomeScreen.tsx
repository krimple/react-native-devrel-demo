/**
 * Home Screen
 * Main screen with trace testing functionality
 */

import React, { useState } from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { trace } from '@opentelemetry/api';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  sdk: any; // HoneycombReactNativeSDK instance
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, sdk }) => {
  const [statusText, setStatusText] = useState('');

  function onTraceClick() {
    let span = trace
      .getTracer('astronomy-shop-example')
      .startSpan('button-click');
    console.log('the trace button was clicked!');

    setTimeout(() => {
      span.end();
    }, 2000);
  }

  async function onFlushClick() {
    setStatusText('Flushing...');
    await sdk.shutdown();
    setStatusText('Flushed');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔭 Astronomy Shop</Text>
      <Text style={styles.subtitle}>React Native OpenTelemetry Demo</Text>

      <View style={styles.buttonContainer}>
        <Button
          onPress={onTraceClick}
          title="Send a trace"
          testID="send_trace"
          color="#841584"
        />
        <Button
          onPress={onFlushClick}
          title="Flush"
          testID="flush"
          color="#841584"
        />
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      <Text id="status" testID="status" style={styles.status}>
        {statusText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    gap: 12,
    width: '80%',
  },
  settingsButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#333',
  },
  status: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
});
