// components/ImageCarousel.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Animated,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { COLORS } from '../../constants/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = Math.round(SCREEN_WIDTH * 0.8); // width for each image item
const DOT_SIZE = 8;
const DOT_SPACING = 8;

type ImageInput = string | ImageSourcePropType;

type Props = {
  images: ImageInput[]; // remote URI string or local require(...) / ImageSourcePropType
  autoplay?: boolean;
  autoplayInterval?: number;
  initialIndex?: number;
  showThumbnails?: boolean;
  onIndexChange?: (index: number) => void;
};

export default function ImageCarousel({
  images,
  autoplay = false,
  autoplayInterval = 3500,
  initialIndex = 0,
  showThumbnails = true,
  onIndexChange,
}: Props) {
  const listData = images;
  const scrollX = useRef(new Animated.Value(initialIndex * ITEM_WIDTH)).current;
  const flatRef = useRef<FlatList<any> | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const autoplayRef = useRef<number | null>(null);
  const isInteracting = useRef(false);

  // update activeIndex from scrollX
  useEffect(() => {
    const id = (scrollX as any).addListener(({ value }: { value: number }) => {
      const idx = Math.round(value / ITEM_WIDTH);
      if (idx !== activeIndex) {
        setActiveIndex(idx);
        onIndexChange?.(idx);
      }
    });
    return () => {
      if (id != null) (scrollX as any).removeListener(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, onIndexChange]);

  // autoplay
  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, activeIndex, images.length]);

  const startAuto = () => {
    stopAuto();
    autoplayRef.current = setInterval(() => {
      if (isInteracting.current) return;
      let next = activeIndex + 1;
      if (next >= images.length) next = 0;
      flatRef.current?.scrollToOffset({
        offset: next * SCREEN_WIDTH,
        animated: true,
      });
    }, autoplayInterval) as unknown as number;
  };

  const stopAuto = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const onScrollBeginDrag = () => {
    isInteracting.current = true;
    stopAuto();
  };
  const onScrollEndDrag = () => {
    // resume autoplay a short time after drag ends
    isInteracting.current = false;
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / ITEM_WIDTH);
    setActiveIndex(idx);
    onIndexChange?.(idx);
  };

  const renderItem = ({ item }: { item: ImageInput }) => {
    // build ImageSourcePropType safely
    const source: ImageSourcePropType =
      typeof item === 'string'
        ? ({ uri: item } as ImageSourcePropType)
        : (item as ImageSourcePropType);

    return (
      <View style={styles.imageWrapper}>
        <Image source={source} style={styles.image} resizeMode='contain' />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatRef}
        data={listData}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onScroll={onScroll}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        decelerationRate={Platform.OS === 'ios' ? 0.98 : 'fast'}
        initialScrollIndex={initialIndex}
      />

      {/* Pagination dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, i) => {
          const inputRange = [
            (i - 1) * ITEM_WIDTH,
            i * ITEM_WIDTH,
            (i + 1) * ITEM_WIDTH,
          ];
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });
          const dotScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1.6, 0.9],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  opacity: dotOpacity,
                  transform: [{ scale: dotScale }],
                },
              ]}
            />
          );
        })}
      </View>

      {/* Thumbnails */}
      {showThumbnails && (
        <View style={styles.thumbRow}>
          {images.map((img, i) => {
            const source: ImageSourcePropType =
              typeof img === 'string'
                ? ({ uri: img } as ImageSourcePropType)
                : (img as ImageSourcePropType);
            const isActive = i === activeIndex;
            return (
              <TouchableOpacity
                key={`thumb-${i}`}
                onPress={() =>
                  flatRef.current?.scrollToOffset({
                    offset: i * SCREEN_WIDTH,
                    animated: true,
                  })
                }
                activeOpacity={0.8}
                style={[styles.thumbWrap, isActive && styles.thumbActive]}
              >
                <Image
                  source={source}
                  style={styles.thumb}
                  resizeMode='cover'
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: Math.round(SCREEN_WIDTH * 0.6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: ITEM_WIDTH,
    height: '100%',
    borderColor: COLORS.defaultShadow,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: COLORS.section,
  },
  dotsContainer: {
    marginTop: SCREEN_WIDTH * 0.045,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE,
    backgroundColor: COLORS.specialText,
    marginHorizontal: DOT_SPACING / 2,
  },
  thumbRow: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  thumbWrap: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 6,
  },
  thumbActive: {
    borderColor: COLORS.specialText,
  },
  thumb: {
    width: 56,
    height: 56,
  },
});
