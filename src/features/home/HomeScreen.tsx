import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/color';
import Appbar from '../../components/Appbar/Appbar';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import BannerCarousel from '../../components/BannerCarousel/BannerCarousel';
import { sampleProducts } from '../../data/sampleProducts';
import { ImageSourcePropType } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// sample products

// Tính chiều cao section dựa vào ProductCard (đảm bảo khớp với ProductCard)
const CARD_WIDTH = screenWidth * 0.4;
const CARD_IMAGE_HEIGHT = CARD_WIDTH * 0.6;
const CARD_TOTAL_HEIGHT = CARD_IMAGE_HEIGHT + 16 + 48 + 24 + 40; // (image + paddings + title area + price + button)
const SECTION_VERTICAL_PADDING = 50;
const SECTION_HEIGHT = Math.round(CARD_TOTAL_HEIGHT + SECTION_VERTICAL_PADDING); // pixel height cho section

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Appbar
          label='Home'
          style={{ width: '80%', marginTop: '10%', alignSelf: 'center' }}
        />
        {/* Banner Section */}
        {/* banner */}
        <BannerCarousel
          banners={[
            { id: 'a', image: 'https://picsum.photos/1000/600?random=11' },
            { id: 'b', image: 'https://picsum.photos/1000/600?random=12' },
            { id: 'c', image: 'https://picsum.photos/1000/600?random=13' },
          ]}
          autoplay
          autoplayInterval={4500}
          onPressBanner={(b) => console.log('Pressed banner', b.id)}
        />
        {/* -- Section 1: Perfect Deals -- */}
        <View style={styles.group}>
          <Text style={[styles.textSection, { marginLeft: 20 }]}>
            Perfect Deals
          </Text>

          <View
            style={[styles.scrollSectionContainer, { height: SECTION_HEIGHT }]}
          >
            <FlatList
              data={sampleProducts}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const imageSource: ImageSourcePropType =
                  typeof item.images[1] === 'string'
                    ? { uri: item.images[1] }
                    : (item.images[1] as ImageSourcePropType);
                return (
                  <ProductCard
                    productName={item.name}
                    productPrice={item.price}
                    productImage={imageSource}
                    productId={item.id}
                  />
                );
              }}
              contentContainerStyle={styles.listContent}
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
            />
          </View>
        </View>

        {/* -- Section 2: Latest Drops (copyable safe) -- */}
        <View style={styles.group}>
          <Text style={[styles.textSection, { marginLeft: 20 }]}>
            Latest Drops
          </Text>

          <View
            style={[styles.scrollSectionContainer, { height: SECTION_HEIGHT }]}
          >
            <FlatList
              data={sampleProducts.slice().reverse()} // ví dụ khác nội dung
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const imageSource: ImageSourcePropType =
                  typeof item.images[1] === 'string'
                    ? { uri: item.images[1] }
                    : (item.images[1] as ImageSourcePropType);
                return (
                  <ProductCard
                    productName={item.name}
                    productPrice={item.price}
                    productImage={imageSource}
                    productId={item.id}
                  />
                );
              }}
              contentContainerStyle={styles.listContent}
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
            />
          </View>
        </View>

        {/* -- Section 3: Weekly Picks (copyable safe) -- */}
        <View style={styles.group}>
          <Text style={[styles.textSection, { marginLeft: 20 }]}>
            Weekly Picks
          </Text>

          <View
            style={[styles.scrollSectionContainer, { height: SECTION_HEIGHT }]}
          >
            <FlatList
              data={sampleProducts.slice().reverse()} // ví dụ khác nội dung
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const imageSource: ImageSourcePropType =
                  typeof item.images[1] === 'string'
                    ? { uri: item.images[1] }
                    : (item.images[1] as ImageSourcePropType);
                return (
                  <ProductCard
                    productName={item.name}
                    productPrice={item.price}
                    productImage={imageSource}
                    productId={item.id}
                  />
                );
              }}
              contentContainerStyle={styles.listContent}
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
            />
          </View>
        </View>
      </ScrollView>

      <BottomNavBar activeTab='Home' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  scrollContent: {
    backgroundColor: COLORS.background,
    paddingBottom: 40,
  },
  group: {
    marginTop: 24,
    alignSelf: 'center',
    width: '85%',
  },
  textSection: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.lightBlack,
  },
  scrollSectionContainer: {
    backgroundColor: COLORS.section,
    overflow: 'hidden',
    marginTop: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    borderRadius: 20,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center', // căn giữa card theo trục dọc
  },
});

export default HomeScreen;
