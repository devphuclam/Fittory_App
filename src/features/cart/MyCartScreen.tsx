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
import sampleProducts from "../../data/sampleProducts";
import BottomNavBar from "../../components/BottomNavBar/BottomNavBar";
import { useEffect } from "react";
import InputWithIcon from "../../components/Input/InputWithIcon";
import RegularButton from "../../components/RegularButton/RegularButton";

const { width: screenWidth } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'MyCart'>


const MyCartScreen = ({ navigation }: Props) => {
    const [cartArrayState, setCartArrayState] = useState(sampleProducts);
    type Product = typeof sampleProducts[1];
    const [checkedItemState, setCheckedItemState] = useState<Product[]>([]);
    let count = cartArrayState.length;
    const [subtotalState, setSubtotalState] = useState<number>(0);
    let discount: number = 0.05;
    let delivery: number = 10;
    const [lastPriceState, SetLastPriceState] = useState<number>(0);
    const handleRemoveItem = (id: string) => {
        setCartArrayState((prevItems) => {
            return prevItems.filter((item) => item.id !== id);
        })
    }
    const handleCheckedItem = (id: string, state: boolean) => {
        const item = cartArrayState.find(p => p.id === id);
        if (!item) return;

        setCheckedItemState((prevItems) => {
            if (state) {
                // Thêm nếu chưa có
                if (!prevItems.some(p => p.id === id)) {
                    return [...prevItems, item];
                }
                return prevItems;
            } else {
                // Bỏ ra nếu có
                return prevItems.filter(p => p.id !== id);
            }
        });
    };
    useEffect(() => {
        console.log(`so luong san pham da tick`, checkedItemState.length)
        let totalPrice = 0
        checkedItemState.forEach((item) => {
            if (item.stock)
                totalPrice += item.price * item.stock
        })
        setSubtotalState(totalPrice);
        SetLastPriceState(totalPrice * (1 - discount) + delivery);
    }, [checkedItemState]);
    useEffect(() => {
        console.log('Last Price:', lastPriceState);
    }, [lastPriceState]);
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
                    {cartArrayState.map((data) => (
                        <CartItemCard
                            key={data.id}
                            id={data.id}
                            name={data.name}
                            quanity={data.stock}
                            illustration={data.images[1]}
                            money={data.price}
                            removeItemPressed={handleRemoveItem}
                            checkboxTicked={handleCheckedItem}
                        />
                    ))}
                    <View style={styles.voucherSection}>
                        <View style={{ flexDirection: "row", justifyContent: 'space-between', width: '100%' }}>
                            <InputWithIcon
                                inputWidth={screenWidth * 0.8 * 0.7}
                                inputHeight={40}
                                placeholder="Enter Voucher"
                                icon={ICONS.voucher}
                                inputStyles={{ fontSize: 16 }}
                            ></InputWithIcon>
                            <View >
                                <RegularButton label="Apply"></RegularButton>
                            </View>
                        </View>
                        <Text style={{ marginLeft: "5%", marginTop: '1%' }}>This is confirm voucher</Text>
                    </View>
                    <View style={styles.moneySumSection}>
                        <View style={{ width: '50%', height: 100, justifyContent: 'space-around', alignItems: 'center', paddingRight: '10%' }}>
                            <Text>Subtotal:</Text>
                            <Text>Discount:</Text>
                            <Text>Delivery:</Text>
                        </View>
                        <View style={{ width: "50%", height: 100, justifyContent: 'space-around', alignItems: 'center', paddingRight: 0 }}>
                            <Text>{subtotalState} $</Text>
                            <Text>{discount * 100}%</Text>
                            <Text>{delivery} $</Text>
                        </View>
                    </View>
                    <View style={styles.lastPriceSection}>
                        <View style={{ width: '50%', height: 'auto', justifyContent: 'space-around', alignItems: 'flex-start', paddingLeft: '10%' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Total:</Text>
                        </View>

                        <View style={{ width: '50%', height: 'auto', justifyContent: 'space-around', alignItems: 'flex-end', paddingRight: "10%" }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.success, textDecorationLine: 'underline', }}>{lastPriceState} $</Text>
                        </View>
                    </View>
                </View>
                <RegularButton label="Proceed to Checkout" buttonWidth={screenWidth} />
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
        width: '80%',
        alignSelf: 'center',
    },
    totalText: {
        fontSize: 16,
        fontWeight: '600',
    },
    voucherSection: {
        marginTop: '10%',
        width: '100%',
        height: 'auto',
    },
    moneySumSection: {
        flexDirection: 'row',
        marginTop: '10%',
        width: '100%',
        height: 'auto',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    lastPriceSection: {
        paddingVertical: "10%",
        width: "100%",
        flexDirection: "row",
        height: 'auto',
    }
})

export default MyCartScreen;
