// src/screens/SplashScreen.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LOGO } from '../../assets/images/logo';
import { ICONS } from '../../assets/images/icons';

const { width: screenWidth } = Dimensions.get('window');

const SplashScreen = ({}) => {
  return (
    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1}>
      <LinearGradient colors={['#fff', '#FFDAB9']} style={styles.container}>
        {/* Logo */}
        <Image
          source={LOGO.logoPrimary} // logo Fittory
          style={styles.logo}
          resizeMode='contain'
        />

        {/* Loading icon */}
        <ICONS.loading width={24} height={24} fill='#00f' />
        {/* Slogan */}
        <Text style={styles.slogan}>
          Effortless shopping. Your style{'\n'}your way.
        </Text>

        {/* Tap anywhere */}
        <Text style={styles.tapText}>{'<<<Tap anywhere to proceed >> >'}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    width: screenWidth,
    height: undefined,
    aspectRatio: 1,
  },
  slogan: {
    textAlign: 'center',
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  tapText: {
    position: 'absolute',
    bottom: 100,
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
