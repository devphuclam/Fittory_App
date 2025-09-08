import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, TextStyle, ImageSourcePropType } from "react-native";
import { COLORS } from "../../constants/color";
import { ICONS } from "../../assets/images/icons";
import { Image } from "react-native";
import CartItemCard from "../cart/components/CartItemCard";
import ConfirmButton from "../../components/ConfirmButton/ConfirmButton";
import ExpandableSection from "../../components/ExpandableSection/ExpandableSection";
import Appbar from "../../components/Appbar/Appbar";
import { Dimensions } from "react-native";
import { ScrollView } from "react-native";
import { useState } from "react";

const { width: screenWidth } = Dimensions.get('window');

const OrderDetail = () => {
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <Appbar style={{ marginTop: '15%', width: '85%', alignSelf: 'center' }} label="Order Detail" returnable={true} />
                <View style={styles.bodyContainer}>
                    <Text>ORDER ID: XXX</Text>
                    <CartItemCard
                        id="1"
                        name="Product Name"
                        readOnly={true} />

                    <ExpandableSection title="Delivery"></ExpandableSection>
                    <ExpandableSection title="Order Summary"></ExpandableSection>
                </View>
            </ScrollView>

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
    bodyContainer: {
        paddingTop: '10%',
        width: '90%',
        alignSelf: 'center',
    },

})

export default OrderDetail;