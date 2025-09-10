import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './navigations/AppNavigator';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from './contexts/AuthContext';
import { RegionProvider } from './contexts/RegionContext';

enableScreens();

export default function App() {
  return (
    <RegionProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </RegionProvider>
  );
}

const styles = StyleSheet.create({});
