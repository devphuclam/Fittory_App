import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './navigations/AppNavigator';
import { enableScreens } from 'react-native-screens';
enableScreens();

export default function App() {
  return <AppNavigator />;
}

const styles = StyleSheet.create({});
