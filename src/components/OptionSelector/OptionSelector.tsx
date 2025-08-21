import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import ConfirmButton from '../ConfirmButton/ConfirmButton';
import { COLORS } from '../../constants/color';

type OptionSelectorProps = {
  title: string; // Tiêu đề (ví dụ: "Choose Color")
  options: string[]; // Danh sách option (ví dụ: ["Black", "White"])
  selected: string; // Option đang chọn
  onSelect: (option: string) => void; // Hàm callback khi chọn
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OptionSelector = ({
  title,
  options,
  selected,
  onSelect,
}: OptionSelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, idx) => {
          const isDisable = selected !== option;
          return (
            <ConfirmButton
              key={idx}
              label={option}
              isDisable={isDisable}
              isPressable={true}
              onPress={() => onSelect(option)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.specialText, // cam giống hình
    marginLeft: SCREEN_WIDTH * 0.05,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    justifyContent: 'space-around',
    backgroundColor: COLORS.section,
    borderRadius: 10,
    paddingVertical: SCREEN_WIDTH * 0.05,
  },
});

export default OptionSelector;
