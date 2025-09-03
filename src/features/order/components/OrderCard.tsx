import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, TextStyle, ImageSourcePropType } from "react-native";
import { COLORS } from "../../../constants/color";
import { ICONS } from "../../../assets/images/icons";
import { Image } from "react-native";
import RegularButton from "../../../components/RegularButton/RegularButton";

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
    const imageSource: ImageSourcePropType = typeof illustration === 'string' ?
        ({ uri: illustration } as ImageSourcePropType) :
        (illustration as ImageSourcePropType)
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={imageSource} resizeMode='cover'></Image>
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.left}>
                    <Text>Wed 01/01/2111</Text>
                    <Text>Order Status: Delivered</Text>
                    <Text>Payment: Paid</Text>
                    <Text>Items: 2</Text>
                    <Text>Total: xxx.xxx$</Text>
                </View>
                <View style={styles.right}>
                    <Text>#ID</Text>
                    <RegularButton label="Detail" />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: COLORS.section,
        borderRadius: 20,
        marginBottom: 15,
        marginTop: 15,
        flexDirection: 'row',
        height: 200,
        borderColor: COLORS.defaultShadow,
        borderWidth: 1,

    },
    imageContainer: {
        width: "30%", // 30% chiều ngang của thẻ
        height: "100%", // full chiều cao của thẻ
        overflow: 'hidden',
        borderRightWidth: 2,
        borderColor: COLORS.defaultShadow,
    },
    image: {
        width: "100%", // ăn full theo container
        height: "100%", // ăn full theo container
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    infoContainer: {
        marginLeft: '3%',
        height: '100%',
        width: '67%',
        flexDirection: 'row',
        paddingHorizontal: '2%',
    },
    left: {
        width: "70%",
        height: '100%',
        justifyContent: 'space-evenly',

    },
    right: {
        width: "30%",
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: '2%',
        paddingVertical: '5%',
    },
    info: {
        fontSize: 10,
    },
});
export default OrderCard;