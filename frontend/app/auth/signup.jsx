import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import GoogleSignInButton from "../../components/GoogleSignInButton";

export default function SignUpScreen() {
  const { signUp, signInWithGoogle, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    if (!name.trim() || !email.trim() || password.length < 8) {
      Alert.alert("Check your details", "Enter your name, a valid email, and a password of at least 8 characters.");
      return;
    }
    try {
      await signUp({ name: name.trim(), email: email.trim(), password });
      router.replace("/");
    } catch (error) {
      Alert.alert("Couldn’t create account", error.message || "Please try again.");
    }
  }

  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
    <View style={styles.hero}><Text style={styles.mark}>◈</Text><Text style={styles.brand}>AquaCycle</Text><Text style={styles.heroCopy}>Cleaner water starts with people who care.</Text></View>
    <View style={styles.sheet}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Join your local water action community.</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Full name" placeholderTextColor="#8BA2B2" style={styles.input} autoCapitalize="words" />
      <TextInput value={email} onChangeText={setEmail} placeholder="Email address" placeholderTextColor="#8BA2B2" style={styles.input} autoCapitalize="none" keyboardType="email-address" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password (8+ characters)" placeholderTextColor="#8BA2B2" style={styles.input} secureTextEntry />
      <TouchableOpacity style={[styles.primary, loading && styles.dim]} onPress={submit} disabled={loading}><Text style={styles.primaryText}>{loading ? "Creating account…" : "Create account"}</Text></TouchableOpacity>
      <View style={styles.google}><GoogleSignInButton disabled={loading} onSuccess={async (idToken) => { await signInWithGoogle(idToken); router.replace("/"); }} /></View>
      <Text style={styles.foot}>Already a member? <Link href="/auth/login" style={styles.link}>Log in</Link></Text>
    </View>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#062B47",
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    width: "100%",
    maxWidth: 920,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#087EAC",
  },
  mark: { color: "#DFF9FF", fontSize: 56, textAlign: "center" },
  brand: { color: "#FFF", fontSize: 34, fontWeight: "800", textAlign: "center", marginTop: 6 },
  heroCopy: { color: "#DFF8FF", textAlign: "center", marginTop: 10, fontSize: 14 },
  sheet: {
    width: "100%",
    maxWidth: 920,
    backgroundColor: "#F7FCFE",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingTop: 30,
    alignSelf: "center",
  },
  title: { color: "#082F49", fontSize: 27, fontWeight: "800" },
  subtitle: { color: "#66808E", marginTop: 6, marginBottom: 23 },
  input: { height: 51, borderRadius: 12, borderWidth: 1, borderColor: "#D4E7EE", backgroundColor: "#FFF", paddingHorizontal: 15, color: "#082F49", marginBottom: 12 },
  primary: { height: 51, borderRadius: 13, backgroundColor: "#009EDF", alignItems: "center", justifyContent: "center", marginTop: 4 },
  dim: { opacity: 0.65 },
  primaryText: { color: "#FFF", fontWeight: "800", fontSize: 15 },
  google: { marginTop: 12 },
  foot: { textAlign: "center", color: "#647B88", marginTop: 18 },
  link: { color: "#008FCE", fontWeight: "800" },
});
