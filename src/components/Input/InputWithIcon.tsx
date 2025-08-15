import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInput,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { COLORS } from '../../constants/color';

type InputWithIconProps = {
  inputWidth?: number;
  inputHeight?: number;
  placeholder: string;
  icon?: React.FC<SvgProps>;
  containerStyles?: ViewStyle;
  inputStyles?: TextStyle;
};

const InputWithIcon = (props: InputWithIconProps) => {
  const { placeholder, inputWidth = 300, inputHeight = 50, icon: Icon } = props;
  return (
    <View
      style={[styles.container, { width: inputWidth, height: inputHeight }]}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        {Icon && <Icon width={21} height={21} color={COLORS.iconColor} />}
      </View>
      {/* Line */}
      {/* Text */}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholderOrange}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  iconContainer: {
    paddingHorizontal: 20,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.defaultShadow,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: COLORS.specialText,
  },
});

export default InputWithIcon;
