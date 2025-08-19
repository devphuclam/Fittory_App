import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
  GestureResponderEvent,
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
  returnable?: boolean;
  // optional callbacks if you want to override default behavior
  onBackPress?: (e?: GestureResponderEvent) => void;
  onSearchPress?: (e?: GestureResponderEvent) => void;
  onNotifyPress?: (e?: GestureResponderEvent) => void;
};

const ICON_SIZE = 24;
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const Appbar = ({
  label,
  style,
  textStyle,
  returnable = false,
  onBackPress,
  onSearchPress,
  onNotifyPress,
}: AppbarProps) => {
  const navigation = useNavigation<NavigationProp>();

  const handleBack = (e?: GestureResponderEvent) => {
    if (onBackPress) return onBackPress(e);
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.navigate('SignIn');
  };

  const handleSearch = (e?: GestureResponderEvent) => {
    if (onSearchPress) return onSearchPress(e);
    // default behaviour (you can change to your actual Search screen)
    navigation.navigate('SignIn');
  };

  const handleNotify = (e?: GestureResponderEvent) => {
    if (onNotifyPress) return onNotifyPress(e);
    navigation.navigate('SignUp');
  };

  return (
    <View style={[styles.container, style]}>
      {/* left area: either back arrow (rotated) or search */}
      <View style={styles.left}>
        {returnable ? (
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={HIT_SLOP}
            activeOpacity={0.7}
          >
            <ICONS.rightarrow
              width={ICON_SIZE}
              height={ICON_SIZE}
              color={COLORS.specialText}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSearch}
            hitSlop={HIT_SLOP}
            activeOpacity={0.7}
          >
            <ICONS.search
              width={ICON_SIZE}
              height={ICON_SIZE}
              color={COLORS.specialText}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* title centered */}
      <View style={styles.center}>
        <Text style={[styles.title, textStyle]} numberOfLines={1}>
          {label}
        </Text>
      </View>

      {/* right area: notification */}
      <View style={styles.right}>
        <TouchableOpacity
          onPress={handleNotify}
          hitSlop={HIT_SLOP}
          activeOpacity={0.7}
        >
          <ICONS.alarm
            width={ICON_SIZE}
            height={ICON_SIZE}
            color={COLORS.specialText}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.section,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    // shadow (iOS)
    shadowColor: COLORS.black,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    // elevation android
    elevation: 6,
    // ensure container has some min height
    minHeight: 56,
  },
  left: {
    width: 44, // reserve space so title stays centered
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    width: 44, // symmetric with left
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.specialText,
    fontWeight: '600',
    fontSize: 18,
  },
});

export default Appbar;
