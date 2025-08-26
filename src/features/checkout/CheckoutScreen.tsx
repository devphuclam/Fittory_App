import React from "react";
import { TouchableOpacity, Text, View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigations/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Appbar from "../../components/Appbar/Appbar";
import { COLORS } from "../../constants/color";
import InputWithIcon from "../../components/Input/InputWithIcon";
import BottomNavBar from "../../components/BottomNavBar/BottomNavBar";

const { width: screenWidth } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>


const CheckoutScreen = () => {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <Appbar style={{ marginTop: '10%', width: '80%', alignSelf: 'center' }} label="Checkout" returnable={true} />
                <View style={styles.bodyContainer}>
                    <Text>Shipping Address</Text>
                    <View style={styles.shippingAddressSection}>
                        <View style={styles.left}>
                            <Text>First Name</Text>
                            <InputWithIcon icon={null} placeholder="First Name" value="" onChangeText={() => { }} />
                            <Text> Phone Number</Text>
                            <InputWithIcon icon={null} placeholder="Phone Number" value="" onChangeText={() => { }} />
                            <Text> Postal Code</Text>
                            <InputWithIcon icon={null} placeholder="Postal Code" value="" onChangeText={() => { }} />
                            <Text>State/Province</Text>
                            <InputWithIcon icon={null} placeholder="State/Province" value="" onChangeText={() => { }} />
                        </View>
                        <View style={styles.right}>
                            <InputWithIcon icon={null} placeholder="City" value="" onChangeText={() => { }} />
                            <InputWithIcon icon={null} placeholder="Postal Code" value="" onChangeText={() => { }} />
                            <InputWithIcon icon={null} placeholder="Country" value="" onChangeText={() => { }} />
                        </View>

                    </View>
                </View>
            </ScrollView>
            <BottomNavBar activeTab="Cart" />
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
        paddingBottom: 40,
    },
    bodyContainer: {
        paddingTop: '10%',
        width: '95%',
        alignSelf: 'center',
    },
    shippingAddressSection: {
        marginTop: '3%',
        width: '100%',
        height: 'auto',
        borderWidth: 1,
        borderColor: COLORS.defaultShadow,
        borderRadius: 20,
        backgroundColor: COLORS.section,
        paddingHorizontal: "3%",
        paddingVertical: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    left: {
        width: '45%',

    },
    right: {
        width: '45%',
    },
})
export default CheckoutScreen;