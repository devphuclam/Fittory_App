import React from "react";
import { ScrollView, StyleSheet, Text, View, LayoutAnimation } from "react-native";
import { RootStackParamList } from "../../navigations/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Appbar from "../../components/Appbar/Appbar";
import { SearchBar } from "react-native-screens";
import { COLORS } from "../../constants/color";
import { ICONS } from "../../assets/images/icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InputWithIcon from "../../components/Input/InputWithIcon";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import { FilterOption } from "../../components/FilterDropdown/FilterDropdown";
import sampleProducts from "../../data/sampleProducts";
import OrderCard from "./components/OrderCard";
import { Image } from "react-native";
import BottomNavBar from "../../components/BottomNavBar/BottomNavBar";
import { useMemo } from "react";
import { set } from "react-hook-form";

const { width: screenWidth } = Dimensions.get('window');

type NavigationProp = NativeStackScreenProps<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;
const sortOptions: FilterOption[] = [
    { key: 'price', label: 'Price' },
    { key: 'date', label: 'Date' },
    { key: 'totalPrice', label: 'Total Price' }
];

const OrderScreen = ({ navigation }: Props) => {
    const [orderArrayState, setOrderArrayState] = useState(sampleProducts.map((p, index) =>
        ({ ...p, totalPrice: p.price * (p.stock ?? 0) })));
    type Product = typeof sampleProducts[1];
    let count = orderArrayState.length;
    const [query, setQuery] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [direction, setDirection] = useState<'asc' | 'desc' | null>('asc');

    const animate = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return orderArrayState.filter((p: any) =>
            q ? (p.name || '').toLowerCase().includes(q) : true
        );
    }, [query, orderArrayState]);

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
        console.log('Navigate to OrderDetail with id:', id);
        navigation.navigate('OrderDetail', { orderId: id });
    }
    return (

        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <Appbar style={{ marginTop: '15%', width: '85%', alignSelf: 'center' }} label="Order" returnable={true} />
                <View style={styles.bodyContainer}>
                    <InputWithIcon
                        icon={ICONS.search}
                        placeholder="Status"
                        onChangeText={(text) => { setQuery(text) }}
                        containerStyles={styles.searchInputContainer} />
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
                    {count === 0 ? (<Text>You Have Placed No Order</Text>) :
                        (sorted.map((data, index) => (
                            <OrderCard
                                key={index}
                                date="Wed 01/01/2111"
                                orderStatus="Delivered"
                                paymentStatus="Paid"
                                orderId={data.id}
                                items={data.stock}
                                totalPrice={data.price * (data.stock ?? 0)}
                                illustration={data.images[0]}
                                detailItemPressed={handleNavigateToDetail}
                            />
                        )))}
                </View>
            </ScrollView>
            <BottomNavBar activeTab="Order" />
        </View>
    )

}

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