import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { ICONS } from '../../../assets/images/icons';
import { COLORS } from '../../../constants/color';

type LanguageButtonProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

const LanguageButton = ({
  label,
  isSelected,
  onPress,
}: LanguageButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.langButton, isSelected && styles.langButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.langText, isSelected && styles.langTextActive]}>
        {label}
      </Text>
      {isSelected && (
        <ICONS.tick
          width={25}
          height={20}
          color={COLORS.success}
          fill={COLORS.success}
          style={styles.checkIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  langButton: {
    width: '60%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.specialText,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  langButtonActive: {
    backgroundColor: COLORS.activeBlue,
  },
  langText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  langTextActive: {
    fontWeight: 'bold',
  },
  checkIcon: {
    position: 'absolute',
    right: 16,
  },
});

export default LanguageButton;
