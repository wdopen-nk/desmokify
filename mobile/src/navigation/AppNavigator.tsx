import React from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { useAuth } from "../context/AuthContext";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";

type RootStackParamList = {
  Home: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}