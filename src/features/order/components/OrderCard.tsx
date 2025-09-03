import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, TextStyle, ImageSourcePropType } from "react-native";
import { COLORS } from "../../../constants/color";
import { ICONS } from "../../../assets/images/icons";
import { Image, SvgProps } from "react-native-svg";

type OrderCardProps = {
    containerStyles?: ViewStyle;
    textStyles?: TextStyle;
    date?: string;
    orderStatus?: string;
    paymentStatus?: string;
    orderId?: string;
    items?: number;
    totalPrice?: number;
    illustration?: string | ImageSourcePropType;
    detailItemPressed?: () => void;
}

const OrderCard = ({ containerStyles, textStyles, date, orderStatus, paymentStatus, orderId, items, illustration, totalPrice }: OrderCardProps) => {
    return (
        <View style={styles.container}>
            <Text>OrderCard</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: COLORS.section,
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        marginTop: 15,
        flexDirection: 'row',
        height: 100,
        borderColor: COLORS.defaultShadow,
        borderWidth: 1,

    },
});
export default OrderCard;