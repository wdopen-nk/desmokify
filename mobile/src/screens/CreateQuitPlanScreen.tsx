import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createQuitPlan } from "../api/quitPlans";

interface Props {
  onPlanCreated: () => void;
}

export default function CreateQuitPlanScreen({
  onPlanCreated,
}: Props) {
  const [quitDate, setQuitDate] = useState("");
  const [cigarettesPerDay, setCigarettesPerDay] =
    useState("");

  const [cigarettesPerPack, setCigarettesPerPack] =
    useState("");

  const [packPrice, setPackPrice] = useState("");

  const [loading, setLoading] = useState(false);

  const handleCreatePlan = async () => {
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

    const date = new Date(quitDate);

    if (Number.isNaN(date.getTime())) {
      Alert.alert(
        "Invalid date",
        "Please use the format YYYY-MM-DD."
      );

      return;
    }

    try {
      setLoading(true);

      await createQuitPlan({
        quitDate: date.toISOString(),
        cigarettesPerDay: cigarettesDayNumber,
        cigarettesPerPack: cigarettesPackNumber,
        packPrice: packPriceNumber,
      });

      Alert.alert(
        "Plan created! 🎉",
        "Your smoke-free journey starts now.",
        [
          {
            text: "Continue",
            onPress: onPlanCreated,
          },
        ]
      );
    } catch (error) {
      console.error(
        "Create quit plan failed:",
        error
      );

      Alert.alert(
        "Unable to create plan",
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
        >
          <Text style={styles.title}>
            Create your quit plan 🚭
          </Text>

          <Text style={styles.subtitle}>
            Let's understand your current smoking
            habits so we can track your progress.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>
              Quit date
            </Text>

            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={quitDate}
              onChangeText={setQuitDate}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Cigarettes per day
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 10"
              value={cigarettesPerDay}
              onChangeText={setCigarettesPerDay}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Cigarettes per pack
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 20"
              value={cigarettesPerPack}
              onChangeText={setCigarettesPerPack}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              Price per pack
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 5.50"
              value={packPrice}
              onChangeText={setPackPrice}
              keyboardType="decimal-pad"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleCreatePlan}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? "Creating..."
                : "Create my quit plan"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingTop: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666666",
    marginBottom: 32,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },

  button: {
    marginTop: 12,
    backgroundColor: "#222222",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});