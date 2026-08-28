import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

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

import { createDailyCheckIn } from "../api/dailyCheckIns";

import Button from "../components/Button";
import Input from "../components/Input";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";


export default function DailyCheckInScreen() {
  const navigation = useNavigation();

  const [cigarettesSmoked, setCigarettesSmoked] =
    useState("");

  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!cigarettesSmoked.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter how many cigarettes you smoked today."
      );

      return;
    }

    const cigarettesNumber =
      Number(cigarettesSmoked);

    if (
      !Number.isInteger(cigarettesNumber) ||
      cigarettesNumber < 0
    ) {
      Alert.alert(
        "Invalid value",
        "Please enter a whole number of cigarettes."
      );

      return;
    }

    try {
      setLoading(true);

      await createDailyCheckIn({
        cigarettesSmoked: cigarettesNumber,
        note: note.trim() || undefined,
      });

      Alert.alert(
        "Check-in completed",
        cigarettesNumber === 0
          ? "Great work. You stayed smoke-free today."
          : "Your progress has been recorded.",
        [
          {
            text: "Continue",
            onPress: () => navigation.goBack()
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Unable to complete check-in",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

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
              How did today
              {"\n"}
              <Text style={styles.green}>
                go?
              </Text>
            </Text>

            <Text style={styles.subtitle}>
              Record today's progress. Being honest
              about your day helps keep your
              statistics accurate.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Cigarettes smoked today"
              placeholder="0"
              value={cigarettesSmoked}
              onChangeText={setCigarettesSmoked}
              keyboardType="number-pad"
            />

            <View style={styles.noteContainer}>
              <Input
                label="Note (optional)"
                placeholder="How are you feeling today?"
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Complete check-in"
                onPress={handleSubmit}
                loading={loading}
              />
            </View>
          </View>
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
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  header: {
    marginBottom: spacing.xl,
  },

  brand: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: spacing.lg,
  },

  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "800",
  },

  green: {
    color: colors.primary,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.md,
  },

  form: {
    marginTop: spacing.sm,
  },

  noteContainer: {
    marginTop: spacing.md,
  },

  buttonContainer: {
    marginTop: spacing.lg,
  },
});