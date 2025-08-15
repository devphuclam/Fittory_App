// src/screens/SplashScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LOGO } from '../../assets/images/logo';
import { COLORS } from '../../constants/color';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';
import LanguageButton from './components/LanguageButton';
import ConfirmButton from '../../components/ConfirmButton/ConfirmButton';

const { width: screenWidth } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'ChooseLanguage'>;

const languages = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中国人' },
];

const ChooseLanguageScreen = ({ navigation }: Props) => {
  const [selectedLang, setSelectedLang] = useState('en');
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={LOGO.logoPrimary} // logo Fittory
        style={styles.logo}
        resizeMode='contain'
      />

      {/* Slogan */}
      <Text style={styles.slogan}>Choose Your Language</Text>

      {/* Language Button */}
      {languages.map((lang) => (
        <LanguageButton
          key={lang.code}
          label={lang.label}
          isSelected={selectedLang === lang.code}
          onPress={() => setSelectedLang(lang.code)}
        />
      ))}

      {/* Confirm Button */}
      <View style={styles.confirmBtnContainer}>
        <ConfirmButton label='Cancel' isDisable={true} />
        <ConfirmButton
          label='Apply'
          onPress={() => {
            console.log('Selected: ', selectedLang);
            navigation.navigate('SignIn');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  logo: {
    width: screenWidth,
    height: undefined,
    aspectRatio: 1,
  },
  slogan: {
    textAlign: 'center',
    color: COLORS.specialText,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  confirmBtnContainer: {
    display: 'flex',
    width: screenWidth,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ChooseLanguageScreen;
