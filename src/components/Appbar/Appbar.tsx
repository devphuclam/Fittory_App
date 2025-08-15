import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/color';
import { ICONS } from '../../assets/images/icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Appbar = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {/* Search */}
      <TouchableOpacity style={{}}>
        <ICONS.search
          width={24}
          height={24}
          fill={COLORS.specialText}
          color={COLORS.specialText}
        />
      </TouchableOpacity>

      {/* Home */}
      <TouchableOpacity>
        <Text style={styles.title}>Home</Text>
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity>
        <ICONS.alarm
          width={24}
          height={24}
          fill={COLORS.specialText}
          color={COLORS.specialText}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 12,
  },
  title: {
    color: COLORS.specialText,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Appbar;
