import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AquaCycleLogo from "./AquaCycleLogo";

const BACKGROUNDS = {
  login: require("../assets/aquacycle_login_background.png"),
  signup: require("../assets/aquacycle_signup_background.png"),
};

export default function AuthLayout({ children, screen }) {
  const { height } = useWindowDimensions();
  const heroHeight = Math.max(238, Math.min(320, height * 0.36));

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            imageStyle={styles.heroImage}
            resizeMode="cover"
            source={BACKGROUNDS[screen]}
            style={[styles.hero, { height: heroHeight }]}
          >
            <LinearGradient
              colors={["rgba(197,245,255,0.56)", "rgba(37,174,226,0.04)", "rgba(2,63,110,0.04)"]}
              locations={[0, 0.57, 1]}
              style={StyleSheet.absoluteFill}
            />
            {screen === "signup" && (
              <Pressable
                accessibilityLabel="Back to login"
                accessibilityRole="button"
                hitSlop={12}
                onPress={() =>
                  router.canGoBack() ? router.back() : router.replace("/auth/login")
                }
                style={styles.backButton}
              >
                <ChevronLeft color="#13395D" size={27} strokeWidth={2.2} />
              </Pressable>
            )}
            <View style={styles.brand}>
              <AquaCycleLogo size={68} />
              <Text style={styles.brandName}>
                <Text style={styles.brandAqua}>Aqua</Text>
                <Text style={styles.brandCycleText}>Cycle</Text>
              </Text>
              <Text style={styles.tagline}>Ride  •  Explore  •  Enjoy</Text>
            </View>
          </ImageBackground>

          <View style={styles.panel}>
            {children}
            <View style={styles.brandFooter}>
              <Text style={styles.footerBrand}>AQUACYCLE</Text>
              <Text style={styles.footerDot}>•</Text>
              <Text style={styles.footerCopy}>Every drop has a story</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Image
        accessibilityLabel="Layered blue ocean waves"
        pointerEvents="none"
        resizeMode="stretch"
        source={require("../assets/aquacycle_bottom_waves.png")}
        style={styles.bottomWaves}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#5AC8EA" },
  keyboard: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 74 },
  hero: {
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#56C8E9",
  },
  heroImage: { width: "100%", height: "100%" },
  brand: {
    alignItems: "center",
    paddingTop: 18,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 17,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: -1,
    marginTop: -2,
  },
  brandAqua: { color: "#087FE0" },
  brandCycleText: { color: "#0B2D59" },
  tagline: {
    color: "#183D62",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.35,
    marginTop: 2,
  },
  panel: {
    flexGrow: 1,
    marginTop: -35,
    paddingHorizontal: 24,
    paddingTop: 27,
    paddingBottom: 12,
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0C5F92",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 7,
  },
  brandFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 6,
  },
  footerBrand: { color: "#1788C9", fontSize: 9, fontWeight: "900", letterSpacing: 1.3 },
  footerDot: { color: "#76B6D7", fontSize: 10, marginHorizontal: 7 },
  footerCopy: { color: "#71889B", fontSize: 10 },
  bottomWaves: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    width: "100%",
  },
});
