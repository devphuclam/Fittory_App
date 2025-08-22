import React from "react";
import { TouchableOpacity, Text, View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigations/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Appbar from "../../components/Appbar/Appbar";
import { COLORS } from "../../constants/color";

const { width: screenWidth } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>


const CheckoutScreen = () => {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <Appbar style={{ marginTop: '10%', width: '80%', alignSelf: 'center' }} label="Checkout" returnable={true} />
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
})
export default CheckoutScreen;