import React, { useContext } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ICONS } from '../../assets/images/icons';
import { COLORS } from '../../constants/color';
import Appbar from '../../components/Appbar/Appbar';
import CartItemCard from './components/CartItemCard';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import { useEffect } from 'react';
import InputWithIcon from '../../components/Input/InputWithIcon';
import RegularButton from '../../components/RegularButton/RegularButton';
import RegularButtonWithIcon from '../../components/RegularButton/RegularButtonWithIcon';
import { CartContext } from '../../contexts/CartContext';
import {
  updateLineItem,
  removeLineItem,
  getCart,
} from '../../services/carts.service';

const { width: screenWidth } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'MyCart'>;

const MyCartScreen = ({ navigation }: Props) => {
  const cartContext = useContext(CartContext);

  if (!cartContext) return null;

  const { cart, setCart } = cartContext;
  if (!cart) {
    return (
      <View style={styles.container}>
        <Text>Your cart is empty</Text>
      </View>
    );
  }

  let discount: number = 0.05;
  const handleCheckoutButtonPressed = () => {
    navigation.navigate('Checkout');
  };

  const handleIncrease = async (lineItemId: string) => {
    if (!cart) return;

    const item = cart.items.find((i: any) => i.id === lineItemId);
    if (!item) return;

    try {
      const res = await updateLineItem(cart.id, lineItemId, item.quantity + 1);

      if (res?.data?.cart) {
        setCart(res.data.cart);
      }
    } catch (e) {
      console.error('Increase error', e);
    }
  };

  const handleDecrease = async (
    lineItemId: string,
    currentQuantity: number
  ) => {
    if (!cart) return;

    try {
      // quantity = 1 → remove item
      if (currentQuantity === 1) {
        await removeLineItem(cart.id, lineItemId);
        const refreshed = await getCart(cart.id);

        if (refreshed?.data?.cart) {
          setCart(refreshed.data.cart);
        }
      } else {
        const res = await updateLineItem(
          cart.id,
          lineItemId,
          currentQuantity - 1
        );

        if (res?.data?.cart) {
          setCart(res.data.cart);
        }
      }
    } catch (e) {
      console.error('Decrease error', e);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Appbar
          style={{ marginTop: '10%', width: '80%', alignSelf: 'center' }}
          label='My Cart'
          returnable={true}
        />
        <View style={styles.bodyContainer}>
          <Text style={styles.totalText}> Total: {cart.items.length}</Text>
          {cart.items.map((item: any) => {
            const attribute = item.variant_title ?? 'Default';
            return (
              <CartItemCard
                key={item.id}
                lineItemId={item.id}
                name={item.title}
                quantity={item.quantity}
                illustration={item.thumbnail}
                money={item.unit_price}
                attribute={attribute}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
              />
            );
          })}

          <View style={styles.voucherSection}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <InputWithIcon
                inputWidth={screenWidth * 0.8 * 0.7}
                inputHeight={40}
                placeholder='Enter Voucher'
                icon={ICONS.voucher}
                inputStyles={{ fontSize: 16 }}
              ></InputWithIcon>
              <View>
                <RegularButton label='Apply'></RegularButton>
              </View>
            </View>
            <Text style={{ marginLeft: '5%', marginTop: '1%' }}>
              This is confirm voucher
            </Text>
          </View>
          <View style={styles.moneySumSection}>
            <View
              style={{
                width: '50%',
                height: 100,
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingRight: '10%',
              }}
            >
              <Text>Subtotal:</Text>
              <Text>Discount:</Text>
            </View>
            <View
              style={{
                width: '50%',
                height: 100,
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingRight: 0,
              }}
            >
              <Text>{cart.total} €</Text>
              <Text>{discount * 100}%</Text>
            </View>
          </View>
          <View style={styles.lastPriceSection}>
            <View
              style={{
                width: '50%',
                height: 'auto',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                paddingLeft: '10%',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Total:</Text>
            </View>

            <View
              style={{
                width: '50%',
                height: 'auto',
                justifyContent: 'space-around',
                alignItems: 'flex-end',
                paddingRight: '10%',
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: COLORS.success,
                  textDecorationLine: 'underline',
                }}
              >
                {cart.total * (1 - discount)} €
              </Text>
            </View>
          </View>
          <RegularButtonWithIcon
            label=' Proceed to Checkout'
            icon={ICONS.shoppingbag}
            onPress={handleCheckoutButtonPressed}
          />
        </View>
      </ScrollView>
      <BottomNavBar activeTab='Cart' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  scrollContent: {
    backgroundColor: COLORS.background,
    flexGrow: 1,
    minHeight: Dimensions.get('window').height,
    paddingBottom: 40,
  },
  bodyContainer: {
    paddingTop: '10%',
    width: '80%',
    alignSelf: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  voucherSection: {
    marginTop: '10%',
    width: '100%',
    height: 'auto',
  },
  moneySumSection: {
    flexDirection: 'row',
    marginTop: '10%',
    width: '100%',
    height: 'auto',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  lastPriceSection: {
    paddingVertical: '10%',
    width: '100%',
    flexDirection: 'row',
    height: 'auto',
  },
});

export default MyCartScreen;
