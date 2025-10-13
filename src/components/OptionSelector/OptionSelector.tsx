import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ConfirmButton from '../ConfirmButton/ConfirmButton';
import { COLORS } from '../../constants/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type OptionItem = {
  id: string;
  label: string;
};

type OptionSelectorProps = {
  title: string; // Tiêu đề (ví dụ: "Choose Size")
  options: OptionItem[]; // Danh sách option
  selected: string | null; // id option đang chọn
  onSelect: (id: string, label: string) => void; // Callback khi chọn
};

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
        {options.map((opt) => {
          const isActive = selected === opt.id;
          return (
            <ConfirmButton
              key={opt.id}
              label={opt.label}
              isDisable={!isActive} // nếu không phải selected thì "disable" style
              isPressable={true}
              onPress={() => onSelect(opt.id, opt.label)}
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
    color: COLORS.specialText,
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
    gap: 10, // khoảng cách giữa các button
  },
});

export default OptionSelector;
