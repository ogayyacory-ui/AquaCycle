import { Pressable, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import AuthLayout from "../../components/AuthLayout";

export default function ForgotPasswordScreen() {
  return (
    <AuthLayout screen="login">
      <Text style={styles.heading}>Reset Your Password</Text>
      <Text style={styles.subtitle}>
        Password reset is not available yet because the AquaCycle account
        service does not currently send reset emails.
      </Text>
      <Text style={styles.note}>
        Your password has not been changed. Please contact your AquaCycle
        administrator for help accessing your account.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace("/auth/login")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Back to Login</Text>
      </Pressable>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  heading: { color: "#102B55", fontSize: 25, lineHeight: 31, fontWeight: "800" },
  subtitle: { color: "#5E7893", fontSize: 14, lineHeight: 22, marginTop: 8 },
  note: {
    color: "#49667F",
    backgroundColor: "#F0F8FD",
    borderColor: "#D6EAF6",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 20,
  },
  button: {
    minHeight: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF5FC",
    marginTop: 22,
  },
  buttonText: { color: "#0877CD", fontSize: 14, fontWeight: "800" },
});
