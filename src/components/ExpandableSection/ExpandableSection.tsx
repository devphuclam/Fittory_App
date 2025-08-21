// components/ExpandableSection/ExpandableSection.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS } from '../../constants/color'; // điều chỉnh đường dẫn nếu cần

type Props = {
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  // bạn có thể truyền string hoặc node (nhiều kiểu nội dung)
  content?: string | React.ReactNode;
  initiallyExpanded?: boolean;
  // callback optional khi toggle
  onToggle?: (expanded: boolean) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ExpandableSection = ({
  title,
  content,
  initiallyExpanded = false,
  onToggle,
  textStyle,
  style,
}: Props) => {
  const [expanded, setExpanded] = useState<boolean>(initiallyExpanded);

  const toggle = () => {
    // animate layout (mượt đủ cho expand/collapse đơn giản)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => {
      const next = !prev;
      onToggle && onToggle(next);
      return next;
    });
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.title}>{title}</Text>

      {!expanded ? (
        // pill "See more"
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.pill}
          onPress={toggle}
        >
          <Text style={styles.pillText}>See more</Text>
          <Text style={styles.pillIcon}>↗</Text>
        </TouchableOpacity>
      ) : (
        // content box
        <View style={styles.contentBox}>
          {/* Nếu truyền node thì render node, nếu string thì render Text */}
          {typeof content === 'string' || content === undefined ? (
            <Text style={[styles.contentText, textStyle]}>
              {content ?? 'No information available.'}
            </Text>
          ) : (
            content
          )}

          {/* small icon bottom-right để collapse (giống mock) */}
          <TouchableOpacity
            onPress={toggle}
            style={styles.expandIconContainer}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.expandIcon}>↙</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  title: {
    color: COLORS.specialText, // cam giống mock
    fontSize: 16,
    fontWeight: '700',
    marginLeft: SCREEN_WIDTH * 0.05,
    marginBottom: 10,
  },
  pill: {
    backgroundColor: COLORS.section, // nền pill (light beige)
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // shadow nhẹ (iOS) / elevation (Android)
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  pillText: {
    flex: 1,
    color: COLORS.lightBlack,
    fontWeight: '600',
    fontSize: 14,
  },
  pillIcon: {
    color: COLORS.iconColor,
    fontSize: 20,
    marginLeft: 8,
    fontWeight: 'bold',
  },

  contentBox: {
    backgroundColor: COLORS.section, // nền content box (nhạt)
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    borderRadius: 14,
    padding: 16,
    position: 'relative',
    // shadow
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contentText: {
    color: COLORS.black,
    lineHeight: 20,
    fontSize: 14,
  },

  // icon nhỏ ở góc dưới-phải
  expandIconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    backgroundColor: 'transparent',
    padding: 6,
  },
  expandIcon: {
    fontSize: 20,
    color: COLORS.iconColor,
    fontWeight: 'bold',
    transform: [{ rotate: '0deg' }],
  },
});

export default ExpandableSection;
