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
import CartItemCard from "./components/CartItemCard";
import { IMAGES } from "../../assets/images";
import { LOGO } from "../../assets/images/logo";

const { width: screenWidth } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'MyCart'>

const CartItemData = [
    { id: '1', name: 'Example1', attribute: ['black', 'anc'], illustration: IMAGES.sampleHeadphone, quantity: 1, money: 100 },
    { id: '2', name: 'Example2', attribute: ['white', 'hihi'], illustration: LOGO.logoPrimary, quantity: 2, money: 200 },
    { id: '3', name: 'Example3', attribute: ['Red', 'haha'], illustration: IMAGES.sampleHeadphone, quantity: 3, money: 300 },
]


const MyCartScreen = ({ navigation }: Props) => {
    let count = CartItemData.length;
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <Appbar style={{ marginTop: '10%', width: '80%', alignSelf: 'center' }}
                    label="My Cart"
                    returnable={true}
                />
                <View style={styles.bodyContainer}>
                    <Text style={styles.totalText}> Total: {count}</Text>
                    {CartItemData.map((data) => (
                        <CartItemCard
                            key={data.id}
                            id={data.id}
                            name={data.name}
                            attribute={data.attribute}
                            quanity={data.quantity}
                            illustration={data.illustration}
                            money={data.money} />
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    scrollContent: {
        backgroundColor: COLORS.background,
        flexGrow: 1,
        minHeight: Dimensions.get('window').height,
    },
    bodyContainer: {
        paddingTop: '10%',
        borderColor: COLORS.red,
        borderWidth: 1,
        width: '80%',
        alignSelf: 'center',
    },
    totalText: {
        fontSize: 16,
        fontWeight: '600',
    }
})

export default MyCartScreen;
