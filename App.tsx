import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Today from './app/screens/today';
import Tomorrow from './app/screens/tomorrow';
import 'react-native-gesture-handler';
import { RootStackParamList } from './app/screens/RootStackPrams';
import NextDays from './app/screens/nextDays';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
            headerShown: false
          }}
          initialRouteName="Today"
        >
          <Stack.Screen name="Today" component={Today} />
          <Stack.Screen name="Tomorrow" component={Tomorrow} />
          <Stack.Screen name="NextDays" component={NextDays} />
        </Stack.Navigator>
      </NavigationContainer>
    // </View>
    // <View style={styles.container}>
    //   <Today weather={true} temperature={true} />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '',
    // alignItems: 'center',
  },
});
