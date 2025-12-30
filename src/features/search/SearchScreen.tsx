// SearchScreen.tsx
import React, { useMemo, useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/color';
import Appbar from '../../components/Appbar/Appbar';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import InputWithIcon from '../../components/Input/InputWithIcon';
import FilterDropdown, {
  FilterOption,
} from '../../components/FilterDropdown/FilterDropdown';
import { sampleProducts } from '../../data/sampleProducts';
import { ICONS } from '../../assets/images/icons';
import { RegionContext } from '../../contexts/RegionContext';
import { ProductService } from '../../services';
import { ImageSourcePropType } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const PER_PAGE = 6;

const sortOptions: FilterOption[] = [
  { key: 'price', label: 'Price' },
  { key: 'name', label: 'Name' },
  { key: 'rating', label: 'Rating' },
];

const SearchScreen = ({ navigation }: Props) => {
  const regionContext = useContext(RegionContext);
  const { region } = regionContext || {}; // luôn khai báo hook trước
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [direction, setDirection] = useState<'asc' | 'desc' | null>('asc');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch products from Medusa backend
    const fetchProducts = async () => {
      if (!region?.id) return; // ⬅️ chặn khi region chưa load
      try {
        const response = await ProductService.listProducts(region?.id);
        if (response && response.data) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [region]);

  const animate = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  // filter by query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p: any) =>
      q ? (p.title || '').toLowerCase().includes(q) : true
    );
  }, [products, query]);

  // sort
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

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const pageData = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return sorted.slice(start, start + PER_PAGE);
  }, [sorted, page]);

  const handleFilterSelect = (
    key: string | null,
    dir: 'asc' | 'desc' | null
  ) => {
    animate();
    setSortKey(key);
    setDirection(dir ?? 'asc');
    setPage(1);
  };

  // Header for the list (appbar + search + sort)
  const renderHeader = () => (
    <View style={styles.headerWrap}>
      <Appbar
        style={{ width: '100%', marginTop: '12%', alignSelf: 'center' }}
        label='Search'
        returnable
      />

      <View style={styles.searchRow}>
        <InputWithIcon
          placeholder='Search'
          containerStyles={styles.searchInputContainer}
          icon={ICONS.search}
          value={query}
          onChangeText={(t: string) => {
            setQuery(t);
            setPage(1);
          }}
        />
      </View>

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

      {/* spacing between header and grid */}
      <View style={{ height: 12 }} />
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    // Lấy ảnh
    const imageSource: ImageSourcePropType = item.thumbnail
      ? { uri: item.thumbnail }
      : item.images?.[0]
      ? { uri: item.images[0].url }
      : (item.images[1] as ImageSourcePropType);
    // Lấy giá (variant đầu tiên)
    const price = item.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
    return (
      <View style={styles.cardWrapper}>
        <ProductCard
          productName={item.title}
          productPrice={price}
          productImage={imageSource}
          productId={item.id}
        />
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {/* Pagination: simple page numbers */}
      <View style={styles.pagination}>
        <TouchableOpacity
          style={styles.pageBtn}
          onPress={() => {
            if (page > 1) {
              animate();
              setPage((p) => p - 1);
            }
          }}
        >
          <Text>{'«'}</Text>
        </TouchableOpacity>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1;
          // simple windowing for many pages
          if (totalPages > 7) {
            const start = Math.max(1, page - 2);
            const end = Math.min(totalPages, page + 2);
            if (p < start && p !== 1) {
              if (p === 2) return <Text key={p}>...</Text>;
              return null;
            }
            if (p > end && p !== totalPages) {
              if (p === totalPages - 1) return <Text key={p}>...</Text>;
              return null;
            }
          }
          return (
            <TouchableOpacity
              key={p}
              onPress={() => {
                animate();
                setPage(p);
              }}
              style={[styles.pageNumber, page === p && styles.pageActive]}
            >
              <Text
                style={page === p ? styles.pageTextActive : styles.pageText}
              >
                {p}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.pageBtn}
          onPress={() => {
            if (page < totalPages) {
              animate();
              setPage((p) => p + 1);
            }
          }}
        >
          <Text>{'»'}</Text>
        </TouchableOpacity>
      </View>

      {/* extra bottom spacing so footer doesn't stick to BottomNavBar */}
      <View style={{ height: 100 }} />
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={pageData}
        keyExtractor={(item: any) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        renderItem={renderItem}
        contentContainerStyle={styles.flatContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No results</Text>}
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
  headerWrap: {
    paddingBottom: 12,
    paddingHorizontal: screenWidth * 0.05,
    backgroundColor: 'transparent',
  },
  searchRow: {
    marginTop: 12,
  },
  searchInputContainer: {
    alignSelf: 'center',
    marginTop: 8,
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

  flatContent: {
    paddingHorizontal: screenWidth * 0.05,
    paddingBottom: 0, // make room for BottomNavBar + footer spacing
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardWrapper: {
    // ensure 2 columns layout spacing — ProductCard already has width set
  },

  emptyText: {
    textAlign: 'center',
    padding: 20,
  },

  footer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: 18,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  pageBtn: {
    padding: 6,
    borderRadius: 6,
  },
  pageNumber: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  pageActive: {
    backgroundColor: '#f3c96b',
  },
  pageTextActive: {
    fontWeight: '700',
  },
  pageText: {},
});

export default SearchScreen;
