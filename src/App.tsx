import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './navigations/AppNavigator';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from './contexts/AuthContext';
import { RegionProvider } from './contexts/RegionContext';
import { CartProvider } from './contexts/CartContext';

enableScreens();

export default function App() {
  return (
    <CartProvider>
      <RegionProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </RegionProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({});
