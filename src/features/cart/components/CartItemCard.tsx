import React from "react";
import { ICONS } from "../../../assets/images/icons";
import { IMAGES } from "../../../assets/images/index";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { COLORS } from "../../../constants/color";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigations/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type CartItemProps = {
    name?: string;
    attribute?: string[];
    quanity?: number;
    illustration?: string | ImageSourcePropType;
    money?: number;
    id: string,
    removeItemPressed?: (id: string) => void;
    checkboxTicked?: (id: string, state: boolean) => void;
}
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CartItemCard = ({ name, attribute, quanity, illustration, money, removeItemPressed, id, checkboxTicked }: CartItemProps) => {
    const imageSource: ImageSourcePropType = typeof illustration === 'string' ?
        ({ uri: illustration } as ImageSourcePropType) :
        (illustration as ImageSourcePropType)
    const [checkboxState, setCheckboxState] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const onPressCheckbox = () => {
        const newState = !checkboxState
        if (newState === true) {
            console.log(`${id} checked`)
            if (checkboxTicked) {
                checkboxTicked(id, true);
            }
        }
        else {
            console.log(`${id} unchecked`)
            if (checkboxTicked) {
                checkboxTicked(id, false)
            }
        }
        setCheckboxState(!checkboxState);

    }
    const onPressRemoveCard = () => {
        if (removeItemPressed) {
            removeItemPressed(id);
        }
    }
    const goToDetailWithID = () => {
        navigation.navigate("ProductDetail", { productId: id })
    }
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={goToDetailWithID}>
                    <Image style={styles.image} source={imageSource} resizeMode='cover'></Image>
                </TouchableOpacity>

            </View>
            <View style={{ display: 'flex', flexDirection: 'row', flex: 1, padding: '2%' }}>
                <View style={styles.left}>
                    <View>
                        <Text style={{ fontWeight: '600', fontSize: 14, width: "100%" }} numberOfLines={2}>{name}</Text>
                        <View style={{ flexDirection: "row" }}>
                            {attribute ? (attribute?.map(att => <Text>{att} </Text>)) : (<Text>default attribute</Text>)}
                        </View>

                        <Text style={{ fontSize: 12, fontWeight: '600' }}>Quantity: {quanity}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: "600" }}>{money}$</Text>
                    </View>

                </View>
                <View style={styles.right}>
                    {checkboxState ? (
                        <TouchableOpacity onPress={onPressCheckbox}>
                            <ICONS.checkedbox width={28} height={28} />
                        </TouchableOpacity>)
                        :
                        (
                            <TouchableOpacity onPress={onPressCheckbox}>
                                <ICONS.uncheckedbox width={24} height={24} />
                            </TouchableOpacity>
                        )}

                    <TouchableOpacity onPress={onPressRemoveCard}>
                        <ICONS.removecartitem width={32} height={32} color={COLORS.red} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: COLORS.darkShadow,
        borderWidth: 1,
        marginTop: '5%',
        width: '100%',
        height: 140,
        flexDirection: 'row',
        borderRadius: 20,
        backgroundColor: COLORS.section,
    },
    imageContainer: {
        width: "35%", // chiếm 35% ngang (bạn chỉnh 30-40% tùy ý)
        height: "100%",
        borderRightWidth: 2,
        borderColor: COLORS.defaultShadow,
        alignItems: 'center'
    },
    image: {
        width: "100%", // ăn full theo container
        height: "100%", // ăn full theo container
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    left: {
        width: '70%',
        justifyContent: 'space-around',
        paddingLeft: "2%",

    },
    right: {
        alignItems: 'center',
        width: "30%",
        paddingVertical: '5%',
        justifyContent: "space-between",

    }
})

export default CartItemCard;