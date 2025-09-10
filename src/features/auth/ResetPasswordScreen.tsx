import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import { LOGO } from '../../assets/images/logo';
import { COLORS } from '../../constants/color';
import { ICONS } from '../../assets/images/icons';
import ConfirmButton from '../../components/ConfirmButton/ConfirmButton';
import InputWithIcon from '../../components/Input/InputWithIcon';
import AnimatedLink from '../../components/AnimatedLink/AnimatedLink';
import LinkWithIcon from './components/LinkWithIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { AuthContext } from '../../contexts/AuthContext';
import { CustomerService } from '../../services';
import { useRoute } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const { width: screenWidth } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = ({ navigation }: Props) => {
  const route = useRoute();
  const params = route.params as { token?: string; email?: string };
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState(user?.email || '');
  const [token, setToken] = useState(params?.token || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  useEffect(() => {
    const handleUrl = (url: string) => {
      const parsed = Linking.parse(url);
      if (parsed.queryParams?.token && parsed.queryParams?.email) {
        const rawToken = parsed.queryParams.token as string;
        const rawEmail = parsed.queryParams.email as string;

        // Giải mã token/email từ URL
        setToken(decodeURIComponent(rawToken));
        setEmail(decodeURIComponent(rawEmail));
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    const sub = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => {
      sub.remove();
    };
  }, []);

  const handleResetPassword = async () => {
    // Logic to handle password reset
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    } else {
      const res = await CustomerService.resetPassword({
        email,
        password,
        token,
      });
      if (res) {
        alert('Password updated successfully');
        navigation.navigate('SignIn');
      }
      try {
      } catch (error) {
        alert('Error: ' + error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={LOGO.logoPrimary} style={styles.logo} />
      {/* Title */}
      <Text style={styles.title}>Reset Password</Text>
      {/* Inputs */}
      <View style={styles.mainContentContainer}>
        <InputWithIcon
          containerStyles={styles.disableTextInput}
          placeholderTextColor={COLORS.lightBlack}
          placeholder='Email Adress'
          icon={ICONS.email}
          inputWidth={screenWidth * 0.8}
          inputHeight={40}
          value={email}
          editable={false}
        />
        <InputWithIcon
          placeholder='New Password'
          icon={ICONS.padlock}
          inputWidth={screenWidth * 0.8}
          inputHeight={40}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <InputWithIcon
          placeholder='Confirm Password'
          icon={ICONS.access}
          inputWidth={screenWidth * 0.8}
          inputHeight={40}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {/* Sign-Up Button */}
        <ConfirmButton
          label='Reset Password'
          buttonWidth={screenWidth * 0.8}
          buttonHeight={46}
          onPress={handleResetPassword}
        />
      </View>
      <View style={styles.belowMainContent}>
        {/* Procced to Sign In */}
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={[styles.normalText]}>
            {'Already have an account ? '}
          </Text>
          <AnimatedLink
            label='Sign In'
            textStyle={styles.linkText}
            onPress={() => navigation.navigate('SignIn')}
          />
        </View>
        {/* Proceed to Sign Up with Google */}
        <View style={[{ alignItems: 'center', width: '100%', margin: 20 }]}>
          <Text style={styles.normalText}>Or</Text>
          <LinkWithIcon
            label='Sign up with Google'
            icon={ICONS.google}
            textStyle={styles.linkText}
          />
          {/* Proceed to Sign Up with Facebook */}
          <LinkWithIcon
            label='Sign up with Facebook'
            icon={ICONS.facebook}
            textStyle={styles.linkText}
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
  disableTextInput: {
    alignSelf: 'center',
    opacity: 0.5,
  },
});

export default ResetPasswordScreen;
