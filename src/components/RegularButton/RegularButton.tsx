import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/color';
import { LinearGradient } from 'expo-linear-gradient';

type RegularButtonProps = {
  buttonWidth?: number;
  buttonHeight?: number;
  label: string;
  isDisable?: boolean;
  onPress?: () => void;
};

const RegularButton = (props: RegularButtonProps) => {
  const {
    buttonWidth = 80,
    buttonHeight = 40,
    label,
    isDisable = false,
    onPress,
  } = props;
  return (
    <TouchableOpacity disabled={isDisable} onPress={onPress}>
      <LinearGradient
        colors={['#D49954', '#FF0000', '#D49954']} // đỏ → cam
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          { width: buttonWidth, height: buttonHeight },
          isDisable && styles.disabledButton,
        ]}
      >
        <Text style={[styles.text, isDisable && styles.disableText]}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 4, // Android shadow
    // shadowColor: COLORS.black, // iOS shadow
    // shadowOffset: { width: 4, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
  },
  text: {
    color: '#F2F2F2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: COLORS.disable,
  },
  disableText: {
    color: '#F2F2F2',
    fontSize: 12,
    fontWeight: '400',
  },
});

export default RegularButton;
