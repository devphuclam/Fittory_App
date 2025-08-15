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
import { RootStackParamList } from '../../navigations/AppNavigator';
import { USER } from '../../assets/images/user';
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;


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

    return (
        <ScrollView style={styles.container} >
            <View style={{ alignItems: 'center', justifyContent: 'flex-start', }}>
                {/* Profile Image Section */}
                <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                    <Image
                        source={profileImage ? { uri: profileImage } : USER.userPlaceholderAvatar2} // Placeholder avatar
                        style={{ width: '100%', height: '100%', borderRadius: 100 }}
                        resizeMode='cover'
                    />
                </TouchableOpacity>
            </View>
        </ScrollView >
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    profileImageContainer: {
        marginTop: '20%',
        width: screenWidth * 0.5,
        height: screenWidth * 0.5,
        borderColor: COLORS.specialText,
        borderWidth: 2,
        borderRadius: 100,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.defaultShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    }
});

export default ProfileScreen