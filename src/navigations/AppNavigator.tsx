// src/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../features/onboarding/SplashScreen';
import ChooseLanguageScreen from '../features/profile/ChooseLanguageScreen';

export type RootStackParamList = {
  Splash: undefined;
  ChooseLanguage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Splash' component={SplashScreen} />
        <Stack.Screen name='ChooseLanguage' component={ChooseLanguageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
