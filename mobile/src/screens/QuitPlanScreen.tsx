import React, { useEffect, useState } from "react";

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

import {
  createQuitPlan,
  getQuitPlan,
  updateQuitPlan,
} from "../api/quitPlans";

import Button from "../components/Button";
import Input from "../components/Input";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

interface Props {
  onPlanCreated: () => void;
  editMode?: boolean;
}

function parseQuitDate(dateString: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    dateString.trim()
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export default function CreateQuitPlanScreen({
  onPlanCreated,
  editMode = false,
}: Props) {
  const [quitDate, setQuitDate] = useState("");
  const [cigarettesPerDay, setCigarettesPerDay] =
    useState("");
  const [cigarettesPerPack, setCigarettesPerPack] =
    useState("");
  const [packPrice, setPackPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(
    editMode
  );

  useEffect(() => {
    if (!editMode) {
      return;
    }

    async function loadPlan() {
      try {
        const plan = await getQuitPlan();

        const date = new Date(plan.quitDate);

        const formattedDate =
          `${date.getUTCFullYear()}-` +
          `${String(
            date.getUTCMonth() + 1
          ).padStart(2, "0")}-` +
          `${String(
            date.getUTCDate()
          ).padStart(2, "0")}`;

        setQuitDate(formattedDate);

        setCigarettesPerDay(
          String(plan.cigarettesPerDay)
        );

        setCigarettesPerPack(
          String(plan.cigarettesPerPack)
        );

        setPackPrice(
          String(plan.packPrice)
        );
      } catch (error) {
        Alert.alert(
          "Unable to load plan",
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      } finally {
        setLoadingPlan(false);
      }
    }

    loadPlan();
  }, [editMode]);

  const handleSubmit = async () => {
    if (
      !quitDate ||
      !cigarettesPerDay ||
      !cigarettesPerPack ||
      !packPrice
    ) {
      Alert.alert(
        "Missing information",
        "Please fill in all fields."
      );

      return;
    }

    const cigarettesDayNumber =
      Number(cigarettesPerDay);

    const cigarettesPackNumber =
      Number(cigarettesPerPack);

    const packPriceNumber =
      Number(packPrice);

    if (
      cigarettesDayNumber <= 0 ||
      cigarettesPackNumber <= 0 ||
      packPriceNumber <= 0
    ) {
      Alert.alert(
        "Invalid information",
        "Please enter valid values."
      );

      return;
    }

    const date = parseQuitDate(quitDate);

    if (!date) {
      Alert.alert(
        "Invalid date",
        "Please use a valid date in YYYY-MM-DD format."
      );

      return;
    }

    const request = {
      quitDate: date.toISOString(),
      cigarettesPerDay: cigarettesDayNumber,
      cigarettesPerPack: cigarettesPackNumber,
      packPrice: packPriceNumber,
    };

    try {
      setLoading(true);

      if (editMode) {
        await updateQuitPlan(request);

        Alert.alert(
          "Plan updated 🚭",
          "Your quit plan has been updated.",
          [
            {
              text: "Done",
              onPress: onPlanCreated,
            },
          ]
        );
      } else {
        await createQuitPlan(request);

        Alert.alert(
          "Plan created 🚭",
          "Your smoke-free journey starts now!",
          [
            {
              text: "Let's go",
              onPress: onPlanCreated,
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        editMode
          ? "Unable to update plan"
          : "Unable to create plan",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingPlan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Loading your quit plan...
          </Text>
        </View>
      </SafeAreaView>
    );
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
              {editMode
                ? "Update your"
                : "Let's build your"}
              {"\n"}
              <Text style={styles.green}>
                smoke-free future.
              </Text>
            </Text>

            <Text style={styles.subtitle}>
              {editMode
                ? "Update your smoking habits and quit date to keep your progress accurate."
                : "Tell us a little about your current smoking habits. We'll use this to track your progress."}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Quit date"
              placeholder="YYYY-MM-DD"
              value={quitDate}
              onChangeText={setQuitDate}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numbers-and-punctuation"
            />

            <Input
              label="Cigarettes per day"
              placeholder="e.g. 10"
              value={cigarettesPerDay}
              onChangeText={setCigarettesPerDay}
              keyboardType="numeric"
            />

            <Input
              label="Cigarettes per pack"
              placeholder="e.g. 20"
              value={cigarettesPerPack}
              onChangeText={setCigarettesPerPack}
              keyboardType="numeric"
            />

            <Input
              label="Price per pack"
              placeholder="e.g. 8.00"
              value={packPrice}
              onChangeText={setPackPrice}
              keyboardType="decimal-pad"
            />

            <View style={styles.buttonContainer}>
              <Button
                title={
                  editMode
                    ? "Update my quit plan"
                    : "Create my quit plan"
                }
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
    fontSize: 32,
    lineHeight: 40,
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

  buttonContainer: {
    marginTop: spacing.sm,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});