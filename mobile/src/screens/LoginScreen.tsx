import React, { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";

import Button from "../components/Button";
import Input from "../components/Input";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);

      await login(email, password);
    } catch (error) {
      Alert.alert(
        "Login failed",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.brand}>
              DESMOKIFY
            </Text>

            <Text style={styles.title}>
              Welcome back.
            </Text>

            <Text style={styles.subtitle}>
              Ready to continue your{" "}
              <Text style={styles.green}>
                smoke-free journey?
              </Text>
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Login"
                onPress={handleLogin}
                loading={loading}
              />
            </View>
          </View>

          <Text style={styles.quote}>
            One day at a time.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },

  header: {
    marginBottom: spacing.xl,
  },

  brand: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: spacing.lg,
  },

  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },

  green: {
    color: colors.primary,
  },

  form: {
    marginTop: spacing.md,
  },

  buttonContainer: {
    marginTop: spacing.sm,
  },

  quote: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 14,
    marginTop: spacing.xl,
  },
});