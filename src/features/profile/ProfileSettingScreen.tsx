import React, { useState, useContext, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Appbar from '../../components/Appbar/Appbar';
import InputWithIcon from '../../components/Input/InputWithIcon';
import ConfirmButton from '../../components/ConfirmButton/ConfirmButton';
import { COLORS } from '../../constants/color';
import { USER } from '../../assets/images/user';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../contexts/AuthContext';
import { CustomerService } from '../../services';
import { TOKEN_KEY } from '../../config';

const { width: screenWidth } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetting'>;

const ProfileSettingScreen = ({ navigation }: Props) => {
  const { user, refreshUser, signIn, signOut } = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveAndEdit = async () => {
    try {
      if (isActive) {
        await CustomerService.updateProfile({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
        });
        await refreshUser?.();
        Alert.alert('Success', 'Profile updated successfully');
        console.log('Saving profile: ', formData);
      }
      setIsActive(!isActive);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangePasswordPressed = () => {
    setIsChangingPassword(!isChangingPassword);
    // navigation.navigate('ResetPassword');
  };

  const handleSendPrevPassword = async () => {
    try {
      const res = await signIn(user.email, password);
      console.log('Signed in user:', res);
      if (res) {
        await CustomerService.generateResetPasswordToken(user.email);
        navigation.navigate('ResetPassword');
      }
    } catch (err) {
      console.error('Change Password Error', err);
      setIsChangingPassword(!isChangingPassword);
    }
  };

  const handleLogOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut?.();
          console.log('Logging out', user);
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        keyboardShouldPersistTaps='handled'
        extraScrollHeight={250}
      >
        <Appbar
          label='Profile Setting'
          style={{ width: '80%', marginTop: '10%', alignSelf: 'center' }}
          returnable
        />
        <View
          style={{
            width: '100%',
            minHeight: Dimensions.get('window').height,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={pickImage}
          >
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : USER.userPlaceholderAvatar2
              }
              style={{ width: '100%', height: '100%', borderRadius: 100 }}
              resizeMode='cover'
            />
          </TouchableOpacity>
          <View style={styles.inputSection}>
            <InputWithIcon
              containerStyles={
                isActive ? styles.textInput : styles.disableTextInput
              }
              inputStyles={{ color: COLORS.lightBlack }}
              placeholderTextColor={COLORS.lightBlack}
              placeholder='First Name ...'
              value={formData.firstName}
              editable={isActive}
              onChangeText={(text) => handleInputChange('firstName', text)}
            />
            <InputWithIcon
              containerStyles={
                isActive ? styles.textInput : styles.disableTextInput
              }
              inputStyles={{ color: COLORS.lightBlack }}
              placeholderTextColor={COLORS.lightBlack}
              placeholder='Last Name ...'
              value={formData.lastName}
              editable={isActive}
              onChangeText={(text) => handleInputChange('lastName', text)}
            />
            <InputWithIcon
              containerStyles={styles.disableTextInput}
              inputStyles={{ color: COLORS.lightBlack }}
              placeholderTextColor={COLORS.lightBlack}
              placeholder='Email address'
              value={formData.email}
              editable={false}
            />

            <InputWithIcon
              containerStyles={
                isActive ? styles.textInput : styles.disableTextInput
              }
              inputStyles={{ color: COLORS.lightBlack }}
              placeholderTextColor={COLORS.lightBlack}
              placeholder='Phone Number'
              value={formData.phone}
              editable={isActive}
              onChangeText={(text) => handleInputChange('phone', text)}
            />
            {isChangingPassword && (
              <InputWithIcon
                containerStyles={styles.textInput}
                inputStyles={{ color: COLORS.lightBlack }}
                placeholderTextColor={COLORS.lightBlack}
                placeholder='Current Password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            )}
            <View style={styles.buttonView}>
              <ConfirmButton
                label='Log Out'
                isDisable={isActive}
                onPress={handleLogOut}
              />
              {!isChangingPassword ? (
                <ConfirmButton
                  label='Change Password'
                  buttonWidth={screenWidth * 0.45}
                  onPress={handleChangePasswordPressed}
                />
              ) : (
                <ConfirmButton
                  label='Send'
                  buttonWidth={screenWidth * 0.45}
                  onPress={handleSendPrevPassword}
                />
              )}
              {isActive ? (
                <ConfirmButton label='Save' onPress={handleSaveAndEdit} />
              ) : (
                <ConfirmButton label='Edit' onPress={handleSaveAndEdit} />
              )}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  scrollContent: {
    backgroundColor: COLORS.background,
    paddingBottom: 40,
    flexGrow: 1,
  },
  profileImageContainer: {
    marginTop: '10%',
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    borderColor: COLORS.specialText,
    borderWidth: 2,
    borderRadius: 100,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  textInput: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: COLORS.section,
    opacity: 1,
  },
  disableTextInput: {
    width: '80%',
    alignSelf: 'center',
    opacity: 0.5,
  },

  inputSection: {
    backgroundColor: COLORS.background,
    marginTop: '5%',
    width: '100%',
    gap: '7.5%',
    paddingTop: '5%',
  },
  buttonView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default ProfileSettingScreen;
