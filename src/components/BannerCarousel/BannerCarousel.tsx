import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { COLORS } from '../../constants/color';

const { width: screenWidth } = Dimensions.get('window');
// banner will be slightly narrower than screen so you see rounded edges & background
const BANNER_WIDTH = Math.round(screenWidth * 0.88);
const BANNER_HEIGHT = Math.round(BANNER_WIDTH * 0.8);

type Banner = {
  id: string;
  image: string; // url
};

const MOCK_BANNERS: Banner[] = [
  { id: '1', image: 'https://picsum.photos/1000/600?random=21' },
  { id: '2', image: 'https://picsum.photos/1000/600?random=22' },
  { id: '3', image: 'https://picsum.photos/1000/600?random=23' },
];

type Props = {
  banners?: Banner[];
  autoplay?: boolean;
  autoplayInterval?: number; // ms
  onPressBanner?: (item: Banner) => void;
};

export default function BannerCarousel({
  banners = MOCK_BANNERS,
  autoplay = true,
  autoplayInterval = 4000,
  onPressBanner,
}: Props) {
  const [index, setIndex] = useState(0);
  const flatRef = useRef<FlatList<Banner> | null>(null);
  const autoplayRef = useRef<number | null>(null);

  // update index when user scrolls
  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / BANNER_WIDTH);
    setIndex(newIndex);
  };

  // autoplay handling
  useEffect(() => {
    if (!autoplay || banners.length <= 1) return;
    autoplayRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1 >= banners.length ? 0 : prev + 1;
        // scroll to next
        flatRef.current?.scrollToOffset({
          offset: next * BANNER_WIDTH,
          animated: true,
        });
        return next;
      });
    }, autoplayInterval) as unknown as number;

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [autoplay, autoplayInterval, banners.length]);

  // if index changed programmatically (rare), ensure FlatList is scrolled — defensive
  useEffect(() => {
    flatRef.current?.scrollToOffset({
      offset: index * BANNER_WIDTH,
      animated: true,
    });
  }, [index]);

  const renderItem = useCallback(
    ({ item }: { item: Banner }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onPressBanner?.(item)}
          style={styles.cardWrapper}
        >
          <Image source={{ uri: item.image }} style={styles.bannerImage} />
        </TouchableOpacity>
      );
    },
    [onPressBanner]
  );

  return (
    <View style={styles.root}>
      <FlatList
        ref={flatRef}
        data={banners}
        horizontal
        pagingEnabled={false} // we snap using snapToInterval for centered card
        snapToInterval={BANNER_WIDTH}
        decelerationRate='fast'
        snapToAlignment='start'
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, i) => ({
          length: BANNER_WIDTH,
          offset: BANNER_WIDTH * i,
          index: i,
        })}
      />

      {/* dots */}
      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index ? styles.dotActive : undefined]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
  },
  listContent: {
    paddingHorizontal: (screenWidth - BANNER_WIDTH) / 2, // center first/last
  },
  cardWrapper: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    // shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    // elevation Android
    elevation: 6,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dots: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginHorizontal: 6,
  },
  dotActive: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: COLORS.specialText ?? '#F4A261',
  },
});
