import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import GoogleSignInButton from "../../components/GoogleSignInButton";

export default function LoginScreen() {
  const { signIn, signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  async function submit() {
    setErrorMessage("");
    if (!email.trim() || !password) {
      setErrorMessage("Enter your email address and password.");
      return;
    }
    try {
      await signIn({ email: email.trim(), password });
      router.replace("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
        (error.code === "ERR_NETWORK"
          ? "Unable to reach the server. Check your connection and try again."
          : error.message || "Check your email and password.")
      );
    }
  }
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
    <View style={styles.card}><Text style={styles.mark}>◈</Text><Text style={styles.brand}>Welcome back</Text><Text style={styles.copy}>Log in to continue your water action journey.</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#8BA2B2" style={styles.input} autoCapitalize="none" keyboardType="email-address" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#8BA2B2" style={styles.input} secureTextEntry />
      {errorMessage ? <Text accessibilityRole="alert" style={styles.error}>{errorMessage}</Text> : null}
      <TouchableOpacity style={[styles.button, loading && styles.dim]} onPress={submit} disabled={loading}><Text style={styles.buttonText}>{loading ? "Logging in…" : "Log in"}</Text></TouchableOpacity>
      <View style={styles.google}><GoogleSignInButton disabled={loading} onSuccess={async (idToken) => { await signInWithGoogle(idToken); router.replace("/"); }} /></View>
      <Text style={styles.foot}>New to AquaCycle? <Link href="/auth/signup" style={styles.link}>Create an account</Link></Text>
    </View>
  </KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#062B47", justifyContent: "center", padding: 22 }, card: { backgroundColor: "#F7FCFE", borderRadius: 25, padding: 25 }, mark: { color: "#009EDF", fontSize: 45, textAlign: "center" }, brand: { color: "#082F49", fontSize: 29, fontWeight: "800", textAlign: "center", marginTop: 8 }, copy: { color: "#66808E", textAlign: "center", marginTop: 7, marginBottom: 25 }, input: { height: 52, borderRadius: 12, borderWidth: 1, borderColor: "#D4E7EE", backgroundColor: "#FFF", paddingHorizontal: 15, color: "#082F49", marginBottom: 12 }, error: { color: "#A52828", fontSize: 13, marginBottom: 10 }, button: { height: 52, borderRadius: 13, backgroundColor: "#009EDF", alignItems: "center", justifyContent: "center", marginTop: 4 }, dim: { opacity: 0.65 }, buttonText: { color: "#FFF", fontWeight: "800", fontSize: 15 }, google: { marginTop: 12 }, foot: { textAlign: "center", color: "#647B88", marginTop: 20 }, link: { color: "#008FCE", fontWeight: "800" } });
