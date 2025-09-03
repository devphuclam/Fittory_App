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

const { width: screenWidth } = Dimensions.get('window');

type NavigationProp = NativeStackScreenProps<RootStackParamList>;
const sortOptions: FilterOption[] = [
    { key: 'price', label: 'Price' },
    { key: 'name', label: 'Name' },
    { key: 'rating', label: 'Rating' },
];

const OrderScreen = () => {
    const [query, setQuery] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [direction, setDirection] = useState<'asc' | 'desc' | null>('asc');

    const animate = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };


    const handleFilterSelect = (
        key: string | null,
        dir: 'asc' | 'desc' | null
    ) => {
        animate();
        setSortKey(key);
        setDirection(dir ?? 'asc');
    };
    return (

        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}    >
                <Appbar style={{ marginTop: '15%', width: '85%', alignSelf: 'center' }} label="Order" returnable={true} />
                <View style={styles.bodyContainer}>
                    <InputWithIcon
                        icon={ICONS.search}
                        placeholder="Search"
                        onChangeText={(text) => { console.log(text) }}
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
                    <Text>Total: 2</Text>
                    <OrderCard />
                </View>
            </ScrollView>


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
        width: '80%',
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