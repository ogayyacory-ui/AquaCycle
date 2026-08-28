import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { COLORS } from "../constants/colors";


export default function AquaButton({
  title,
  onPress,
  loading = false,
  variant = "primary",
}) {

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "secondary"
          ? styles.secondary
          : styles.primary,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >

      {loading ? (
        <ActivityIndicator
          color={
            variant === "secondary"
              ? COLORS.primary
              : COLORS.white
          }
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "secondary"
              ? styles.secondaryText
              : styles.primaryText,
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
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  primary: {
    backgroundColor: COLORS.primary,
  },

  secondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  text: {
    fontSize: 16,
    fontWeight: "700",
  },

  primaryText: {
    color: COLORS.white,
  },

  secondaryText: {
    color: COLORS.primary,
  },

});