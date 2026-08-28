import React from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import Button from "../components/Button";
import Logo from "../components/Logo";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.hero}>
          <Logo size={78} />

          <Text style={styles.brand}>
            DESMOKIFY
          </Text>

          <Text style={styles.title}>
            Your smoke-free{"\n"}
            <Text style={styles.green}>
              journey starts today.
            </Text>
          </Text>

          <Text style={styles.subtitle}>
            Small steps. Real progress.
            {"\n"}
            A healthier future starts with
            one decision.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Create account"
            onPress={() =>
              navigation.navigate("Register")
            }
          />

          <View style={styles.secondaryButton}>
            <Button
              title="I already have an account"
              variant="secondary"
              onPress={() =>
                navigation.navigate("Login")
              }
            />
          </View>
        </View>

        <Text style={styles.footer}>
          One day at a time. 🌱
        </Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "space-between",
  },

  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  brand: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 4,
    marginBottom: spacing.lg,
  },

  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "800",
    textAlign: "center",
  },

  green: {
    color: colors.primary,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    marginTop: spacing.lg,
  },

  actions: {
    marginBottom: spacing.lg,
  },

  secondaryButton: {
    marginTop: spacing.md,
  },

  footer: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
});