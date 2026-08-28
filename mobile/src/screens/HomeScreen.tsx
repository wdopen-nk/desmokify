import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import {
  getQuitPlan,
} from "../api/quitPlans";

import {
  getDailyCheckInStatistics,
  getTodayCheckIn,
} from "../api/dailyCheckIns";

import {
  DailyCheckInStatistics,
} from "../types/dailyCheckIn";

import {
  QuitPlan,
} from "../types/quitPlan";

import {
  useAuth,
} from "../context/AuthContext";

import Card from "../components/Card";
import Button from "../components/Button";

import CreateQuitPlanScreen from "./QuitPlanScreen";

import {
  colors,
} from "../theme/colors";

import {
  spacing,
} from "../theme/spacing";

export default function HomeScreen() {
  const {
    user,
    logout,
  } = useAuth();

  const navigation =
    useNavigation<any>();

  const [
    quitPlan,
    setQuitPlan,
  ] = useState<QuitPlan | null>(null);

  const [
    statistics,
    setStatistics,
  ] = useState<DailyCheckInStatistics | null>(null);

  const [
    hasCheckedInToday,
    setHasCheckedInToday,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    showEditPlan,
    setShowEditPlan,
  ] = useState(false);

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);

        const plan =
          await getQuitPlan();

        setQuitPlan(plan);

        const [
          stats,
          todayCheckIn,
        ] = await Promise.all([
          getDailyCheckInStatistics(),
          getTodayCheckIn().catch(() => null),
        ]);

        setStatistics(stats);
        setHasCheckedInToday(
          todayCheckIn !== null
        );
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

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
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.center}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </SafeAreaView>
    );
  }

  if (!quitPlan) {
    return (
      <CreateQuitPlanScreen
        editMode={false}
        onPlanCreated={() => {
          loadDashboard();
        }}
      />
    );
  }

  if (showEditPlan) {
    return (
      <CreateQuitPlanScreen
        editMode={true}
        onPlanCreated={() => {
          setShowEditPlan(false);
          loadDashboard();
        }}
      />
    );
  }

  const quitDate =
    new Date(
      quitPlan.quitDate
    ).toLocaleDateString();

  const firstName =
    user?.name?.split(" ")[0] || "there";

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              DESMOKIFY
            </Text>

            <Text style={styles.greeting}>
              Good to see you, {firstName}.
            </Text>
          </View>
        </View>

        {/* Days since quit */}
        <View style={styles.section}>
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>
              DAYS SINCE QUIT
            </Text>

            <Text style={styles.heroValue}>
              {statistics?.daysSinceQuit ?? 0}
            </Text>

            <Text style={styles.heroDescription}>
              Keep going. Every smoke-free
              day adds to your progress.
            </Text>
          </View>
        </View>

        {/* Today's check-in */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Today's check-in
          </Text>

          <Card>
            <View style={styles.checkInHeader}>
              <View>
                <Text style={styles.cardTitle}>
                  {hasCheckedInToday
                    ? "Check-in completed"
                    : "How did today go?"}
                </Text>

                <Text style={styles.cardDescription}>
                  {hasCheckedInToday
                    ? "Your progress for today has been recorded."
                    : "Record today's cigarettes to keep your statistics accurate."}
                </Text>
              </View>

              <View
                style={[
                  styles.statusIndicator,
                  hasCheckedInToday
                    ? styles.statusComplete
                    : styles.statusPending,
                ]}
              />
            </View>

            {!hasCheckedInToday && (
              <View style={styles.checkInButton}>
                <Button
                  title="Complete today's check-in"
                  onPress={() =>
                    navigation.navigate("DailyCheckIn")
                  }
                />
              </View>
            )}
          </Card>
        </View>

        {/* Your progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Your progress
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statWrapper}>
              <Card>
                <Text style={styles.statValue}>
                  {statistics?.smokeFreeDays ?? 0}
                </Text>

                <Text style={styles.statLabel}>
                  Smoke-free days
                </Text>
              </Card>
            </View>

            <View style={styles.statWrapper}>
              <Card>
                <Text style={styles.statValue}>
                  {statistics?.currentStreak ?? 0}
                </Text>

                <Text style={styles.statLabel}>
                  Current streak
                </Text>
              </Card>
            </View>

            <View style={styles.statWrapper}>
              <Card>
                <Text style={styles.statValue}>
                  {statistics?.longestStreak ?? 0}
                </Text>

                <Text style={styles.statLabel}>
                  Longest streak
                </Text>
              </Card>
            </View>

            <View style={styles.statWrapper}>
              <Card>
                <Text style={styles.statValue}>
                  {statistics?.cigarettesAvoided ?? 0}
                </Text>

                <Text style={styles.statLabel}>
                  Cigarettes avoided
                </Text>
              </Card>
            </View>
          </View>
        </View>

        {/* Money saved */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Money saved
          </Text>

          <Card>
            <Text style={styles.moneyValue}>
              {statistics?.moneySaved?.toFixed(2) ?? "0.00"}
            </Text>

            <Text style={styles.moneyDescription}>
              Based on your current quit plan.
            </Text>
          </Card>
        </View>

        {/* Quit plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Quit plan
          </Text>

          <Card>
            <View style={styles.planRow}>
              <Text style={styles.planLabel}>
                Quit date
              </Text>

              <Text style={styles.planValue}>
                {quitDate}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.planRow}>
              <Text style={styles.planLabel}>
                Cigarettes per day
              </Text>

              <Text style={styles.planValue}>
                {quitPlan.cigarettesPerDay}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.planRow}>
              <Text style={styles.planLabel}>
                Cigarettes per pack
              </Text>

              <Text style={styles.planValue}>
                {quitPlan.cigarettesPerPack}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.planRow}>
              <Text style={styles.planLabel}>
                Pack price
              </Text>

              <Text style={styles.planValue}>
                {quitPlan.packPrice.toFixed(2)}
              </Text>
            </View>
          </Card>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            setShowEditPlan(true)
          }
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
    backgroundColor:
      colors.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      colors.background,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  header: {
    marginBottom: spacing.xl,
  },

  brand: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 8,
  },

  greeting: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
  },

  hero: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 24,
  },

  heroLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },

  heroValue: {
    color: colors.text,
    fontSize: 56,
    lineHeight: 64,
    fontWeight: "800",
    marginTop: 6,
  },

  heroDescription: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 280,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.md,
  },

  checkInHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  cardDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
    maxWidth: 275,
  },

  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },

  statusComplete: {
    backgroundColor:
      colors.primary,
  },

  statusPending: {
    backgroundColor:
      colors.warning,
  },

  checkInButton: {
    marginTop: spacing.lg,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },

  statWrapper: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },

  statValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },

  statLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },

  moneyValue: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: "800",
  },

  moneyDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },

  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 42,
  },

  planLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },

  planValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
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
    color: colors.danger,
    fontSize: 15,
    fontWeight: "600",
  },
});