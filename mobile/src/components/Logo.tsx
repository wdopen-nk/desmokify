import React from "react";
import {
  Image,
  StyleSheet,
  View,
} from "react-native";

import { spacing } from "../theme/spacing";

interface LogoProps {
  size?: number;
}

export default function Logo({
  size = 72,
}: LogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/desmokify-logo.jpg")}
        style={{
          width: size,
          height: size,
        }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
});