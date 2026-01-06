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
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';
import ExpandableSection from '../../../components/ExpandableSection/ExpandableSection';
import OptionSelector from '../../../components/OptionSelector/OptionSelector';
import { COLORS } from '../../../constants/color';
import { useMemo, useState, useContext, useEffect } from 'react';
import RegularButton from '../../../components/RegularButton/RegularButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductService } from '../../../services';
import { RegionContext } from '../../../contexts/RegionContext';
import { createCart, addItemToCart } from '../../../services/carts.service';
import { CartContext } from '../../../contexts/CartContext';

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

  const { cart, setCart } = useContext(CartContext)!;

  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from Medusa backend
    if (!region?.id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProduct(productId, region?.id);
        if (response && response.data) {
          setProduct(response.data.product);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, region?.id]);

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
      return `${selectedVariant.calculated_price.calculated_amount.toFixed(
        2
      )} €`;
    }

    if (product?.variants?.length) {
      const prices = product.variants
        .map((v: any) => v.calculated_price?.calculated_amount)
        .filter((p: number | null | undefined) => p != null);

      if (prices.length) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        if (min === max) {
          return `${min.toFixed(2)} €`;
        } else {
          return `${min.toFixed(2)} - ${max.toFixed(2)} €`;
        }
      }
    }

    return 'No price';
  }, [selectedVariant, product]);

  const infoSource = selectedVariant ?? product;

  const productInformationNode = useMemo(() => {
    if (!infoSource) return null;

    const info = [
      { label: 'Height', value: infoSource.height, unit: 'cm' },
      { label: 'Width', value: infoSource.width, unit: 'cm' },
      { label: 'Length', value: infoSource.length, unit: 'cm' },
      { label: 'Weight', value: infoSource.weight, unit: 'g' },
      {
        label: 'Country of origin',
        value: (
          infoSource.origin_country || product.origin_country
        )?.toUpperCase(),
      },
    ].filter((i) => i.value != null && i.value !== '');

    if (!info.length) {
      return <Text>No product information available.</Text>;
    }

    return (
      <View style={{ gap: 8, marginBottom: 24 }}>
        {info.map((item) => (
          <View
            key={item.label}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontWeight: '600', color: COLORS.lightBlack }}>
              {item.label}
            </Text>
            <Text style={{ color: COLORS.black }}>
              {item.value}
              {item.unit ? ` ${item.unit}` : ''}
            </Text>
          </View>
        ))}
      </View>
    );
  }, [infoSource, product]);

  const shippingAndReturnNode = (
    <View style={{ gap: 12 }}>
      <View>
        <Text style={{ fontWeight: '700', marginBottom: 4 }}>
          Fast delivery
        </Text>
        <Text>
          Your package will arrive in 3-5 business days at your pick up location
          or in the comfort of your home.
        </Text>
      </View>

      <View>
        <Text style={{ fontWeight: '700', marginBottom: 4 }}>
          Simple exchanges
        </Text>
        <Text>
          Is the fit not quite right? No worries – we’ll exchange your product
          for a new one.
        </Text>
      </View>
    </View>
  );

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
            content={productInformationNode}
          />
          <ExpandableSection
            title='Shipping & Return'
            content={shippingAndReturnNode}
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
              onPress={async () => {
                if (!selectedVariant) {
                  alert('Please select all options first');
                  return;
                }

                if (!region?.id) {
                  alert('Region not available');
                  return;
                }

                try {
                  let activeCart = cart;

                  if (!activeCart) {
                    const res = await createCart(region.id);
                    activeCart = res?.data.cart;
                    setCart(activeCart);
                  }

                  const updated = await addItemToCart(
                    activeCart.id,
                    selectedVariant,
                    1
                  );

                  setCart(updated?.data.cart);
                  navigation.navigate('MyCart');
                } catch (error) {
                  console.error('Add to cart failed', error);
                  alert('Add to cart failed');
                }
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
