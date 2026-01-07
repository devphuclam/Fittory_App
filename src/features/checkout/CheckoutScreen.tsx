import React, { useEffect, useContext } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Appbar from '../../components/Appbar/Appbar';
import { COLORS } from '../../constants/color';
import InputWithIcon from '../../components/Input/InputWithIcon';
import RegularButtonWithIcon from '../../components/RegularButton/RegularButtonWithIcon';
import { ICONS } from '../../assets/images/icons';
import { useState } from 'react';
import { updateCartAddress } from '../../services/carts.service';
import { CartContext } from '../../contexts/CartContext';
import {
  getShippingOptions,
  addShippingMethod,
  completeCart,
} from '../../services/carts.service';
import {
  createPaymentCollection,
  initializePaymentSession,
} from '../../services/payments.service';

const { width: screenWidth } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;
type RadioButtonOption = {
  id: string;
  label: string;
  price?: number;
};

const RadioButtonGroup = ({
  options,
  selected,
  onSelect,
}: {
  options: RadioButtonOption[];
  selected: RadioButtonOption;
  onSelect: (options: RadioButtonOption) => void;
}) => {
  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.radioOption}
          onPress={() => onSelect(option)}
        >
          {/* vòng tròn ngoài */}
          <View style={styles.outerCircle}>
            {selected.id === option.id && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.radioLabel}>{option.label}</Text>
          {option.price !== undefined && (
            <Text style={[styles.radioLabel, { marginLeft: 'auto' }]}>
              €{option.price.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const CheckoutScreen = () => {
  const [shippingAddress, setShippingAddress] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_1: '',
    city: '',
    postal_code: '',
    province: '',
    country_code: '',
    company: '',
  });

  const cartContext = useContext(CartContext);

  if (!cartContext) return null;

  const { cart, setCart } = cartContext;

  const navigation = useNavigation<NavigationProp>();
  const [loadingOrder, setLoadingOrder] = useState(false);

  const countryOptions: RadioButtonOption[] = cart.region.countries.map(
    (c: { iso_2: string; display_name: string }) => ({
      id: c.iso_2, // 'fr'
      label: c.display_name, // 'France'
    })
  );

  const [selectedCountry, setSelectedCountry] = useState<RadioButtonOption>(
    countryOptions[0]
  );
  const [editable, setEditable] = useState(true);
  if (!cart) {
    return (
      <View style={styles.container}>
        <Text>Your cart is empty</Text>
      </View>
    );
  }
  const handleSaveAddress = async () => {
    if (!cart) return;

    try {
      const res = await updateCartAddress(cart.id, shippingAddress);
      if (res?.data?.cart) {
        setCart(res.data.cart);
        setEditable(false);
      }
    } catch (e) {
      console.error('Save address error', e);
    }
  };

  const handleEditAddress = () => {
    setEditable(true);
  };

  const [deliveryService, setDeliveryService] = useState<RadioButtonOption>({
    id: '0',
    label: 'No delivery service selected',
    price: 0,
  });
  const [paymentMethod, setPaymentMethod] = useState<RadioButtonOption>({
    id: '0',
    label: 'No payment method selected',
  });

  const [shippingOptions, setShippingOptions] = useState<RadioButtonOption[]>(
    []
  );

  useEffect(() => {
    if (!cart?.shipping_address?.country_code) return;

    getShippingOptions(cart.id).then((res) => {
      const options = res?.data.shipping_options.map((opt: any) => ({
        id: opt.id,
        label: opt.name,
        price: opt.amount, // nếu backend dùng cents
      }));
      setShippingOptions(options);
    });
  }, [cart?.shipping_address]);

  useEffect(() => {
    setShippingAddress((prev) => ({
      ...prev,
      country_code: selectedCountry.id, // lowercase, Medusa OK
    }));
  }, [selectedCountry]);

  useEffect(() => {
    if (!cart?.shipping_methods?.length) return;
    if (cart.payment_collection_id) return;

    createPaymentCollection(cart.id).then((res) => {
      if (res?.data?.payment_collection) {
        setCart((prev: typeof cart) => ({
          ...prev!,
          payment_collection_id: res.data.payment_collection.id,
        }));
      }
    });
  }, [cart?.shipping_methods]);

  const handleSelectShipping = async (option: RadioButtonOption) => {
    if (!cart) return;

    setDeliveryService(option);

    const res = await addShippingMethod(cart.id, option.id);
    if (res?.data?.cart) {
      setCart(res.data.cart);
      console.log('Cart Total: ', cart.total);
    }
  };

  const handleSelectPaymentMethod = async (option: RadioButtonOption) => {
    if (!cart?.payment_collection_id) return;

    setPaymentMethod(option);

    const res = await initializePaymentSession(
      cart.payment_collection_id,
      option.id
    );

    if (res?.data?.payment_collection) {
      setCart((prev: typeof cart) => ({
        ...prev!,
        payment_collection: res.data.payment_collection,
      }));
    }
  };

  const AVAILABLE_PAYMENT_PROVIDERS: RadioButtonOption[] = [
    { id: 'pp_system_default', label: 'Cash on Delivery', price: 0 },
  ];

  const handlePlaceOrder = async () => {
    if (!cart) return;

    try {
      setLoadingOrder(true);

      const res = await completeCart(cart.id); // gọi API completeCart

      if (res?.data?.order) {
        console.log('Order created:', res.data.order);

        navigation.navigate('OrderDetail', {
          orderId: res.data.order.id,
        });
      }
    } catch (err) {
      console.error('Place order error:', err);
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Appbar
          style={{ marginTop: '15%', width: '80%', alignSelf: 'center' }}
          label='Checkout'
          returnable={true}
        />
        <View style={styles.bodyContainer}>
          <Text style={styles.titleText}>Shipping Address</Text>
          <View style={styles.shippingAddressSection}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={styles.left}>
                <Text style={styles.subTitleText}>First Name</Text>
                <InputWithIcon
                  inputStyles={styles.TextInputStyle}
                  containerStyles={styles.inputStyle}
                  icon={null}
                  placeholder='First Name'
                  value={shippingAddress.first_name}
                  onChangeText={(text) =>
                    setShippingAddress({ ...shippingAddress, first_name: text })
                  }
                  editable={editable}
                />
                <Text style={styles.subTitleText}> Phone Number</Text>
                <InputWithIcon
                  inputStyles={styles.TextInputStyle}
                  containerStyles={styles.inputStyle}
                  icon={null}
                  placeholder='Phone Number'
                  value={shippingAddress.phone}
                  onChangeText={(text) =>
                    setShippingAddress({ ...shippingAddress, phone: text })
                  }
                  editable={editable}
                />
                <Text style={styles.subTitleText}> Postal Code</Text>
                <InputWithIcon
                  inputStyles={styles.TextInputStyle}
                  containerStyles={styles.inputStyle}
                  icon={null}
                  placeholder='Postal Code'
                  value={shippingAddress.postal_code}
                  onChangeText={(text) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postal_code: text,
                    })
                  }
                  editable={editable}
                />
                <Text style={styles.subTitleText}>State/Province</Text>
                <InputWithIcon
                  inputStyles={styles.TextInputStyle}
                  containerStyles={styles.inputStyle}
                  icon={null}
                  placeholder='State/Province'
                  value={shippingAddress.province}
                  onChangeText={(text) =>
                    setShippingAddress({ ...shippingAddress, province: text })
                  }
                  editable={editable}
                />
              </View>
              <View style={styles.right}>
                <Text style={styles.subTitleText}>Last Name</Text>
                <InputWithIcon
                  inputStyles={styles.TextInputStyle}
                  containerStyles={styles.inputStyle}
                  icon={null}
                  placeholder='Last Name'
                  value={shippingAddress.last_name}
                  onChangeText={(text) =>
                    setShippingAddress({ ...shippingAddress, last_name: text })
                  }
                  editable={editable}
                />
                <Text style={styles.subTitleText}>Company</Text>
                <InputWithIcon
                  inputStyles={styles.TextInputStyle}
                  containerStyles={styles.inputStyle}
                  icon={null}
                  placeholder='Company'
                  value={shippingAddress.company}
                  onChangeText={(text) =>
                    setShippingAddress({ ...shippingAddress, company: text })
                  }
                  editable={editable}
                />
                <Text style={styles.subTitleText}>City</Text>
                <InputWithIcon
                  inputStyles={styles.TextInputStyle}
                  containerStyles={styles.inputStyle}
                  icon={null}
                  placeholder='City'
                  value={shippingAddress.city}
                  onChangeText={(text) =>
                    setShippingAddress({ ...shippingAddress, city: text })
                  }
                  editable={editable}
                />
              </View>
            </View>
            <Text style={[styles.subTitleText, { marginLeft: '5%' }]}>
              Address
            </Text>
            <InputWithIcon
              icon={null}
              placeholder='Address'
              value={shippingAddress.address_1}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, address_1: text })
              }
              editable={editable}
            />
            <Text style={[styles.subTitleText, { marginLeft: '5%' }]}>
              Country/Region
            </Text>
            <RadioButtonGroup
              options={countryOptions}
              selected={selectedCountry}
              onSelect={setSelectedCountry}
            />
          </View>
          {editable ? (
            <RegularButtonWithIcon
              label='Save Address'
              icon={ICONS.tick}
              onPress={handleSaveAddress}
              containerStyles={{ marginTop: '5%' }}
            />
          ) : (
            <RegularButtonWithIcon
              label='Edit Address'
              icon={ICONS.access}
              onPress={handleEditAddress}
              containerStyles={{ marginTop: '5%' }}
            />
          )}

          <Text style={styles.titleText}>Delivery Service</Text>
          <View
            style={[
              styles.deliveryServiceSection,
              { alignItems: 'center', justifyContent: 'center' },
            ]}
          >
            <RadioButtonGroup
              options={shippingOptions}
              selected={deliveryService}
              onSelect={handleSelectShipping}
            />
          </View>
          <Text style={styles.titleText}>Payment Method</Text>
          <View style={styles.paymentMethodSection}>
            <RadioButtonGroup
              options={AVAILABLE_PAYMENT_PROVIDERS}
              selected={paymentMethod}
              onSelect={handleSelectPaymentMethod}
            />
          </View>
          <RegularButtonWithIcon
            label=' Place Order'
            icon={ICONS.order}
            onPress={handlePlaceOrder}
          />
        </View>
      </ScrollView>
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
    width: '95%',
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '5%',
    marginTop: '10%',
    color: COLORS.lightBlack,
  },
  shippingAddressSection: {
    marginTop: '3%',
    width: '100%',
    height: 'auto',
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    borderRadius: 20,
    backgroundColor: COLORS.section,
    paddingHorizontal: '3%',
    paddingVertical: '5%',
  },
  left: {
    width: '47%',
  },
  right: {
    width: '47%',
  },
  inputStyle: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextInputStyle: {
    fontSize: 14,
  },
  subTitleText: {
    fontSize: 12,
    color: COLORS.darkShadow,
    marginTop: '5%',
    marginLeft: '10%',
  },
  deliveryServiceSection: {
    marginTop: '3%',
    width: '100%',
    height: 'auto',
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    borderRadius: 20,
    backgroundColor: COLORS.section,
    paddingHorizontal: '3%',
    paddingVertical: '5%',
  },
  paymentMethodSection: {
    marginTop: '3%',
    width: '100%',
    height: 'auto',
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    borderRadius: 20,
    backgroundColor: COLORS.section,
    paddingHorizontal: '3%',
    paddingVertical: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10%',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
    borderRadius: 10,
    padding: 10,
    width: '90%',
    backgroundColor: COLORS.white,
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lightBlack,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.lightBlack,
  },
  radioLabel: {
    fontSize: 14,
    color: COLORS.lightBlack,
  },
});
export default CheckoutScreen;
