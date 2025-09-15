import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { COLORS } from '../../constants/color';
import { IMAGES } from '../../assets/images';
import RegularButton from '../RegularButton/RegularButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CARD_WIDTH = screenWidth * 0.4;
const IMAGE_HEIGHT = CARD_WIDTH * 0.6;
const CARD_HEIGHT =
  IMAGE_HEIGHT +
  16 /*padding top/bottom*/ +
  48 /*title area*/ +
  24 /*price*/ +
  40; /*button*/

type ProductCardProps = {
  onPress?: () => void;
  productId: string; // ← thêm productId
  productName?: string;
  productPrice?: number;
  productImage?: ImageSourcePropType;
};

const ProductCard = ({
  productId,
  productName = 'No name',
  productPrice = 0,
  productImage,
}: ProductCardProps) => {
  const navigation = useNavigation<NavigationProp>();

  // default hành vi: đi tới ProductDetail với productId
  const goToDetail = () => {
    // if (!productId) {
    //   console.warn(
    //     'ProductCard: missing productId, cannot navigate to ProductDetail'
    //   );
    //   return;
    // }
    navigation.navigate('ProductDetail', { productId: productId });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={goToDetail} // bấm vào card cũng navigate
      activeOpacity={0.8}
    >
      <Image
        style={styles.image}
        source={productImage || IMAGES.sampleHeadphone}
        resizeMode='cover'
      />

      <View style={styles.titleWrapper}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
          {productName}
        </Text>
      </View>

      <Text style={styles.price}>€{productPrice}</Text>

      <RegularButton
        label='Details'
        buttonWidth={screenWidth * 0.3}
        buttonHeight={screenWidth * 0.3 * 0.25}
        onPress={goToDetail} // nút Details cũng navigate mặc định
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.transparentWhite,
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    borderRadius: 12,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: 8,
    marginBottom: 8,
  },
  titleWrapper: {
    minHeight: 44,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.lightBlack,
  },
});

export default ProductCard;
