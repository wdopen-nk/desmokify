import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Welcome"
>;

export default function WelcomeScreen({
  navigation,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Desmokify
      </Text>

      <Text style={styles.subtitle}>
        Your journey to a smoke-free life
        starts today.
      </Text>

      <View style={styles.button}>
        <Button
          title="Create account"
          onPress={() =>
            navigation.navigate("Register")
          }
        />
      </View>

      <View style={styles.button}>
        <Button
          title="I already have an account"
          onPress={() =>
            navigation.navigate("Login")
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
  },

  button: {
    marginVertical: 8,
  },
});