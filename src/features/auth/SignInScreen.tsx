import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import { LOGO } from '../../assets/images/logo';
import { COLORS } from '../../constants/color';
import { ICONS } from '../../assets/images/icons';
import ConfirmButton from '../../components/ConfirmButton/ConfirmButton';
import InputWithIcon from '../../components/Input/InputWithIcon';
import AnimatedLink from '../../components/AnimatedLink/AnimatedLink';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';

const { width: screenWidth } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignInScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={LOGO.logoPrimary} style={styles.logo} />
      {/* Title */}
      <Text style={styles.title}>Sign in</Text>
      {/* Inputs */}
      <View style={styles.mainContentContainer}>
        <InputWithIcon
          placeholder='Email Adress'
          icon={ICONS.email}
          inputWidth={screenWidth * 0.8}
          inputHeight={40}
        />
        <InputWithIcon
          placeholder='Password'
          icon={ICONS.padlock}
          inputWidth={screenWidth * 0.8}
          inputHeight={40}
        />

        {/* Sign-In Button */}
        <ConfirmButton
          label='Sign In'
          buttonWidth={screenWidth * 0.8}
          buttonHeight={46}
          onPress={() => navigation.navigate('Home')}
        />
      </View>
      <View style={styles.belowMainContent}>
        {/* Forgot Password */}
        <AnimatedLink label='Forgot Password ?' textStyle={styles.linkText} />
        {/* Proceed to Sign Up */}
        <View style={[{ alignItems: 'center' }]}>
          <Text style={styles.normalText}>Don't have an account ?</Text>
          <AnimatedLink
            label='Sign Up'
            textStyle={styles.linkText}
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logo: {
    width: screenWidth * 0.7,
    height: 'auto',
    aspectRatio: 1,
  },
  title: {
    color: COLORS.specialText,
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: COLORS.orangeShadow,
    textShadowRadius: 10,
    textShadowOffset: { width: 10, height: 10 },
  },
  mainContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    width: screenWidth * 0.8,
    height: '35%',
  },
  belowMainContent: {
    display: 'flex',
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  normalText: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    color: COLORS.linkText,
  },
});

export default SignInScreen;
