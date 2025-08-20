import React from "react";
import { ICONS } from "../../../assets/images/icons";
import { IMAGES } from "../../../assets/images/index";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { COLORS } from "../../../constants/color";
import { useState } from "react";
type CartItemProps = {
    name?: string;
    attribute?: string[];
    quanity?: number;
    illustration?: string | ImageSourcePropType;
    money?: number;
    id: string,
    onPressCheckbox?: () => void,
    onPressRemoveCard?: () => void,
}



const CartItemCard = ({ name, attribute, quanity, illustration, money, onPressRemoveCard }: CartItemProps) => {
    const imageSource: ImageSourcePropType = typeof illustration === 'string' ?
        ({ uri: illustration } as ImageSourcePropType) :
        (illustration as ImageSourcePropType)
    const [checkboxState, setCheckboxState] = useState(true);
    const onPressCheckbox = () => {
        setCheckboxState(!checkboxState);
        console.log(checkboxState)
    }
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={imageSource} resizeMode='cover'></Image>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: '2%' }}>
                <View style={styles.left}>
                    <View>
                        <Text style={{ fontWeight: '600', fontSize: 15, }}>{name}</Text>
                        <View style={{ flexDirection: "row" }}>
                            {attribute?.map(att => <Text>{att} </Text>)}
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

                    <TouchableOpacity>
                        <ICONS.removecartitem width={32} height={32} color={COLORS.red} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingRight: '5%',
        flex: 1,
        borderColor: COLORS.darkShadow,
        borderWidth: 1,
        marginTop: '10%',
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
    },
    image: {
        width: "100%", // ăn full theo container
        height: "100%", // ăn full theo container
    },
    left: {
        justifyContent: 'space-around',
        paddingLeft: "2%"

    },
    right: {
        paddingVertical: '5%',
        justifyContent: "space-between",

    }
})

export default CartItemCard;