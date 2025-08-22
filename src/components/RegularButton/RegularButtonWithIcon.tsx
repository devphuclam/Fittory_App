import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/color';
import { ICONS } from '../../assets/images/icons';
import { SvgProps } from 'react-native-svg';

type RegularButtonWithIconProps = {
    label?: string,
    icon?: React.FC<SvgProps>,
    textStyles?: TextStyle,
    containerStyles?: ViewStyle,

    onPress?: () => void,
}

const RegularButtonWithIcon = (props: RegularButtonWithIconProps) => {
    const {
        label = 'Default label',
        textStyles,
        icon: Icon,
        containerStyles,
        onPress,
    } = props;
    return (
        <TouchableOpacity style={[styles.container, containerStyles]} onPress={onPress}>
            {Icon && <Icon
                color={COLORS.white} width={28} height={28} />}

            <Text style={[styles.text, textStyles]}>{label}</Text>
        </TouchableOpacity>

    )
};
const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        width: '100%',
        borderWidth: 1,
        backgroundColor: COLORS.black,
        flexDirection: "row",
        justifyContent: 'center',
        borderRadius: 20,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        padding: "5%",
        gap: '2%',
    },

    icon: {
        width: 24,
        height: 24,
        color: COLORS.white,
    },
    text: {
        color: COLORS.white,
        alignSelf: 'center',
    }
});
export default RegularButtonWithIcon;