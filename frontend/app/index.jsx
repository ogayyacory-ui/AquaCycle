import { useEffect, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";

import { getWeather } from "../services/weather";
import { useAuth } from "../context/AuthContext";

const actions = [
  ["⚠", "Report a\nProblem", "/report"],
  ["⌖", "View\nMap", "/map"],
  ["▣", "Events", "/events"],
  ["◈", "AI\nAssistant", "/advisor"],
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [place, setPlace] = useState("Finding your location…");
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    async function loadLocalWeather() {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) throw new Error("Allow location access to see local weather.");
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { latitude, longitude } = position.coords;
        try {
          const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (active) setPlace([address?.city || address?.district, address?.region, address?.country].filter(Boolean).join(", ") || "Your location");
        } catch { if (active) setPlace("Your location"); }
        try {
          const data = await getWeather(latitude, longitude);
          if (active) setWeather(data);
        } catch { if (active) setWeatherError("Weather is temporarily unavailable."); }
      } catch (error) {
        if (active) setPlace(error.message || "Location unavailable");
      }
    }
    loadLocalWeather();
    return () => { active = false; };
  }, [user]);

  if (!user) return <Welcome />;
  const firstName = user.name.split(" ")[0];
  return <View style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.top}><View><Text style={styles.greeting}>☀  Good morning, {firstName}</Text><Text style={styles.location}>⌖  {place}</Text></View><TouchableOpacity onPress={() => router.push("/profile")} style={styles.avatar}><Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text></TouchableOpacity></View>
      <TouchableOpacity style={styles.weather} onPress={() => router.push("/weather")}><View><Text style={styles.weatherCaption}>Today’s Weather</Text><Text style={styles.weatherTemp}>{weather?.current?.temperature ?? "--"}°</Text><Text style={styles.weatherDetail}>{weather?.current?.condition || "Loading local conditions"}</Text></View><View style={styles.weatherRight}><Text style={styles.weatherIcon}>⛅</Text><Text style={styles.weatherDetail}>Wind {weather?.current?.windSpeed ?? "--"} km/h</Text></View></TouchableOpacity>
      {weatherError && <Text style={styles.weatherError}>{weatherError}</Text>}
      <View style={styles.alert}><Text style={styles.alertIcon}>⚠</Text><View><Text style={styles.alertTitle}>Water Alert</Text><Text style={styles.alertCopy}>Heavy rain is expected this evening. Keep local drains clear.</Text><TouchableOpacity onPress={() => router.push("/map")}><Text style={styles.alertLink}>View details</Text></TouchableOpacity></View></View>
      <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Upcoming Events</Text><TouchableOpacity onPress={() => router.push("/events")}><Text style={styles.seeAll}>See all</Text></TouchableOpacity></View>
      <TouchableOpacity style={styles.event} onPress={() => router.push("/events")}><View style={styles.eventArt}><Text style={styles.eventEmoji}>🌿</Text></View><View style={styles.eventCopy}><Text style={styles.eventTitle}>River Cleanup Drive</Text><Text style={styles.eventMeta}>Apr 26, 2026 · 9:00 AM</Text><Text style={styles.eventMeta}>⌖ Riverside Park</Text></View><Text style={styles.plus}>+</Text></TouchableOpacity>
      <View style={styles.actions}>{actions.map(([icon, label, path]) => <TouchableOpacity key={path} style={styles.action} onPress={() => router.push(path)}><View style={styles.actionIcon}><Text>{icon}</Text></View><Text style={styles.actionText}>{label}</Text></TouchableOpacity>)}</View>
    </ScrollView>
    <BottomNav active="Home" />
  </View>;
}

