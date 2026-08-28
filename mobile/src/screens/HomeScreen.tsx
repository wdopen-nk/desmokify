import React, { useEffect, useState } from "react";
import {
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";


import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";

import { getTodayCheckIn } from "../api/dailyCheckIns";
import { getQuitPlan } from "../api/quitPlans";

import { QuitPlan } from "../types/quitPlan";
import { DailyCheckIn } from "../types/dailyCheckIn";


import { useAuth } from "../context/AuthContext";

import Card from "../components/Card";
import CreateQuitPlanScreen from "./QuitPlanScreen";

import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type HomeNavigationParamList = {
  DailyCheckIn: undefined;
};

export default function HomeScreen() {
  const { logout } = useAuth();
  const navigation =
    useNavigation<NavigationProp<HomeNavigationParamList>>();

  const [quitPlan, setQuitPlan] =
    useState<QuitPlan | null>(null);

  const [todayCheckIn, setTodayCheckIn] =
  useState<DailyCheckIn | null>(null);

  const [checkInLoading, setCheckInLoading] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [showEditPlan, setShowEditPlan] =
    useState(false);

  useEffect(() => {
    loadQuitPlan();
    loadTodayCheckIn();
  }, []);

  const loadQuitPlan = async () => {
    try {
      const plan = await getQuitPlan();

      setQuitPlan(plan);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "NOT_FOUND"
      ) {
        setQuitPlan(null);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTodayCheckIn = async () => {
    try {
      const checkIn = await getTodayCheckIn();

      setTodayCheckIn(checkIn);
    } 
    
    catch (error) {
      if (
        error instanceof Error &&
        error.message === "NOT_FOUND"
      ) {
        setTodayCheckIn(null);
      } 
      
      else {
        console.error(
          "Failed to load today's check-in:",
          error
        );
      }
    } 
    
    finally {
      setCheckInLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error(
                "Logout failed:",
                error
              );

              Alert.alert(
                "Logout failed",
                "Something went wrong while logging out."
              );
            }
          },
        },
      ]
    );
  };


  /*
   * Initial loading state
   */
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </SafeAreaView>
    );
  }

  /*
   * No quit plan exists yet.
   *
   * This is CREATE mode.
   */
  if (!quitPlan) {
    return (
      <CreateQuitPlanScreen
        editMode={false}
        onPlanCreated={() => {
          loadQuitPlan();
        }}
      />
    );
  }

  /*
   * User is editing an existing quit plan.
   *
   * This is EDIT mode.
   */
  if (showEditPlan) {
    return (
      <CreateQuitPlanScreen
        editMode={true}
        onPlanCreated={() => {
          setShowEditPlan(false);
          loadQuitPlan();
        }}
      />
    );
  }

  /*
   * Display the quit plan dashboard.
   */

  const quitDate = new Date(
    quitPlan.quitDate
  ).toLocaleDateString();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              DESMOKIFY
            </Text>

            <Text style={styles.greeting}>
              Your journey starts here.
            </Text>
          </View>

          <View style={styles.status}>
            <Text style={styles.statusIcon}>
              🚭
            </Text>
          </View>
        </View>

        {/* Quit date */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>
            QUIT DATE
          </Text>

          <Text style={styles.heroDate}>
            {quitDate}
          </Text>

          <Text style={styles.heroText}>
            One day at a time. You've got this.
          </Text>
        </View>

        {/* Daily check-in */}
        <Text style={styles.sectionTitle}>
          Today's progress
        </Text>

        <Card>
          {checkInLoading ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />
          ) : todayCheckIn ? (
            <View>
              <Text style={styles.checkInTitle}>
                Today's check-in is complete
              </Text>

              <Text style={styles.checkInValue}>
                {todayCheckIn.cigarettesSmoked}
              </Text>

              <Text style={styles.checkInLabel}>
                cigarettes smoked
              </Text>

              {todayCheckIn.note ? (
                <Text style={styles.checkInNote}>
                  {todayCheckIn.note}
                </Text>
              ) : null}
            </View>
          ) : (
            <View>
              <Text style={styles.checkInTitle}>
                You haven't checked in today
              </Text>

              <Text style={styles.checkInDescription}>
                Take a moment to record how your day went.
              </Text>

              <TouchableOpacity
                style={styles.checkInButton}
                onPress={() =>
                  navigation.navigate("DailyCheckIn")
                }
                activeOpacity={0.8}
              >
                <Text style={styles.checkInButtonText}>
                  Complete today's check-in
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Plan statistics */}
        <Text style={styles.sectionTitle}>
          Your plan
        </Text>

        <View style={styles.statsGrid}>
          <Card>
            <Text style={styles.statIcon}>
              🚬
            </Text>

            <Text style={styles.statValue}>
              {quitPlan.cigarettesPerDay}
            </Text>

            <Text style={styles.statLabel}>
              cigarettes/day
            </Text>
          </Card>

          <Card>
            <Text style={styles.statIcon}>
              📦
            </Text>

            <Text style={styles.statValue}>
              {quitPlan.cigarettesPerPack}
            </Text>

            <Text style={styles.statLabel}>
              cigarettes/pack
            </Text>
          </Card>
        </View>

        {/* Price */}
        <Card>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.statLabel}>
                Price per pack
              </Text>

              <Text style={styles.price}>
                {quitPlan.packPrice}
              </Text>
            </View>

            <Text style={styles.moneyIcon}>
              💰
            </Text>
          </View>
        </Card>

        {/* Edit */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowEditPlan(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonText}>
            Edit quit plan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },

  brand: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
  },

  greeting: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },

  status: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },

  statusIcon: {
    fontSize: 23,
  },

  hero: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 24,
    marginBottom: spacing.xl,
  },

  heroLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },

  heroDate: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
  },

  heroText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 10,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.md,
  },

  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  statIcon: {
    fontSize: 22,
    marginBottom: 12,
  },

  statValue: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
  },

  statLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 5,
  },

  moneyIcon: {
    fontSize: 30,
  },

  editButton: {
    marginTop: spacing.lg,
    alignItems: "center",
    paddingVertical: 14,
  },

  editButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },

  logoutButton: {
  marginTop: spacing.sm,
  alignItems: "center",
  paddingVertical: 14,
  },

  logoutButtonText: {
    color: "#FF6B6B",
    fontSize: 15,
    fontWeight: "600",
  },

  checkInTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  checkInDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },

  checkInValue: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "800",
    marginTop: spacing.md,
  },

  checkInLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },

  checkInNote: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.md,
  },

  checkInButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  checkInButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "700",
  },
});