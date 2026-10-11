import { useEffect, useRef } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const isConfigured = Boolean(webClientId && androidClientId && iosClientId);

export default function GoogleAuthButton({ disabled = false, onSuccess }) {
  const onSuccessRef = useRef(onSuccess);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: webClientId || "missing-google-web-client-id",
    androidClientId: androidClientId || "missing-google-android-client-id",
    iosClientId: iosClientId || "missing-google-ios-client-id",
    selectAccount: true,
  });

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.params?.id_token || response.authentication?.idToken;
      if (!idToken) {
        Alert.alert(
          "Google sign-in unavailable",
          "Google did not return an identity token. Check the OAuth client configuration."
        );
        return;
      }

      onSuccessRef.current(idToken).catch((error) => {
        Alert.alert("Google sign-in failed", error.message || "Please try again.");
      });
    } else if (response?.type === "error") {
      Alert.alert(
        "Google sign-in failed",
        response.error?.message || "Please try again."
      );
    }
  }, [response]);

  function handlePress() {
    if (!isConfigured) {
      Alert.alert(
        "Google sign-in needs setup",
        "Set the Android, iOS, and web Google client IDs in mobile/.env, and configure the matching client IDs on the Flask server."
      );
      return;
    }

    promptAsync();
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      accessibilityState={{ disabled: disabled || (isConfigured && !request) }}
      disabled={disabled || (isConfigured && !request)}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.googleG}>G</Text>
      <Text style={styles.label}>Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 49,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#87BFFF",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { backgroundColor: "#F1F8FF" },
  disabled: { opacity: 0.6 },
  googleG: { color: "#4285F4", fontSize: 17, fontWeight: "900", marginRight: 11 },
  label: { color: "#17416A", fontSize: 12, fontWeight: "700" },
});
