import React, { useRef } from 'react';
import {
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';

type AnimatedLinkProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const AnimatedLink = ({
  label,
  onPress,
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
    <Pressable
      style={[style]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <Animated.Text style={[textStyle, { transform: [{ scale }] }]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default AnimatedLink;
