import React from 'react';
import { StyleSheet, Dimensions, Text, View, ScrollView } from 'react-native';
import { RootStackParamList } from '../../navigations/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../constants/color';
import Appbar from '../../components/Appbar/Appbar';

const { width: screenWidth } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.conainter}>
        <Appbar />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: COLORS.red,
    flexGrow: 1,
    minHeight: Dimensions.get('window').height,
  },
  conainter: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default HomeScreen;
