// screens/VoucherScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Appbar from '../../components/Appbar/Appbar';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import VoucherCard, { Voucher } from '../../components/VoucherCard/VoucherCard';
import { COLORS } from '../../constants/color';

const { width: screenWidth } = Dimensions.get('window');

const sampleVouchers: Voucher[] = [
  {
    id: 'v1',
    title: 'Summer Discount',
    code: 'SUMMER50',
    discountText: '50% OFF',
    description: 'Áp dụng cho mọi sản phẩm trong dịp hè.',
    minSpend: 20,
    expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    isRedeemed: false,
  },
  {
    id: 'v2',
    title: 'First Order',
    code: 'WELCOME10',
    discountText: '$10 OFF',
    description: 'Giảm $10 cho đơn hàng đầu tiên',
    minSpend: 50,
    expiry: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // expired
    isRedeemed: false,
  },
  {
    id: 'v3',
    title: 'VIP Customer',
    discountText: '20% OFF',
    description: 'Ưu đãi cho khách hàng thân thiết',
    expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    isRedeemed: true,
  },
];

type FilterType = 'all' | 'active' | 'used' | 'expired';

const VoucherScreen = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>(sampleVouchers);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const handleRedeem = (id: string) => {
    // đơn giản: đánh dấu là redeemed
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isRedeemed: true } : v))
    );
    // TODO: gọi api redeem ở đây nếu cần
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vouchers.filter((v) => {
      // search
      if (q) {
        const text = `${v.title} ${v.code ?? ''} ${
          v.description ?? ''
        }`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      // status filter
      const expired = v.expiry ? new Date(v.expiry) < new Date() : false;
      const used = !!v.isRedeemed;

      if (filter === 'active' && (expired || used)) return false;
      if (filter === 'used' && !used) return false;
      if (filter === 'expired' && !expired) return false;
      return true;
    });
  }, [vouchers, filter, search]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Appbar
        style={{ width: '85%', marginTop: '10%', alignSelf: 'center' }}
        label='My Vouchers'
        returnable
      />
      <View style={styles.topArea}>
        <Text style={styles.h1}>Your Vouchers</Text>
        <Text style={styles.h2}>Save on your next purchase</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.filterRow}>
          {(['all', 'active', 'used', 'expired'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f === 'all'
                  ? 'All'
                  : f === 'active'
                  ? 'Active'
                  : f === 'used'
                  ? 'Used'
                  : 'Expired'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>No vouchers</Text>
      <Text style={styles.emptySubtitle}>
        You don’t have any vouchers yet. Go shopping to get discounts!
      </Text>
      <TouchableOpacity
        style={styles.shopBtn}
        onPress={() => {
          /* navigate home */
        }}
      >
        <Text style={styles.shopBtnText}>Shop now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <VoucherCard
            voucher={item}
            onRedeem={handleRedeem}
            onPress={() => {
              /* show details */
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
      />

      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: screenWidth * 0.06,
    paddingBottom: 120,
    paddingTop: 8,
  },

  header: {
    marginBottom: 6,
  },
  topArea: {
    alignItems: 'center',
    marginVertical: 18,
  },
  h1: {
    color: COLORS.specialText,
    fontWeight: '800',
    fontSize: 20,
  },
  h2: {
    color: COLORS.fittoryBlue,
    marginTop: 6,
  },

  controls: {
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.defaultShadow,
  },
  filterBtnActive: {
    backgroundColor: '#ffeedf',
    borderColor: '#ffd9b0',
  },
  filterText: {
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.specialText,
  },

  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: COLORS.disable,
    textAlign: 'center',
    marginBottom: 16,
  },
  shopBtn: {
    backgroundColor: COLORS.specialText,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shopBtnText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});

export default VoucherScreen;
