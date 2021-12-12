import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Today from './components/today';

export default function App() {
  return (
    <View style={styles.container}>
      <Today weather={true} temperature={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FF',
    alignItems: 'center',
  },
});
