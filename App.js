import { StyleSheet, Text, TextInput, View, SafeAreaView, LinearGradient } from 'react-native';
import React, {useState, useRef, useEffect} from 'react'
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator()
function Navigation(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name='Home' component={HomeScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <Navigation />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    margin: 8
  },
  heading: {
    fontSize: 40,
    marginTop: 16,
    marginBottom: 16
  },
  field: {
    marginTop: 8,
    marginBottom: 16,
  }
});