function Welcome() {
  return <ImageBackground source={{ uri: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=90" }} style={styles.welcome} imageStyle={styles.welcomeImage}>
    <View style={styles.welcomeShade}><View><Text style={styles.welcomeMark}>♧</Text><Text style={styles.welcomeBrand}>AquaCycle</Text><Text style={styles.welcomeTag}>Cleaner Water. Healthier Communities.{"\n"}A Brighter Future.</Text></View><View><TouchableOpacity style={styles.start} onPress={() => router.push("/auth/signup")}><Text style={styles.startText}>Get Started</Text></TouchableOpacity><TouchableOpacity onPress={() => router.push("/auth/login")}><Text style={styles.loginText}>Log In</Text></TouchableOpacity></View></View>
  </ImageBackground>;
}

export function BottomNav({ active }) {
  const tabs = [["⌂", "Home", "/"], ["⌖", "Map", "/map"], ["▣", "Events", "/events"], ["♙", "Profile", "/profile"]];
  return <View style={styles.bottomNav}>{tabs.map(([icon, label, path]) => <TouchableOpacity key={label} style={styles.tab} onPress={() => router.replace(path)}><Text style={[styles.tabIcon, active === label && styles.active]}>{icon}</Text><Text style={[styles.tabText, active === label && styles.active]}>{label}</Text></TouchableOpacity>)}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4FBFF" }, content: { padding: 18, paddingTop: 57, paddingBottom: 96 }, top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, greeting: { color: "#083A56", fontSize: 16, fontWeight: "800" }, location: { color: "#718B9A", fontSize: 11, marginTop: 5, maxWidth: 250 }, avatar: { width: 39, height: 39, borderRadius: 20, backgroundColor: "#087EA4", alignItems: "center", justifyContent: "center" }, avatarText: { color: "#FFF", fontWeight: "800", fontSize: 16 }, weather: { minHeight: 130, padding: 17, borderRadius: 16, backgroundColor: "#075B87", flexDirection: "row", justifyContent: "space-between" }, weatherCaption: { color: "#A9E9FC", fontSize: 11 }, weatherTemp: { color: "#FFF", fontSize: 42, fontWeight: "800", marginTop: 6 }, weatherDetail: { color: "#DEF5FC", fontSize: 11 }, weatherRight: { alignItems: "flex-end", justifyContent: "center" }, weatherIcon: { fontSize: 42, marginBottom: 7 }, weatherError: { color: "#A35300", fontSize: 11, marginTop: 7 }, alert: { backgroundColor: "#FFF6EA", borderRadius: 13, padding: 12, flexDirection: "row", gap: 10, marginTop: 13 }, alertIcon: { color: "#F29C30", fontSize: 21 }, alertTitle: { color: "#674719", fontSize: 12, fontWeight: "800" }, alertCopy: { color: "#856D4B", fontSize: 10, lineHeight: 14, marginTop: 3, paddingRight: 14 }, alertLink: { color: "#008FCB", fontSize: 10, fontWeight: "800", marginTop: 5 }, sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 21, marginBottom: 10 }, sectionTitle: { color: "#103E57", fontSize: 15, fontWeight: "800" }, seeAll: { color: "#009ADB", fontSize: 11, fontWeight: "700" }, event: { minHeight: 76, backgroundColor: "#FFF", borderRadius: 13, padding: 9, flexDirection: "row", alignItems: "center", shadowColor: "#4B7992", shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }, eventArt: { width: 58, height: 58, borderRadius: 10, backgroundColor: "#CFE9D4", justifyContent: "center", alignItems: "center" }, eventEmoji: { fontSize: 30 }, eventCopy: { flex: 1, marginLeft: 10 }, eventTitle: { color: "#0B3E57", fontSize: 12, fontWeight: "800" }, eventMeta: { color: "#718B9A", fontSize: 10, marginTop: 4 }, plus: { backgroundColor: "#0B9FDB", color: "#FFF", fontSize: 19, borderRadius: 12, overflow: "hidden", textAlign: "center", width: 25, height: 25 }, actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 22 }, action: { alignItems: "center", width: "23%" }, actionIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E6F7FC", borderWidth: 1, borderColor: "#C9EAF2", alignItems: "center", justifyContent: "center" }, actionText: { color: "#486A7C", fontSize: 9, fontWeight: "700", textAlign: "center", lineHeight: 12, marginTop: 7 }, bottomNav: { position: "absolute", left: 0, right: 0, bottom: 0, height: 73, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#DFEFF4", flexDirection: "row", justifyContent: "space-around", paddingTop: 9 }, tab: { width: 62, alignItems: "center" }, tabIcon: { color: "#8AA7B5", fontSize: 21 }, tabText: { color: "#8AA7B5", fontSize: 9, marginTop: 3 }, active: { color: "#009CDB", fontWeight: "800" },
  welcome: { flex: 1, backgroundColor: "#06334E" }, welcomeImage: { opacity: 0.96 }, welcomeShade: { flex: 1, padding: 28, paddingVertical: 82, justifyContent: "space-between", backgroundColor: "rgba(3, 42, 68, 0.25)" }, welcomeMark: { color: "#F1FCFF", fontSize: 78, textAlign: "center", textShadowColor: "rgba(0,0,0,0.28)", textShadowRadius: 10 }, welcomeBrand: { color: "#FFF", fontSize: 37, fontWeight: "800", textAlign: "center", marginTop: 5, textShadowColor: "rgba(0,0,0,0.25)", textShadowRadius: 8 }, welcomeTag: { color: "#F3FCFE", fontSize: 12, lineHeight: 19, textAlign: "center", marginTop: 10, textShadowColor: "rgba(0,0,0,0.45)", textShadowRadius: 7 }, start: { height: 53, backgroundColor: "#00A6E6", borderRadius: 27, justifyContent: "center", alignItems: "center", shadowColor: "#001E30", shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 }, startText: { color: "#FFF", fontWeight: "800" }, loginText: { color: "#F1FCFF", fontSize: 13, textAlign: "center", marginTop: 17, fontWeight: "700", textShadowColor: "rgba(0,0,0,0.5)", textShadowRadius: 6 },
});
