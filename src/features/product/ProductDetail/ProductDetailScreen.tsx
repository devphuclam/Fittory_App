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
import ExpandableSection from '../../../components/ExpandableSection/ExpandableSection';
import OptionSelector from '../../../components/OptionSelector/OptionSelector';
import { COLORS } from '../../../constants/color';
import { sampleProducts } from '../../../data/sampleProducts';
import { useMemo, useState } from 'react';
import RegularButton from '../../../components/RegularButton/RegularButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetail'
>;
const { width: screenWidth } = Dimensions.get('window');
const MAIN_CONTENT_WIDTH = Math.round(screenWidth * 0.8);

const ProductDetailScreen = ({ navigation }: ProductDetailProps) => {
  const [selectedColor, setSelectedColor] = useState('');
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const product = useMemo(
    () => sampleProducts.find((p) => p.id === productId),
    [productId]
  );

  const handleSelectOption = (opt: string) => {
    console.log('Selected: ', opt);
    setSelectedColor(opt);
  };

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
          label={product.name}
        />
        <View style={{ marginTop: screenWidth * 0.05 }}>
          <ImageCarousel
            images={product.images}
            autoplay={true}
            showThumbnails
          />
        </View>
        <View style={[styles.nameContainer, {}]}>
          <Text style={styles.nameText}>{product.name}</Text>
        </View>
        <View style={styles.mainContentContainer}>
          <ExpandableSection
            title='Description'
            content={product.description}
          />
          <ExpandableSection
            title='Product Information'
            content={product.productInformation}
          />
          <ExpandableSection
            title='Shipping & Return'
            content={product.shippingAndReturn}
          />
          <OptionSelector
            title='Choose Color'
            options={['Black', 'White', 'Red']}
            selected={selectedColor}
            onSelect={handleSelectOption}
          />
          <View style={styles.confirmSection}>
            <Text style={styles.priceText} numberOfLines={1}>
              {product.price}$
            </Text>
            <RegularButton
              label='Add to cart'
              buttonWidth={screenWidth * 0.8 * 0.35}
              onPress={() => {
                console.log(`Call 'create cart item' API`);
                navigation.navigate('MyCart');
              }}
            />
          </View>
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  scrollContent: {
    backgroundColor: COLORS.background,
    paddingBottom: 40,
  },
  nameContainer: {
    marginTop: screenWidth * 0.05,
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.lightBlack,
  },
  mainContentContainer: {
    width: MAIN_CONTENT_WIDTH,
    alignSelf: 'center',
    gap: 20,
    paddingVertical: 10,
  },
  confirmSection: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 32,
    fontWeight: 'bold',
    width: '50%',
    color: COLORS.success,
    marginLeft: screenWidth * 0.05,
    textDecorationLine: 'underline',
  },
});

export default ProductDetailScreen;
