import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { COLORS } from "../../../constants/color";
import { ICONS } from "../../../assets/images/icons";
import { SvgProps } from "react-native-svg";

type ProfileOptionButtonProps = {
    optionName?: string;
    icon?: React.FC<SvgProps>;
    onPress?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const ProfileOptionButton = ({ optionName, icon: Icon, onPress, style, textStyle }: ProfileOptionButtonProps) => {
    return (
        <View>
            <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
                {/* Option Icon */}
                <View style={styles.iconContainer}>
                    {Icon && <Icon width={24} height={24} color={COLORS.specialText} />}
                </View>
                {/* Option Name */}
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{optionName}</Text>
                </View>
                {/* Option Next Icon */}
                <View style={styles.nextIconContainer}>
                    <ICONS.alarm width={24} height={24} color={COLORS.specialText}></ICONS.alarm>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 70,
        backgroundColor: COLORS.section,
        paddingRight: '7%',
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.defaultShadow,
        borderStyle: 'solid',
        flexDirection: 'row',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        shadowColor: COLORS.black,
        marginTop: '5%',
    },
    iconContainer: {
        marginLeft: '10%',

    },
    textContainer: {
        flex: 1,
        marginLeft: '5%',

    },
    text: {
        fontSize: 14,
        fontWeight: 'medium',
        color: COLORS.black,
    },
    nextIconContainer: {
        display: 'flex',
    }
})

export default ProfileOptionButton;