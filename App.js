import React from "react";
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Provider } from "react-redux";
import { store } from "./store.js";
import HomeScreen from "./screens/HomeScreen.js";
import MapScreen from "./screens/MapScreen.js";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { KeyboardAvoidingView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// 1) Set Up Redux

export default function App() {
    const Stack= createNativeStackNavigator();
  
    return (
    <Provider store={store}>
        <NavigationContainer>
            <SafeAreaProvider>
                <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
                >
                    <Stack.Navigator>
                        <Stack.Screen
                            name="HomeScreen"
                            component={HomeScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                        
                        <Stack.Screen
                            name="MapScreen"
                            component={MapScreen}
                            options={{
                                headerShown: false,
                            }}
                        />
                    </Stack.Navigator>
                </KeyboardAvoidingView>
            </SafeAreaProvider>
        </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
