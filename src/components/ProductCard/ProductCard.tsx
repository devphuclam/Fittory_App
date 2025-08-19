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

const { width: screenWidth } = Dimensions.get('window');

// Tùy chỉnh: card width và height chuẩn
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
  productName?: string;
  productPrice?: number;
  productImage?: ImageSourcePropType;
};

const ProductCard = ({
  productName = 'No name',
  productPrice = 0,
  productImage,
  onPress,
}: ProductCardProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.5}
    >
      <Image
        style={styles.image}
        source={productImage || IMAGES.sampleHeadphone}
        resizeMode='cover'
      />

      {/* Title area: fixed minHeight để giữ chỗ */}
      <View style={styles.titleWrapper}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode='tail'>
          {productName}
        </Text>
      </View>

      <Text style={styles.price}>${productPrice}</Text>

      <RegularButton
        label='Details'
        buttonWidth={screenWidth * 0.3}
        buttonHeight={screenWidth * 0.3 * 0.25}
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
    justifyContent: 'space-between', // giữ các phần đều khoảng
    alignItems: 'center',
    marginRight: 12, // khoảng cách giữa các card
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: 8,
    marginBottom: 8,
  },
  titleWrapper: {
    // đảm bảo vùng title luôn chiếm chỗ (ghi 2 dòng)
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
