import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/color';
import { ICONS } from '../../assets/images/icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AppbarProps = {
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Appbar = ({ label, style, textStyle }: AppbarProps) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={[styles.container, style]}>
      {/* Search */}
      <TouchableOpacity
        style={{}}
        onPress={() => navigation.navigate('SignIn')}
      >
        <ICONS.search width={24} height={24} color={COLORS.specialText} />
      </TouchableOpacity>

      {/* Home */}
      <Text style={styles.title}>{label}</Text>

      {/* Notifications */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <ICONS.alarm width={24} height={24} color={COLORS.specialText} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.section,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    color: COLORS.specialText,
    fontWeight: '600',
    fontSize: 20,
  },
});

export default Appbar;
