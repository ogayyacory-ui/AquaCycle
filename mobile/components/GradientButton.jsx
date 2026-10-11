import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text } from "react-native";
import { ArrowRight } from "lucide-react-native";

export default function GradientButton({
  accessibilityLabel,
  disabled = false,
  label,
  loading = false,
  onPress,
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel || label}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={disabled || loading ? ["#91B9D1", "#7EAAC7"] : ["#078FE9", "#0873D8"]}
        end={{ x: 1, y: 0.7 }}
        start={{ x: 0, y: 0.3 }}
        style={styles.gradient}
      >
        <Text style={styles.label}>{loading ? "Please wait..." : label}</Text>
        {!loading && <ArrowRight color="#FFFFFF" size={19} strokeWidth={2.6} style={styles.arrow} />}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { height: 52, borderRadius: 26, overflow: "hidden", marginTop: 9 },
  gradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.75 },
  label: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  arrow: { marginLeft: 10 },
});
