// src/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../features/onboarding/SplashScreen';
import ChooseLanguageScreen from '../features/profile/ChooseLanguageScreen';
import SignInScreen from '../features/auth/SignInScreen';
import SignUpScreen from '../features/auth/SignUpScreen';
import HomeScreen from '../features/home/HomeScreen';

export type RootStackParamList = {
  Splash: undefined;
  ChooseLanguage: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Splash' component={SplashScreen} />
        <Stack.Screen name='ChooseLanguage' component={ChooseLanguageScreen} />
        <Stack.Screen name='SignIn' component={SignInScreen} />
        <Stack.Screen name='SignUp' component={SignUpScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
