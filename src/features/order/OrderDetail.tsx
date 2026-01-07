import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../../constants/color';
import { ICONS } from '../../assets/images/icons';
import CartItemCard from '../cart/components/CartItemCard';
import ConfirmButton from '../../components/ConfirmButton/ConfirmButton';
import ExpandableSection from '../../components/ExpandableSection/ExpandableSection';
import Appbar from '../../components/Appbar/Appbar';
import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { getOrder } from '../../services/orders.service';
import QRCode from 'react-native-qrcode-svg';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MEDUSA_BASE_URL } from '../../config';

const { width: screenWidth } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const OrderDetail = ({ route }: Props) => {
  const { orderId } = route.params;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  const handleCreateQR = () => {
    setShowQR(true);
  };

  useEffect(() => {
    setLoading(true);
    getOrder(orderId)
      .then((res) => {
        setOrder(res.order);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const qrRef = useRef<View>(null);
  const [qrToken, setQrToken] = useState<string>('');

  useEffect(() => {
    // tạo token 1 lần khi load order
    if (order) {
      setQrToken(uuidv4());
      console.log('QR Token generated:', qrToken);
    }
  }, [order]);

  const qrValue = order
    ? `${MEDUSA_BASE_URL}/api/orders/${order.id}/pay?token=${qrToken}`
    : '';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Appbar
          style={{ marginTop: '15%', width: '85%', alignSelf: 'center' }}
          label='Order Detail'
          returnable={true}
        />
        <View style={styles.bodyContainer}>
          <Text>
            ORDER ID: {orderId.slice(0, 6)}...{orderId.slice(-6)}
          </Text>
          {loading && <Text>Loading...</Text>}
          {order?.items.map((item: any) => {
            const title = item.title || item.detail?.item?.title || 'No title';
            const quantity = item.quantity ?? item.detail?.quantity ?? 0;
            const money = item.unit_price ?? item.detail?.unit_price ?? 0;
            const illustration =
              item.thumbnail || item.detail?.item?.thumbnail || ICONS.profile;
            console.log('Order Item: ', {
              title,
              quantity,
              money,
              illustration,
            });
            return (
              <CartItemCard
                key={item.id}
                lineItemId={item.id}
                name={title}
                readOnly={true}
                quantity={quantity}
                money={money}
                illustration={illustration}
                attribute={item.variant_title || 'Default'}
              />
            );
          })}
          {order && (
            <>
              <ExpandableSection
                title='Delivery'
                content={
                  <View style={{ gap: 6 }}>
                    <View
                      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}
                    >
                      <Text style={{ fontWeight: '600' }}>Name:</Text>
                      <Text>
                        {order.shipping_address.first_name}{' '}
                        {order.shipping_address.last_name}
                      </Text>
                    </View>

                    <View
                      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}
                    >
                      <Text style={{ fontWeight: '600' }}>Address:</Text>
                      <Text>
                        {order.shipping_address.address_1}
                        {order.shipping_address.address_2
                          ? ', ' + order.shipping_address.address_2
                          : ''}
                        ,{order.shipping_address.city},{' '}
                        {order.shipping_address.province}{' '}
                        {order.shipping_address.postal_code},
                        {order.shipping_address.country_code}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <Text style={{ fontWeight: '600' }}>Phone:</Text>
                      <Text>{order.shipping_address.phone}</Text>
                    </View>
                  </View>
                }
              />
              <ExpandableSection
                title='Order Summary'
                content={
                  <View style={{ gap: 4 }}>
                    <Text>Items Subtotal: €{order.item_total}</Text>
                    <Text>Shipping: €{order.shipping_total}</Text>
                    <Text>Discount: €{order.discount_total}</Text>
                    <Text>Tax: €{order.tax_total}</Text>
                    <Text style={{ fontWeight: '600', marginTop: 4 }}>
                      Total: €{order.total}
                    </Text>
                    <Text>Payment Status: {order.payment_status}</Text>
                  </View>
                }
              />
            </>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <ConfirmButton
            label='Create Bill QR Code'
            buttonWidth={screenWidth * 0.9}
            buttonHeight={50}
            containerStyle={styles.button}
            onPress={handleCreateQR}
          ></ConfirmButton>
        </View>
        {showQR && (
          <View
            style={{ alignItems: 'center', marginTop: 20, marginBottom: 40 }}
          >
            <View ref={qrRef} style={{ padding: 10, backgroundColor: 'white' }}>
              <QRCode value={qrValue} size={150} />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    backgroundColor: COLORS.background,
    flexGrow: 1,
    minHeight: Dimensions.get('window').height,
  },
  bodyContainer: {
    paddingTop: '10%',
    width: '90%',
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: '10%',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.specialText,
  },
  label: {
    fontWeight: '500',
    color: COLORS.specialText,
    marginBottom: 4,
  },
  value: {
    fontWeight: '400',
    color: COLORS.info,
  },
});

export default OrderDetail;
