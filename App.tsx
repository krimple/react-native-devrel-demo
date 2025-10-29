/**
 * React Native OpenTelemetry Demo App
 * Astronomy Shop with Honeycomb Telemetry
 *
 * @format
 */

import React, { useState } from 'react';
import { Button, Platform, Text, View, StyleSheet } from 'react-native';
import { HoneycombReactNativeSDK } from '@honeycombio/opentelemetry-react-native';
import { DiagLogLevel, trace } from '@opentelemetry/api';

const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const sdk = new HoneycombReactNativeSDK({
  endpoint: `http://${localhost}:4318`,
  serviceName: 'astronomy-shop-rn',
  logLevel: DiagLogLevel.DEBUG,
});
sdk.start();

function onTraceClick() {
  let span = trace
    .getTracer('astronomy-shop-example')
    .startSpan('button-click');
  console.log('the trace button was clicked!');
  span.end();
}

export default function App() {
  const [statusText, setStatusText] = useState('');

  async function onFlushClick() {
    setStatusText('Flushing...');
    await sdk.shutdown();
    setStatusText('Flushed');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔭 Astronomy Shop</Text>
      <Text style={styles.subtitle}>React Native OpenTelemetry Demo</Text>
      <Button
        onPress={onTraceClick}
        title="Send a trace"
        testID="send_trace"
        color="#841584"
        accessibilityLabel="send_trace_button"
      />
      <Button
        onPress={onFlushClick}
        title="Flush"
        testID="flush"
        color="#841584"
        accessibilityLabel="flush_button"
      />
      <Text id="status" testID="status">
        {statusText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
});
