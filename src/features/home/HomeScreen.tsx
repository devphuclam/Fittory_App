import React from 'react';
import { StyleSheet, Dimensions, Text, View, ScrollView } from 'react-native';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/color';
import Appbar from '../../components/Appbar/Appbar';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';

const { width: screenWidth } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.conainter}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Appbar
          label='Home'
          style={{ width: '80%', marginTop: '10%', alignSelf: 'center' }}
        />
      </ScrollView>

      <BottomNavBar activeTab='Home' />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: COLORS.background,
    flexGrow: 1,
    minHeight: Dimensions.get('window').height,
  },
  conainter: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
});

export default HomeScreen;
