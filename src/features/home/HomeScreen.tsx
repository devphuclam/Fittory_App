import React, { useEffect, useState, useContext } from 'react';
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
import { ProductService } from '../../services';
import { RegionContext } from '../../contexts/RegionContext';

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
  const regionContext = useContext(RegionContext);
  if (!regionContext) {
    return <Text>No region available</Text>;
  }
  const { region } = regionContext;
  // Fetch products from Medusa backend
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    // Fetch products from Medusa backend
    const fetchProducts = async () => {
      if (!region?.id) return; // ⬅️ chặn khi region chưa load
      try {
        const response = await ProductService.listProducts(region?.id);
        if (response && response.data) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [region]);

  // Safe banners
  const banners =
    products.length >= 3
      ? [
          {
            id: 'a',
            image:
              products[0]?.thumbnail ||
              'https://picsum.photos/1000/600?random=11',
          },
          {
            id: 'b',
            image:
              products[1]?.thumbnail ||
              'https://picsum.photos/1000/600?random=12',
          },
          {
            id: 'c',
            image:
              products[2]?.thumbnail ||
              'https://picsum.photos/1000/600?random=13',
          },
        ]
      : [
          { id: 'a', image: 'https://picsum.photos/1000/600?random=11' },
          { id: 'b', image: 'https://picsum.photos/1000/600?random=12' },
          { id: 'c', image: 'https://picsum.photos/1000/600?random=13' },
        ];

  // 👉 Hàm shuffle nhỏ gọn
  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Trong HomeScreen
  const weeklyPicks = shuffleArray(products).slice(0, 4); // lấy 4 sp random

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
          banners={banners}
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
              data={products}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                // Lấy ảnh
                const imageSource: ImageSourcePropType = item.thumbnail
                  ? { uri: item.thumbnail }
                  : item.images?.[0]
                  ? { uri: item.images[0].url }
                  : (item.images[1] as ImageSourcePropType);
                // Lấy giá (variant đầu tiên)
                const price =
                  item.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
                return (
                  <ProductCard
                    productName={item.title}
                    productPrice={price}
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
              data={[...products].sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )} // ví dụ khác nội dung
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                // Lấy ảnh
                const imageSource: ImageSourcePropType = item.thumbnail
                  ? { uri: item.thumbnail }
                  : item.images?.[0]
                  ? { uri: item.images[0].url }
                  : (item.images[1] as ImageSourcePropType);
                // Lấy giá (variant đầu tiên)
                const price =
                  item.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
                return (
                  <ProductCard
                    productName={item.title}
                    productPrice={price}
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
              data={weeklyPicks} // ví dụ khác nội dung
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                // Lấy ảnh
                const imageSource: ImageSourcePropType = item.thumbnail
                  ? { uri: item.thumbnail }
                  : item.images?.[0]
                  ? { uri: item.images[0].url }
                  : (item.images[1] as ImageSourcePropType);
                // Lấy giá (variant đầu tiên)
                const price =
                  item.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
                return (
                  <ProductCard
                    productName={item.title}
                    productPrice={price}
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
    flexGrow: 1,
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
