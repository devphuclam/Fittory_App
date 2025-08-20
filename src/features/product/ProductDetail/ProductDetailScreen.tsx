import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Dimensions,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/AppNavigator';
import Appbar from '../../../components/Appbar/Appbar';
import BottomNavBar from '../../../components/BottomNavBar/BottomNavBar';
import ProductCarousel from '../../../components/ProductCarousel/ProductCarousel';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import { COLORS } from '../../../constants/color';
import { sampleProducts } from '../../../data/sampleProducts';
import { useMemo } from 'react';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
const { width: screenWidth } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const product = useMemo(
    () => sampleProducts.find((p) => p.id === productId),
    [productId]
  );

  if (!product) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Appbar
          style={{ width: '80%', marginTop: '10%', alignSelf: 'center' }}
          returnable={true}
          label={productId}
        />
        <View style={{ marginTop: screenWidth * 0.05 }}>
          <ImageCarousel
            images={product.images}
            autoplay={true}
            showThumbnails
          />
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  scrollContent: {
    backgroundColor: COLORS.background,
    paddingBottom: 40,
  },
});

export default ProductDetailScreen;
