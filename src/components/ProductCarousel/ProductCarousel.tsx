// components/ProductCarousel.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Animated,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatListProps,
  ImageURISource,
  ImageSourcePropType,
} from 'react-native';
import { COLORS } from '../../constants/color';
import { IMAGES } from '../../assets/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tweakable
const SPACING = 12;
const ITEM_PERCENT = 0.72;
const ITEM_WIDTH = Math.round(SCREEN_WIDTH * ITEM_PERCENT);
const SIDE_EMPTY_WIDTH = Math.round((SCREEN_WIDTH - ITEM_WIDTH) / 2);

export type Product = {
  id: string;
  name?: string;
  price?: number;
  images: (string | ImageURISource)[]; // <-- changed: multiple images
  subtitle?: string;
};

export type EffectType = 'scale' | 'parallax' | 'rotate' | 'stack';

type Props = {
  data: Product[];
  effect?: EffectType;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  onItemPress?: (product: Product) => void;
  flatListProps?: Partial<FlatListProps<any>>;
  placeholderImage?: ImageSourcePropType;
};

export default function ProductCarousel({
  data,
  effect = 'scale',
  autoPlay = true,
  autoPlayInterval = 3000,
  showDots = true,
  onItemPress,
  flatListProps,
  placeholderImage,
}: Props) {
  const listData = [
    { id: 'left-spacer' },
    ...data,
    { id: 'right-spacer' },
  ] as any[];

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatRef = useRef<FlatList<any> | null>(null);
  const autoPlayRef = useRef<number | null>(null);
  const listenerId = useRef<number | string | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // update currentIndex from scrollX
  useEffect(() => {
    listenerId.current = (scrollX as any).addListener(
      ({ value }: { value: number }) => {
        const rawIndex = Math.round(value / ITEM_WIDTH) - 1;
        const clamped = Math.max(0, Math.min(data.length - 1, rawIndex));
        setCurrentIndex(clamped);
      }
    );
    return () => {
      if (listenerId.current != null)
        (scrollX as any).removeListener(listenerId.current);
    };
  }, [data.length, scrollX]);

  // autoplay
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current as number);
      autoPlayRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (!autoPlay || data.length <= 1) return;
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      let next = currentIndex + 1;
      if (next >= data.length) next = 0;
      const offset = (next + 1) * ITEM_WIDTH;
      flatRef.current?.scrollToOffset({ offset, animated: true });
    }, autoPlayInterval) as unknown as number;
  }, [autoPlay, autoPlayInterval, currentIndex, data.length, stopAutoPlay]);

  useEffect(() => {
    if (isInteracting) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
    return () => {
      stopAutoPlay();
    };
  }, [isInteracting, startAutoPlay, stopAutoPlay]);

  // interactions: press & drag
  const handlePressIn = () => setIsInteracting(true);
  const handlePressOut = () => setIsInteracting(false);
  const handleScrollBeginDrag = () => setIsInteracting(true);
  const handleScrollEndDrag = () => setIsInteracting(false);

  const onMomentumScrollEnd = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / ITEM_WIDTH) - 1;
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    setCurrentIndex(clamped);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: Product | any;
    index: number;
  }) => {
    // spacer
    if (!item.images) {
      return <View style={{ width: SIDE_EMPTY_WIDTH }} />;
    }

    // image to show: first image or placeholder
    const firstImage =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images[0]
        : null;
    const imageSource: ImageSourcePropType = firstImage
      ? typeof firstImage === 'string'
        ? { uri: firstImage }
        : (firstImage as ImageSourcePropType)
      : placeholderImage ?? IMAGES.sampleHeadphone; // adjust placeholder path if you have one

    const inputRange = [
      (index - 2) * ITEM_WIDTH,
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: effect === 'stack' ? [0.86, 1, 0.9] : [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: effect === 'stack' ? [18, 0, 18] : [6, 0, 6],
      extrapolate: 'clamp',
    });

    const imageTranslateX = scrollX.interpolate({
      inputRange,
      outputRange: effect === 'parallax' ? [40, 0, -40] : [0, 0, 0],
      extrapolate: 'clamp',
    });

    const rotateY = scrollX.interpolate({
      inputRange,
      outputRange:
        effect === 'rotate'
          ? ['15deg', '0deg', '-15deg']
          : ['0deg', '0deg', '0deg'],
      extrapolate: 'clamp',
    });

    const offsetX = scrollX.interpolate({
      inputRange,
      outputRange: effect === 'stack' ? [28, 0, -28] : [0, 0, 0],
      extrapolate: 'clamp',
    });

    const imageCount = Array.isArray(item.images) ? item.images.length : 0;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onItemPress?.(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: ITEM_WIDTH,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: SPACING / 2,
        }}
      >
        <Animated.View
          style={[
            styles.itemContainer,
            {
              transform: [{ translateX: offsetX }, { translateY }, { scale }],
              opacity,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.card,
              effect === 'rotate'
                ? { transform: [{ perspective: 1000 }, { rotateY }] }
                : {},
            ]}
          >
            <Animated.Image
              source={imageSource}
              style={[
                styles.image,
                { transform: [{ translateX: imageTranslateX }] },
              ]}
              resizeMode='cover'
            />

            {/* image count badge */}
            {imageCount > 1 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{imageCount}</Text>
              </View>
            )}

            {/* title & price overlay */}
            {item.name ? <Text style={styles.title}>{item.name}</Text> : null}
            {typeof item.price === 'number' ? (
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            ) : null}
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const Dot = ({ idx }: { idx: number }) => {
    const inputRange = [
      (idx - 1) * ITEM_WIDTH,
      idx * ITEM_WIDTH,
      (idx + 1) * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1.3, 0.85],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.45, 1, 0.45],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[styles.dot, { transform: [{ scale }], opacity }]}
      />
    );
  };

  return (
    <View style={styles.wrapper}>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.FlatList
          ref={flatRef}
          data={listData}
          keyExtractor={(it) => it.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate={Platform.OS === 'ios' ? 0.98 : 'fast'}
          bounces={false}
          contentContainerStyle={{ alignItems: 'center' }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: true,
            }
          )}
          scrollEventThrottle={16}
          renderItem={renderItem}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          {...flatListProps}
        />
      </TouchableWithoutFeedback>

      {showDots && (
        <View style={styles.pagination}>
          {data.map((_, i) => (
            <Dot key={`dot-${i}`} idx={i} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING / 2,
  },
  card: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '70%',
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.lightBlack,
    position: 'absolute',
    bottom: 36,
  },
  price: {
    position: 'absolute',
    bottom: 12,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.black,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 12,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: COLORS.specialText,
    marginHorizontal: 6,
  },
});
