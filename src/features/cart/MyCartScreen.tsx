import React from "react";
import { TouchableOpacity, Text, View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigations/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ICONS } from "../../assets/images/icons";
import { COLORS } from "../../constants/color";
import Appbar from "../../components/Appbar/Appbar";

const { width: screenWidth } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'MyCart'>

const MyCartScreen = ({ navigation }: Props) => {
    return (
        <View style={styles.container}>
            <ScrollView>
                <Appbar style={{ marginTop: '10%', width: '80%', alignSelf: 'center' }}
                    label="My Cart"
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.background,
    }
})

export default MyCartScreen;
