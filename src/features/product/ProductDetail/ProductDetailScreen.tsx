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
import { useMemo, useState, useContext, useEffect } from 'react';
import RegularButton from '../../../components/RegularButton/RegularButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductService } from '../../../services';
import { RegionContext } from '../../../contexts/RegionContext';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetail'
>;
const { width: screenWidth } = Dimensions.get('window');
const MAIN_CONTENT_WIDTH = Math.round(screenWidth * 0.8);

const ProductDetailScreen = ({ navigation }: ProductDetailProps) => {
  const regionContext = useContext(RegionContext);
  const { region } = regionContext || {}; // luôn khai báo hook trước

  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from Medusa backend
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProduct(productId, region?.id);
        if (response && response.data) {
          console.log('Product detail: ', response.data.product);
          setProduct(response.data.product);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // state lưu option selections
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // chọn option
  const handleSelectOption = (optionId: string, valueId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: valueId }));
  };

  // tìm variant khớp
  const selectedVariant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find((variant: any) =>
      variant.options.every((o: any) => selectedOptions[o.option_id] === o.id)
    );
  }, [product, selectedOptions]);

  // giá (nếu variant được chọn)
  const price = selectedVariant?.calculated_price?.calculated_amount;

  // lấy giá hiển thị
  const displayPrice = useMemo(() => {
    if (selectedVariant?.calculated_price) {
      return `${selectedVariant.calculated_price.calculated_amount.toFixed(2)}`;
    }

    if (product?.variants?.length) {
      const prices = product.variants
        .map((v: any) => v.calculated_price?.calculated_amount)
        .filter((p: number | null | undefined) => p != null);

      if (prices.length) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        if (min === max) {
          return `${min.toFixed(2)}`;
        } else {
          return `${min.toFixed(2)} - ${max.toFixed(2)} `;
        }
      }
    }

    return 'No price';
  }, [selectedVariant, product]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  if (!region) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No region available</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Appbar
          style={{ width: '80%', marginTop: '10%', alignSelf: 'center' }}
          returnable={true}
          label={product.title}
        />
        <View style={{ marginTop: screenWidth * 0.05 }}>
          <ImageCarousel
            images={product.images.map((img: any) => img.url)}
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
            content={product.description}
          />
          <ExpandableSection
            title='Shipping & Return'
            content={product.description}
          />

          {product.options?.map((opt: any) => (
            <OptionSelector
              key={opt.id}
              title={opt.title}
              options={opt.values.map((v: any) => ({
                id: v.id,
                label: v.value,
              }))}
              selected={selectedOptions[opt.id] || null}
              onSelect={(id, label) =>
                setSelectedOptions((prev) => ({ ...prev, [opt.id]: id }))
              }
            />
          ))}

          <View style={styles.confirmSection}>
            <Text style={styles.priceText} numberOfLines={1}>
              {/* {displayPrice} */}
              {selectedVariant?.calculated_price
                ? `${selectedVariant.calculated_price.calculated_amount.toFixed(
                    2
                  )} €`
                : displayPrice}
            </Text>
            <RegularButton
              label='Add to cart'
              buttonWidth={screenWidth * 0.8 * 0.35}
              onPress={() => {
                if (!selectedVariant) {
                  alert('Please select all options first');
                  return;
                }
                console.log('Add to cart variant', selectedVariant.id);
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
    fontSize: 16,
    fontWeight: 'bold',
    width: '50%',
    color: COLORS.success,
    marginLeft: screenWidth * 0.05,
    textDecorationLine: 'underline',
  },
});

export default ProductDetailScreen;
