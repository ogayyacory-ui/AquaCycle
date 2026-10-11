import { useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const googleConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "missing-google-web-client-id",
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "missing-google-android-client-id",
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "missing-google-ios-client-id",
  selectAccount: true,
};

const configured = Boolean(
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID &&
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID &&
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
);

export default function GoogleSignInButton({ onSuccess, disabled = false }) {
  const [request, response, promptAsync] = Google.useAuthRequest(googleConfig);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.params?.id_token || response.authentication?.idToken;
      if (!idToken) {
        Alert.alert("Google sign-in failed", "Google did not return an identity token. Check your OAuth client setup.");
        return;
      }
      onSuccessRef.current(idToken).catch((error) => Alert.alert("Google sign-in failed", error.response?.data?.error || error.message || "Please try again."));
    } else if (response?.type === "error") {
      Alert.alert("Google sign-in failed", response.error?.message || "Please try again.");
    }
  }, [response]);

  function signIn() {
    if (!configured) {
      Alert.alert("Google OAuth needs configuration", "Add the Android, iOS, and web Google client IDs to frontend/.env. See .env.example for the variable names.");
      return;
    }
    promptAsync();
  }

  return <TouchableOpacity style={[styles.button, disabled && styles.disabled]} onPress={signIn} disabled={!request || disabled}>
    <Text style={styles.text}>G   Continue with Google</Text>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  button: { height: 51, borderRadius: 13, borderWidth: 1, borderColor: "#C9DFE8", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" },
  disabled: { opacity: 0.65 },
  text: { color: "#17445B", fontWeight: "700" },
});
