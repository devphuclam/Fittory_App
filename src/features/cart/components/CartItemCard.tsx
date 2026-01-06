import React from 'react';
import { ICONS } from '../../../assets/images/icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { COLORS } from '../../../constants/color';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CartItemProps = {
  name?: string;
  attribute?: string;
  quantity?: number;
  illustration?: string | ImageSourcePropType;
  money?: number;
  lineItemId: string;
  onIncrease?: (lineItemId: string) => void;
  onDecrease?: (lineItemId: string, quantity: number) => void;
  readOnly?: boolean;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CartItemCard = ({
  name,
  attribute,
  quantity,
  illustration,
  money,
  lineItemId,
  onIncrease,
  onDecrease,
  readOnly,
}: CartItemProps) => {
  const imageSource: ImageSourcePropType =
    typeof illustration === 'string'
      ? ({ uri: illustration } as ImageSourcePropType)
      : (illustration as ImageSourcePropType);
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={{ width: '100%', height: '100%' }}>
          <Image
            style={styles.image}
            source={imageSource}
            resizeMode='cover'
          ></Image>
        </TouchableOpacity>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          padding: '2%',
        }}
      >
        <View style={styles.left}>
          <View>
            <Text
              style={{ fontWeight: '600', fontSize: 14, width: '100%' }}
              numberOfLines={2}
            >
              {name}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 12, color: COLORS.defaultShadow }}>
                {attribute ?? 'Default'}
              </Text>
            </View>

            <Text style={{ fontSize: 12, fontWeight: '600' }}>
              Quantity: {quantity}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>
              {(money ?? 0) * (quantity ?? 1)} €
            </Text>
          </View>
        </View>
        <View style={styles.right}>
          {!readOnly && (
            <>
              <TouchableOpacity onPress={() => onIncrease?.(lineItemId)}>
                <ICONS.plus width={20} height={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDecrease?.(lineItemId, quantity ?? 1)}
              >
                {quantity === 1 ? (
                  <ICONS.removecartitem
                    width={20}
                    height={20}
                    color={COLORS.red}
                  />
                ) : (
                  <ICONS.minus width={20} height={20} color={COLORS.red} />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: COLORS.darkShadow,
    borderWidth: 1,
    marginTop: '5%',
    width: '100%',
    height: 140,
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: COLORS.section,
  },
  imageContainer: {
    width: '35%', // chiếm 35% ngang (bạn chỉnh 30-40% tùy ý)
    height: '100%',
    borderRightWidth: 2,
    borderColor: COLORS.defaultShadow,
    alignItems: 'center',
  },
  image: {
    width: '100%', // ăn full theo container
    height: '100%', // ăn full theo container
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  left: {
    width: '70%',
    justifyContent: 'space-around',
    paddingLeft: '2%',
  },
  right: {
    alignItems: 'center',
    width: '30%',
    paddingVertical: '5%',
    justifyContent: 'space-between',
  },
});

export default CartItemCard;
