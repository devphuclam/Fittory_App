import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SvgProps } from 'react-native-svg';

type AnimatedLinkProps = {
  label: string;
  onPress?: () => void;
  icon?: React.FC<SvgProps>;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const LinkWithIcon = ({
  label,
  onPress,
  icon: Icon,
  style,
  textStyle,
}: AnimatedLinkProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {Icon && <Icon width={24} height={24} />}
      <Pressable
        style={[style]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <Animated.Text
          style={[
            textStyle,
            { transform: [{ scale }], marginLeft: 10, marginBottom: 5 },
          ]}
        >
          {label}
        </Animated.Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '60%',
    alignItems: 'center',
  },
});

export default LinkWithIcon;
