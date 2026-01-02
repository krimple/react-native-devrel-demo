/**
 * App Navigator
 * Main navigation stack configuration
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  sdk: any; // HoneycombReactNativeSDK instance
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ sdk }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#841584',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold' as any,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          options={{ title: 'Astronomy Shop' }}
        >
          {(props) => <HomeScreen {...props} sdk={sdk} />}
        </Stack.Screen>
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{ title: 'Products' }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Product Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
