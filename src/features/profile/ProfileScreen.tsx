import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    View,
    Image,
    ScrollView
} from 'react-native';
import { useState } from 'react';
import { ICONS } from '../../assets/images/icons';
import { COLORS } from '../../constants/color';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { USER } from '../../assets/images/user';
import * as ImagePicker from 'expo-image-picker';
import ProfileOptionButton from './components/ProfileOptionButton';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
const profileOptions = [
    { code: 'setting', optionName: 'Profile Settings', optionIcon: ICONS.profilesetting, route: '' },
    { code: 'voucher', optionName: 'My Vouchers', optionIcon: ICONS.voucher, route: '' },
    { code: 'security', optionName: 'Security', optionIcon: ICONS.security, route: '' },
    { code: 'language', optionName: "Language", optionIcon: ICONS.language, route: 'ChooseLanguage' },
]


const ProfileScreen = ({ navigation }: Props) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    }
    const navigator = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ alignItems: 'center', justifyContent: 'flex-start', }}>
                    {/* Profile Image Section */}
                    <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                        <Image
                            source={profileImage ? { uri: profileImage } : USER.userPlaceholderAvatar2} // Placeholder avatar
                            style={{ width: '100%', height: '100%', borderRadius: 100 }}
                            resizeMode='cover'
                        />
                    </TouchableOpacity>
                    {/* User Name Section */}
                    <View style={styles.userNameContainer}>
                        <Text style={styles.userName} >Nguyen Huynh Phuc Thinh</Text>
                    </View>
                    {/* User Email Address Section */}
                    <View style={styles.userEmailAddressContainer}>
                        <Text style={styles.userEmailAddress}>Customer@example.com</Text>
                    </View>
                    {/* Profile Options Section */}
                    <View style={styles.profileOptionButtonContainer}>
                        {profileOptions.map((option) => (
                            <ProfileOptionButton
                                key={option.code}
                                optionName={option.optionName}
                                icon={option.optionIcon}
                                onPress={() => { navigator.navigate(option.route as Exclude<keyof RootStackParamList, 'ProductDetail'>) }}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView >
            <BottomNavBar activeTab='Profile' />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        backgroundColor: COLORS.background,
        flexGrow: 1,
        minHeight: Dimensions.get('window').height,
    },
    profileImageContainer: {
        marginTop: '20%',
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
    userNameContainer: {
        marginTop: '5%',
    },
    userName: {
        color: COLORS.specialText,
        fontSize: 20,
        fontWeight: 'semibold',
        shadowColor: COLORS.black,
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        elevation: 4,
        shadowOpacity: 0.3,
    },
    userEmailAddressContainer: {
        marginTop: '5%',
    },
    userEmailAddress: {
        color: COLORS.linkText,
        fontSize: 16,
        fontWeight: 'regular'
    },
    profileOptionButtonContainer: {
        marginTop: '5%',
        width: screenWidth * 0.8,
        alignSelf: 'center',
    },
});

export default ProfileScreen