// components/Input/InputWithIcon.tsx
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  TextInputProps,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { COLORS } from '../../constants/color';

type InputWithIconProps = TextInputProps & {
  inputWidth?: number; // optional fixed width (will be ignored if containerStyles define width)
  inputHeight?: number;
  placeholder?: string;
  icon?: React.FC<SvgProps> | React.ReactNode; // SVG component or node
  rightIcon?: React.FC<SvgProps> | React.ReactNode; // optional right icon
  containerStyles?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<TextStyle>;
  iconPressable?: boolean; // make icon touchable
  onIconPress?: () => void;
  iconContainerStyle?: StyleProp<ViewStyle>;
  placeholderTextColor?: string;
  onChangeText?: (text: string) => void;
  value?: string;
};

const InputWithIcon: React.FC<InputWithIconProps> = (props) => {
  const {
    inputWidth,
    inputHeight = 48,
    placeholder,
    icon,
    rightIcon,
    containerStyles,
    inputStyles,
    iconPressable = false,
    onIconPress,
    iconContainerStyle,
    placeholderTextColor = COLORS.placeholderOrange,
    value,
    onChangeText,
    ...restTextInputProps
  } = props;

  const renderIcon = (ic?: React.FC<SvgProps> | React.ReactNode) => {
    if (!ic) return null;
    // if it's a React component (SVG), render it with width/height
    if (typeof ic === 'function') {
      const IconComp = ic as React.FC<SvgProps>;
      return <IconComp width={20} height={20} color={COLORS.iconColor} />;
    }
    // else if it's a node (e.g. an Image or <Svg/> already), render directly
    return ic as React.ReactNode;
  };

  const leftIconNode = renderIcon(icon);
  const rightIconNode = renderIcon(rightIcon);

  const containerDimensionStyle: StyleProp<ViewStyle> = {};
  if (inputWidth) containerDimensionStyle.width = inputWidth;
  if (inputHeight) containerDimensionStyle.height = inputHeight;

  return (
    <View style={[styles.wrapper, containerDimensionStyle, containerStyles]}>
      {/* Left icon */}
      {leftIconNode ? (
        iconPressable ? (
          <TouchableOpacity
            style={[styles.iconContainer, iconContainerStyle]}
            onPress={onIconPress}
            activeOpacity={0.7}
          >
            {leftIconNode}
          </TouchableOpacity>
        ) : (
          <View style={[styles.iconContainer, iconContainerStyle]}>
            {leftIconNode}
          </View>
        )
      ) : null}

      {/* Text input */}
      <TextInput
        style={[styles.input, inputStyles]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        {...restTextInputProps}
      />

      {/* Right icon (optional) */}
      {rightIconNode ? (
        <View style={[styles.rightIconContainer, iconContainerStyle]}>
          {rightIconNode}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    // shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  iconContainer: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.defaultShadow,
  },
  rightIconContainer: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.defaultShadow,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.specialText,
    height: '100%',
  },
});

export default InputWithIcon;
