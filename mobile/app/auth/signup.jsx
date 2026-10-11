import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { LockKeyhole, Mail, Phone, UserRound } from "lucide-react-native";
import AuthInput from "../../components/AuthInput";
import AuthLayout from "../../components/AuthLayout";
import GradientButton from "../../components/GradientButton";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import { signInWithGoogle, signUp } from "../../services/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen() {
  const nameInput = useRef(null);
  const emailInput = useRef(null);
  const phoneInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmationInput = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!name.trim() || !email.trim() || !password || !confirmation) {
      setError("Complete your name, email, password, and password confirmation.");
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      router.replace("/(tabs)/home");
    } catch (requestError) {
      setError(requestError.message || "Unable to create your account. Please try again.");
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
    <AuthLayout screen="signup">
      <Text style={styles.heading}>Create Your Account</Text>
      <Text style={styles.subtitle}>
        Join AquaCycle and start your water adventure today.
      </Text>

      <AuthInput
        autoCapitalize="words"
        autoComplete="name"
        icon={UserRound}
        inputRef={nameInput}
        onChangeText={setName}
        onSubmitEditing={() => emailInput.current?.focus()}
        placeholder="Full Name"
        textContentType="name"
        value={name}
      />
      <AuthInput
        autoComplete="email"
        icon={Mail}
        inputRef={emailInput}
        keyboardType="email-address"
        onChangeText={setEmail}
        onSubmitEditing={() => phoneInput.current?.focus()}
        placeholder="Email Address"
        textContentType="emailAddress"
        value={email}
      />
      <AuthInput
        autoComplete="tel"
        icon={Phone}
        inputRef={phoneInput}
        keyboardType="phone-pad"
        onChangeText={setPhone}
        onSubmitEditing={() => passwordInput.current?.focus()}
        placeholder="Phone Number"
        textContentType="telephoneNumber"
        value={phone}
      />
      <AuthInput
        autoComplete="new-password"
        icon={LockKeyhole}
        inputRef={passwordInput}
        onChangeText={setPassword}
        onSubmitEditing={() => confirmationInput.current?.focus()}
        placeholder="Password (at least 8 characters)"
        secureTextEntry
        textContentType="newPassword"
        value={password}
      />
      <AuthInput
        autoComplete="new-password"
        icon={LockKeyhole}
        inputRef={confirmationInput}
        onChangeText={setConfirmation}
        onSubmitEditing={submit}
        placeholder="Confirm Password"
        returnKeyType="go"
        secureTextEntry
        textContentType="newPassword"
        value={confirmation}
      />

      {!!error && (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      )}

      <GradientButton label="Sign Up" loading={loading} onPress={submit} />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.or}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <GoogleAuthButton disabled={loading} onSuccess={continueWithGoogle} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable accessibilityRole="link" onPress={() => router.replace("/auth/login")}>
          <Text style={styles.link}>Login</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  heading: { color: "#102B55", fontSize: 24, lineHeight: 30, fontWeight: "800" },
  subtitle: {
    color: "#5E7893",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
    marginBottom: 15,
  },
  error: {
    color: "#B42332",
    backgroundColor: "#FFF2F3",
    borderRadius: 8,
    padding: 9,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 4,
  },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#DAE6EF" },
  or: { color: "#678198", fontSize: 11, marginHorizontal: 12 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 13,
    minHeight: 34,
  },
  footerText: { color: "#617A91", fontSize: 11 },
  link: { color: "#067BE0", fontSize: 11, fontWeight: "700" },
});
