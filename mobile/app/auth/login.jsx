import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { LockKeyhole, Mail } from "lucide-react-native";
import AuthInput from "../../components/AuthInput";
import AuthLayout from "../../components/AuthLayout";
import GradientButton from "../../components/GradientButton";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import { signIn, signInWithGoogle } from "../../services/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const passwordInput = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email address and password to continue.");
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("This server currently supports email sign-in. Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await signIn({ email: email.trim(), password });
      router.replace("/(tabs)/home");
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function continueWithGoogle(idToken) {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle(idToken);
      router.replace("/(tabs)/home");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout screen="login">
      <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Sign in to continue your journey with AquaCycle.
      </Text>

      <AuthInput
        autoComplete="email"
        icon={Mail}
        keyboardType="email-address"
        onChangeText={setEmail}
        onSubmitEditing={() => passwordInput.current?.focus()}
        placeholder="Email or Phone Number"
        returnKeyType="next"
        textContentType="emailAddress"
        value={email}
      />
      <AuthInput
        autoComplete="current-password"
        icon={LockKeyhole}
        inputRef={passwordInput}
        onChangeText={setPassword}
        onSubmitEditing={submit}
        placeholder="Password"
        returnKeyType="go"
        secureTextEntry
        textContentType="password"
        value={password}
      />

      <View style={styles.options}>
        <Pressable
          accessibilityLabel="Remember me"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: rememberMe }}
          hitSlop={8}
          onPress={() => setRememberMe((value) => !value)}
          style={styles.remember}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.rememberText}>Remember Me</Text>
        </Pressable>
        <Pressable
          accessibilityRole="link"
          hitSlop={8}
          onPress={() => router.push("/auth/forgot-password")}
        >
          <Text style={styles.link}>Forgot Password?</Text>
        </Pressable>
      </View>

      {!!error && (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      )}

      <GradientButton label="Login" loading={loading} onPress={submit} />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.or}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <GoogleAuthButton disabled={loading} onSuccess={continueWithGoogle} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Pressable accessibilityRole="link" onPress={() => router.push("/auth/signup")}>
          <Text style={styles.link}>Sign Up</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  heading: { color: "#102B55", fontSize: 25, lineHeight: 31, fontWeight: "800" },
  subtitle: {
    color: "#5E7893",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    marginBottom: 17,
  },
  options: {
    minHeight: 29,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -1,
    marginBottom: 7,
  },
  remember: { flexDirection: "row", alignItems: "center", minHeight: 42 },
  checkbox: {
    width: 17,
    height: 17,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 1.4,
    borderColor: "#91A8BA",
    marginRight: 7,
  },
  checkboxChecked: { backgroundColor: "#0987E4", borderColor: "#0987E4" },
  checkmark: { color: "#FFFFFF", fontSize: 11, lineHeight: 14, fontWeight: "900" },
  rememberText: { color: "#416079", fontSize: 11 },
  link: { color: "#067BE0", fontSize: 11, fontWeight: "700" },
  error: {
    color: "#B42332",
    backgroundColor: "#FFF2F3",
    borderRadius: 8,
    padding: 9,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 4,
  },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 15 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#DAE6EF" },
  or: { color: "#678198", fontSize: 11, marginHorizontal: 12 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 17,
    minHeight: 34,
  },
  footerText: { color: "#617A91", fontSize: 11 },
});
