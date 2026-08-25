import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { colors } from "../theme/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,

        variant === "primary"
          ? styles.primary
          : styles.secondary,

        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary"
              ? colors.black
              : colors.primary
          }
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "primary"
              ? styles.primaryText
              : styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  primary: {
    backgroundColor: colors.primary,
  },

  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  text: {
    fontSize: 16,
    fontWeight: "700",
  },

  primaryText: {
    color: colors.black,
  },

  secondaryText: {
    color: colors.text,
  },

  disabled: {
    opacity: 0.5,
  },
});