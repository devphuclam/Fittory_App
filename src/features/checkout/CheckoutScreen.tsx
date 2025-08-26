import React, { useEffect } from "react";
import { TouchableOpacity, Text, View, ScrollView, StyleSheet, Dimensions, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigations/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Appbar from "../../components/Appbar/Appbar";
import { COLORS } from "../../constants/color";
import InputWithIcon from "../../components/Input/InputWithIcon";
import BottomNavBar from "../../components/BottomNavBar/BottomNavBar";
import RegularButton from "../../components/RegularButton/RegularButton";
import RegularButtonWithIcon from "../../components/RegularButton/RegularButtonWithIcon";
import { ICONS } from "../../assets/images/icons";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { useState } from "react";

const { width: screenWidth } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>
type RadioButtonOption = {
    id: string;
    label: string;
    price?: number;
};

const RadioButtonGroup = ({
    options,
    selected,
    onSelect,
}: {
    options: RadioButtonOption[];
    selected: RadioButtonOption;
    onSelect: (options: RadioButtonOption) => void;
}) => {
    return (
        <View>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.id}
                    style={styles.radioOption}
                    onPress={() => onSelect(option)}
                >
                    {/* vòng tròn ngoài */}
                    <View style={styles.outerCircle}>
                        {selected.id === option.id && <View style={styles.innerCircle} />}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                    {option.price !== undefined && (
                        <Text style={[styles.radioLabel, { marginLeft: 'auto' }]}>
                            ${option.price.toFixed(2)}
                        </Text>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};


const CheckoutScreen = () => {

    const [deliveryService, setDeliveryService] = useState<RadioButtonOption>({
        id: "0",
        label: "No delivery service selected",
        price: 0,
    });
    const [paymentMethod, setPaymentMethod] = useState<RadioButtonOption>({
        id: "0",
        label: "No payment method selected",
    });
    useEffect(() => {
        console.log('Selected delivery service:', deliveryService);
    }, [deliveryService]);
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <Appbar style={{ marginTop: '15%', width: '80%', alignSelf: 'center' }} label="Checkout" returnable={true} />
                <View style={styles.bodyContainer}>
                    <Text style={styles.titleText}>Shipping Address</Text>
                    <View style={styles.shippingAddressSection}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={styles.left}>
                                <Text style={styles.subTitleText}>First Name</Text>
                                <InputWithIcon inputStyles={styles.TextInputStyle} containerStyles={styles.inputStyle} icon={null} placeholder="First Name" value="" onChangeText={() => { }} />
                                <Text style={styles.subTitleText}> Phone Number</Text>
                                <InputWithIcon inputStyles={styles.TextInputStyle} containerStyles={styles.inputStyle} icon={null} placeholder="Phone Number" value="" onChangeText={() => { }} />
                                <Text style={styles.subTitleText}> Postal Code</Text>
                                <InputWithIcon inputStyles={styles.TextInputStyle} containerStyles={styles.inputStyle} icon={null} placeholder="Postal Code" value="" onChangeText={() => { }} />
                                <Text style={styles.subTitleText}>State/Province</Text>
                                <InputWithIcon inputStyles={styles.TextInputStyle} containerStyles={styles.inputStyle} icon={null} placeholder="State/Province" value="" onChangeText={() => { }} />
                            </View>
                            <View style={styles.right}>
                                <Text style={styles.subTitleText}>Last Name</Text>
                                <InputWithIcon inputStyles={styles.TextInputStyle} containerStyles={styles.inputStyle} icon={null} placeholder="Last Name" value="" onChangeText={() => { }} />
                                <Text style={styles.subTitleText}>Company</Text>
                                <InputWithIcon inputStyles={styles.TextInputStyle} containerStyles={styles.inputStyle} icon={null} placeholder="Company" value="" onChangeText={() => { }} />
                                <Text style={styles.subTitleText}>City</Text>
                                <InputWithIcon inputStyles={styles.TextInputStyle} containerStyles={styles.inputStyle} icon={null} placeholder="City" value="" onChangeText={() => { }} />
                                <Text style={styles.subTitleText}>Email Address</Text>
                                <InputWithIcon inputStyles={styles.TextInputStyle} containerStyles={styles.inputStyle} icon={null} placeholder="Email Address" value="" onChangeText={() => { }} />
                            </View>
                        </View>
                        <Text style={[styles.subTitleText, { marginLeft: "5%" }]}>Address</Text>
                        <InputWithIcon icon={null} placeholder="Address" value="" onChangeText={() => { }} />
                        <Text style={[styles.subTitleText, { marginLeft: "5%" }]}>Country/Region</Text>
                        <InputWithIcon icon={null} placeholder="Country/Region" value="" onChangeText={() => { }} />
                    </View>
                    <Text style={styles.titleText}>Delivery Service</Text>
                    <View style={[styles.deliveryServiceSection, { alignItems: 'center', justifyContent: 'center' }]}>
                        <RadioButtonGroup
                            options={[
                                { id: "1", label: "Method 1", price: 5.00 },
                                { id: "2", label: "Method 2", price: 10.00 },
                            ]}
                            selected={deliveryService}
                            onSelect={setDeliveryService}
                        />
                    </View>
                    <Text style={styles.titleText}>Payment Method</Text>
                    <View style={styles.paymentMethodSection}>
                        <RadioButtonGroup
                            options={[
                                { id: "1", label: "Credit Card", price: 0 },
                                { id: "2", label: "PayPal", price: 0 },
                                { id: "3", label: "Cash on Delivery", price: 0 },
                            ]}
                            selected={paymentMethod}
                            onSelect={setPaymentMethod}
                        />
                    </View>
                    <RegularButtonWithIcon label=" Place Order" icon={ICONS.order} onPress={() => { }} />
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
        paddingBottom: 40,
    },
    bodyContainer: {
        width: '95%',
        alignSelf: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: "5%",
        marginTop: "10%",
        color: COLORS.lightBlack,
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
    },
    left: {
        width: '47%',

    },
    right: {
        width: '47%',
    },
    inputStyle: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    TextInputStyle: {
        fontSize: 14,
    },
    subTitleText: {
        fontSize: 12,
        color: COLORS.darkShadow,
        marginTop: "5%",
        marginLeft: "10%",
    },
    deliveryServiceSection: {
        marginTop: '3%',
        width: '100%',
        height: 'auto',
        borderWidth: 1,
        borderColor: COLORS.defaultShadow,
        borderRadius: 20,
        backgroundColor: COLORS.section,
        paddingHorizontal: "3%",
        paddingVertical: "5%",
    },
    paymentMethodSection: {
        marginTop: '3%',
        width: '100%',
        height: 'auto',
        borderWidth: 1,
        borderColor: COLORS.defaultShadow,
        borderRadius: 20,
        backgroundColor: COLORS.section,
        paddingHorizontal: "3%",
        paddingVertical: "5%",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: "10%",

    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
        borderWidth: 1,
        borderColor: COLORS.defaultShadow,
        borderRadius: 10,
        padding: 10,
        width: "90%",
        backgroundColor: COLORS.white,
    },
    outerCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.lightBlack,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    innerCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: COLORS.lightBlack,
    },
    radioLabel: {
        fontSize: 14,
        color: COLORS.lightBlack,
    },
})
export default CheckoutScreen;