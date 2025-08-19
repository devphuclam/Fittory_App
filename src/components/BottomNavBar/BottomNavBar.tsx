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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/color';
import { ICONS } from '../../assets/images/icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type BottomNavBarProps = {
  navigation?: any;
  activeTab?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const TABS = [
  { name: 'Support', icon: ICONS.support, route: 'SupportScreen' },
  { name: 'Order', icon: ICONS.order, route: 'OrderScreen' },
  { name: 'Home', icon: ICONS.home, route: 'HomeScreen' },
  { name: 'Cart', icon: ICONS.shoppingbag, route: 'CartScreen' },
  { name: 'Profile', icon: ICONS.profile, route: 'ProfileScreen' },
];

const BottomNavBar = ({ activeTab, style, textStyle }: BottomNavBarProps) => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets(); // 👈 Lấy padding safe area

  return (
    <View
      style={[
        styles.container,
        style,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }, // 👈 Thêm padding bottom
      ]}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => {
              navigation.navigate(tab.route as keyof RootStackParamList);
            }}
          >
            <View
              style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}
            >
              <Icon
                width={24}
                height={24}
                color={isActive ? COLORS.black : COLORS.white}
              />
            </View>
            <Text
              style={[
                styles.title,
                textStyle,
                { color: isActive ? COLORS.black : COLORS.white },
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.bottomNavBar,
    borderColor: COLORS.darkShadow,
    borderWidth: 1,
    paddingHorizontal: 0,
    paddingTop: 10,
    borderRadius: 20,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 10,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(61,61,61, 0.2)',
  },
  title: {
    fontWeight: '500',
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavBar;
