import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getQuitPlan } from "../api/quitPlans";
import { QuitPlan } from "../types/quitPlan";
import CreateQuitPlanScreen from "./CreateQuitPlanScreen";

export default function HomeScreen() {
  const [quitPlan, setQuitPlan] =
    useState<QuitPlan | null>(null);

  const [loading, setLoading] = useState(true);

  const [showCreatePlan, setShowCreatePlan] =
    useState(false);

  useEffect(() => {
    loadQuitPlan();
  }, []);

  const loadQuitPlan = async () => {
    try {
      const plan = await getQuitPlan();

      setQuitPlan(plan);
    } 
    
    catch (error) {
      if (error instanceof Error && 
        error.message == "NOT FOUND") 
      {
        setQuitPlan(null);
      } 
      
      else {
        console.error(
          "Failed to load quit plan:",
          error
        );

        Alert.alert(
          "Error",
          "Unable to load your quit plan."
        );
      }
    } 
    
    finally {
      setLoading(false);
    }
    
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!quitPlan || showCreatePlan) {
    return (
      <CreateQuitPlanScreen
        onPlanCreated={() => {
          setShowCreatePlan(false);
          loadQuitPlan();
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Your smoke-free journey 🚭
        </Text>

        <Text style={styles.subtitle}>
          Your quit plan is ready.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Quit date
          </Text>

          <Text style={styles.cardValue}>
            {new Date(
              quitPlan.quitDate
            ).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Cigarettes per day
          </Text>

          <Text style={styles.cardValue}>
            {quitPlan.cigarettesPerDay}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Cigarettes per pack
          </Text>

          <Text style={styles.cardValue}>
            {quitPlan.cigarettesPerPack}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Pack price
          </Text>

          <Text style={styles.cardValue}>
            {quitPlan.packPrice}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowCreatePlan(true)}
        >
          <Text style={styles.secondaryButtonText}>
            Edit quit plan
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 24,
  },

  card: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 6,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: "600",
  },

  secondaryButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});