// components/VoucherCard/VoucherCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/color';

export type Voucher = {
  id: string;
  title: string;
  code?: string;
  discountText: string; // e.g. "50% OFF" or "$10 OFF"
  description?: string;
  minSpend?: number;
  expiry?: string; // ISO date string
  isRedeemed?: boolean;
  icon?: any; // optional image require or uri
};

type Props = {
  voucher: Voucher;
  onRedeem?: (voucherId: string) => void;
  onPress?: (voucherId: string) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VoucherCard = ({ voucher, onRedeem, onPress }: Props) => {
  const expired = voucher.expiry
    ? new Date(voucher.expiry) < new Date()
    : false;
  const used = voucher.isRedeemed;
  const disabled = expired || used;

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      style={[styles.container, disabled && styles.containerDisabled]}
      onPress={() => onPress && onPress(voucher.id)}
    >
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          {voucher.icon ? (
            typeof voucher.icon === 'number' ? (
              <Image source={voucher.icon} style={styles.icon} />
            ) : (
              <Image source={{ uri: voucher.icon }} style={styles.icon} />
            )
          ) : (
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconPlaceText}>%</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{voucher.title}</Text>
          {voucher.description ? (
            <Text numberOfLines={2} style={styles.desc}>
              {voucher.description}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            {voucher.minSpend ? (
              <Text style={styles.metaText}>Min spend ${voucher.minSpend}</Text>
            ) : null}
            <Text style={styles.metaText}>
              {voucher.expiry
                ? `Exp: ${new Date(voucher.expiry).toLocaleDateString()}`
                : ''}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.discountText}>{voucher.discountText}</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onRedeem && !disabled && onRedeem(voucher.id)}
          disabled={disabled}
          style={styles.redeemWrap}
        >
          <LinearGradient
            colors={disabled ? ['#ddd', ' #ddd'] : ['#ff7b39', '#ff4a3a']}
            start={[0, 0]}
            end={[1, 1]}
            style={[styles.redeemBtn, disabled && styles.redeemDisabled]}
          >
            <Text
              style={[styles.redeemText, disabled && styles.redeemTextDisabled]}
            >
              {used ? 'Used' : expired ? 'Expired' : 'Redeem'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {voucher.code ? (
          <View style={styles.codeWrap}>
            <Text style={styles.codeLabel}>Code</Text>
            <Text selectable style={styles.codeText}>
              {voucher.code}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.section,
    width: '100%',
    height: Math.round(SCREEN_WIDTH * 0.65),
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // shadow
    shadowColor: COLORS.black,
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  containerDisabled: {
    opacity: 0.6,
  },

  left: {
    flexDirection: 'row',
    flex: 1,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#efe6db',
  },
  iconPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffefd7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceText: {
    color: COLORS.specialText,
    fontWeight: '700',
  },
  icon: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.specialText,
    fontWeight: '700',
    fontSize: 15,
  },
  desc: {
    color: COLORS.black,
    marginTop: 6,
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  metaText: {
    color: '#777',
    fontSize: 12,
  },

  right: {
    width: 110,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  discountText: {
    color: '#222',
    fontSize: 18,
    fontWeight: '800',
  },

  redeemWrap: {
    marginTop: 8,
  },
  redeemBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 92,
    alignItems: 'center',
  },
  redeemText: {
    color: '#fff',
    fontWeight: '700',
  },
  redeemDisabled: {
    opacity: 0.8,
  },
  redeemTextDisabled: {
    color: '#eee',
  },

  codeWrap: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  codeLabel: {
    fontSize: 11,
    color: '#999',
  },
  codeText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '700',
  },
});

export default VoucherCard;
