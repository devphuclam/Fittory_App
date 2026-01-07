import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
} from 'react-native';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Appbar from '../../components/Appbar/Appbar';
import { COLORS } from '../../constants/color';
import { ICONS } from '../../assets/images/icons';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import InputWithIcon from '../../components/Input/InputWithIcon';
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown';
import { FilterOption } from '../../components/FilterDropdown/FilterDropdown';
import OrderCard from './components/OrderCard';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import { useMemo } from 'react';
import { getListOrder } from '../../services/orders.service';

const { width: screenWidth } = Dimensions.get('window');

type NavigationProp = NativeStackScreenProps<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;
const sortOptions: FilterOption[] = [
  { key: 'price', label: 'Price' },
  { key: 'date', label: 'Date' },
  { key: 'totalPrice', label: 'Total Price' },
];

const OrderScreen = ({ navigation }: Props) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getListOrder()
      .then((res) => {
        setOrders(res.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  let count = orders.length;
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [direction, setDirection] = useState<'asc' | 'desc' | null>('asc');

  const animate = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order: any) =>
      q ? (order.status || '').toLowerCase().includes(q) : true
    );
  }, [query, orders]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a: any, b: any) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      if (typeof av === 'string' || typeof bv === 'string') {
        const aS = String(av).toLowerCase();
        const bS = String(bv).toLowerCase();
        return direction === 'asc'
          ? aS.localeCompare(bS)
          : bS.localeCompare(aS);
      }
      return direction === 'asc' ? av - bv : bv - av;
    });
    return arr;
  }, [filtered, sortKey, direction]);

  const handleFilterSelect = (
    key: string | null,
    dir: 'asc' | 'desc' | null
  ) => {
    animate();
    setSortKey(key);
    setDirection(dir ?? 'asc');
  };
  const handleNavigateToDetail = (id: string) => {
    navigation.navigate('OrderDetail', { orderId: id });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Appbar
          style={{ marginTop: '15%', width: '85%', alignSelf: 'center' }}
          label='Order'
          returnable={true}
        />
        <View style={styles.bodyContainer}>
          <InputWithIcon
            icon={ICONS.search}
            placeholder='Status'
            onChangeText={(text) => {
              setQuery(text);
            }}
            containerStyles={styles.searchInputContainer}
          />
          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Sort By</Text>
            <View style={styles.dropdownWrap}>
              <FilterDropdown
                title=''
                options={sortOptions}
                selectedKey={sortKey ?? undefined}
                onSelect={handleFilterSelect}
                initialDirection='asc'
                enableDirectionToggle
              />
            </View>
          </View>
          <Text>Total: {sorted.length}</Text>
          {sorted.length === 0 ? (
            <Text>You Have Placed No Order</Text>
          ) : (
            sorted.map((order, index) => {
              if (!order) return null;

              // lấy item đầu tiên để show hình/giá/tên
              const firstItem = order.items?.[0] ?? {};
              const illustration = firstItem.thumbnail ?? ICONS.padlock;
              const itemsCount = firstItem.quantity ?? 0;
              const totalPrice = order.total ?? 0;

              return (
                <OrderCard
                  key={order.id ?? index}
                  date={
                    order.created_at
                      ? new Date(order.created_at).toDateString()
                      : 'N/A'
                  }
                  orderStatus={order.status ?? 'Unknown'}
                  paymentStatus={order.payment_status ?? 'Unknown'}
                  orderId={order.id.slice(-3) ?? `order-${index}`}
                  items={itemsCount}
                  totalPrice={totalPrice}
                  illustration={illustration}
                  detailItemPressed={() => handleNavigateToDetail(order.id)}
                />
              );
            })
          )}
        </View>
      </ScrollView>
      <BottomNavBar activeTab='Order' />
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
  searchInputContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  sortRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortLabel: {
    color: COLORS.specialText,
    fontWeight: '700',
  },
  dropdownWrap: {
    width: '45%',
  },
});

export default OrderScreen;
