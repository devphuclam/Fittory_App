import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/color';

type ConfirmButtonProps = {
  buttonWidth?: number;
  buttonHeight?: number;
  label: string;
  isDisable?: boolean;
  onPress?: () => void;
};

const ConfirmButton = (props: ConfirmButtonProps) => {
  const {
    buttonWidth = 80,
    buttonHeight = 40,
    label,
    isDisable = false,
    onPress,
  } = props;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { width: buttonWidth, height: buttonHeight },
        isDisable && styles.disabledButton,
      ]}
      disabled={isDisable}
      onPress={onPress}
    >
      <Text style={[styles.text, isDisable && styles.disableText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.fittoryBlue,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Android shadow
    shadowColor: COLORS.defaultShadow, // iOS shadow
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    color: '#F2F2F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: COLORS.disable,
  },
  disableText: {
    color: '#F2F2F2',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default ConfirmButton;
