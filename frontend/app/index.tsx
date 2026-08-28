import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import * as Location from "expo-location";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getWeather } from "../services/weather";

type WeatherData = {
  current: {
    temperature: number | null;
    condition: string;
    windSpeed: number | null;
  };
};

const quickActions = [
  { icon: "💧", label: "Water\nUsage", route: "/impact" },
  { icon: "🤖", label: "AI\nSolutions", route: "/advisor" },
  { icon: "🚰", label: "Report\nLeak", route: "/report" },
  { icon: "◉", label: "Water\nSimulator", route: "/simulator" },
] as const;

type AppRoute = "/impact" | "/advisor" | "/report" | "/simulator" | "/weather" | "/solutions" | "/events" | "/map";

const navigate = (route: AppRoute) => router.push(route as never);

export default function HomeScreen() {
  const [locationName, setLocationName] = useState("Finding your location...");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLocalWeather() {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        throw new Error("Location permission is needed to show local weather.");
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;
      const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const weatherData = await getWeather(latitude, longitude);

      if (isMounted) {
        const placeLabel = [place?.city || place?.district, place?.region, place?.country]
          .filter(Boolean)
          .join(", ");
        setLocationName(placeLabel || "Your location");
        setWeather(weatherData);
      }
    }

    loadLocalWeather().catch((error: unknown) => {
      if (isMounted) {
        setWeatherError(error instanceof Error ? error.message : "Unable to load local weather.");
        setLocationName("Location unavailable");
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentWeather = weather?.current;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Aqua Saver!</Text>
            <Text style={styles.location}>📍 {locationName}</Text>
          </View>
          <TouchableOpacity style={styles.bell} onPress={() => Alert.alert("Notifications", "You are all caught up.")}>
            <Text>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.weatherHero} onPress={() => navigate("/weather")} activeOpacity={0.9}>
          <View>
            <Text style={styles.weatherTitle}>{weather ? "Current weather" : "Local weather"}</Text>
            {weather ? (
              <>
                <Text style={styles.temperature}>{currentWeather?.temperature ?? "--"}°C</Text>
                <Text style={styles.lightRain}>{currentWeather?.condition}</Text>
              </>
            ) : (
              <ActivityIndicator color="#FFFFFF" style={styles.loading} />
            )}
            <View style={styles.weatherMeta}>
              <Text style={styles.metaText}>〽 Wind{"\n"}{currentWeather?.windSpeed ?? "--"} km/h</Text>
            </View>
          </View>
          <Text style={styles.weatherArt}>{weather ? "🌦️" : "📍"}</Text>
        </TouchableOpacity>

        {weatherError && <Text style={styles.weatherError}>{weatherError}</Text>}

        <TouchableOpacity style={styles.insightCard} onPress={() => navigate("/advisor")} activeOpacity={0.85}>
          <View style={styles.insightCopy}>
            <Text style={styles.cardEyebrow}>AI INSIGHT</Text>
            <Text style={styles.insightText}>{weather ? `${currentWeather?.condition}. Check the forecast and plan your water use for today.` : "Allow location access to receive weather-based water advice."}</Text>
            <Text style={styles.link}>Ask Aqua AI  ›</Text>
          </View>
          <Text style={styles.robot}>🤖</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity onPress={() => navigate("/solutions")}><Text style={styles.link}>View All</Text></TouchableOpacity>
        </View>
        <View style={styles.actionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.label} style={styles.action} onPress={() => navigate(action.route)}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.savingsCard} onPress={() => navigate("/impact")}>
          <View>
            <Text style={styles.savingsTitle}>Save Water, Save Tomorrow</Text>
            <Text style={styles.savingsText}>Track your daily usage and be a water hero!</Text>
            <Text style={styles.smallButton}>View Stats</Text>
          </View>
          <Text style={styles.savingsArt}>💧</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Water Journey</Text>
          <TouchableOpacity onPress={() => navigate("/solutions")}><Text style={styles.link}>Explore</Text></TouchableOpacity>
        </View>
        <Text style={styles.journeyText}>Collect rainwater, use it wisely, and return it safely to nature.</Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem icon="⌂" label="Home" active onPress={() => router.replace("/")} />
        <NavItem icon="▣" label="Events" onPress={() => navigate("/events")} />
        <NavItem icon="⌖" label="Map" onPress={() => navigate("/map")} />
        <NavItem icon="▤" label="Report" onPress={() => navigate("/report")} />
        <NavItem icon="◯" label="Profile" onPress={() => Alert.alert("Profile", "Profile settings are coming soon.")} />
      </View>
    </View>
  );
}

function NavItem({ icon, label, active, onPress }: { icon: string; label: string; active?: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={[styles.navIcon, active && styles.activeNav]}>{icon}</Text>
      <Text style={[styles.navLabel, active && styles.activeNav]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F4F8FE" },
  content: { paddingHorizontal: 18, paddingTop: 58, paddingBottom: 110 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  greeting: { color: "#132B4D", fontSize: 16, fontWeight: "800" },
  location: { color: "#788BA4", fontSize: 12, marginTop: 5 },
  bell: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  notificationDot: { position: "absolute", top: 9, right: 9, width: 6, height: 6, borderRadius: 3, backgroundColor: "#EF5350" },
  weatherHero: { minHeight: 180, borderRadius: 18, padding: 18, backgroundColor: "#2F86E5", flexDirection: "row", justifyContent: "space-between", overflow: "hidden" },
  weatherTitle: { color: "#E9F4FF", fontSize: 14, fontWeight: "600" },
  temperature: { color: "#FFFFFF", fontSize: 34, fontWeight: "800", marginTop: 5 },
  lightRain: { color: "#E9F4FF", fontSize: 12 },
  weatherMeta: { flexDirection: "row", gap: 18, marginTop: 20 },
  metaText: { color: "#E9F4FF", fontSize: 10, lineHeight: 16 },
  weatherArt: { fontSize: 70, marginTop: 12, marginRight: 4 },
  loading: { marginTop: 22 },
  weatherError: { color: "#C23B3B", fontSize: 11, marginTop: 8 },
  insightCard: { marginTop: 10, minHeight: 105, borderRadius: 14, padding: 14, backgroundColor: "#FFFFFF", flexDirection: "row", justifyContent: "space-between", alignItems: "center", shadowColor: "#A9BDD5", shadowOpacity: 0.18, shadowRadius: 8, elevation: 2 },
  insightCopy: { flex: 1, paddingRight: 8 },
  cardEyebrow: { color: "#243D61", fontSize: 10, fontWeight: "800", marginBottom: 6 },
  insightText: { color: "#60728C", fontSize: 12, lineHeight: 17 },
  robot: { fontSize: 43 },
  link: { color: "#1577DD", fontSize: 11, fontWeight: "700" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 18, marginBottom: 10 },
  sectionTitle: { color: "#192F50", fontSize: 14, fontWeight: "800" },
  actionsRow: { flexDirection: "row", justifyContent: "space-between" },
  action: { width: "23.5%", minHeight: 84, borderRadius: 12, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", shadowColor: "#A9BDD5", shadowOpacity: 0.13, shadowRadius: 5, elevation: 1 },
  actionIcon: { fontSize: 23, marginBottom: 7 },
  actionLabel: { color: "#516681", fontSize: 10, textAlign: "center", lineHeight: 14 },
  savingsCard: { marginTop: 16, minHeight: 118, borderRadius: 15, padding: 16, backgroundColor: "#DCEEFF", flexDirection: "row", justifyContent: "space-between", overflow: "hidden" },
  savingsTitle: { color: "#173B69", fontSize: 14, fontWeight: "800" },
  savingsText: { color: "#5B7595", fontSize: 11, marginTop: 6 },
  smallButton: { alignSelf: "flex-start", marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, color: "#FFFFFF", backgroundColor: "#1677DD", fontSize: 10, fontWeight: "800", overflow: "hidden" },
  savingsArt: { fontSize: 67, alignSelf: "center" },
  journeyText: { color: "#71839A", fontSize: 12, lineHeight: 19, marginBottom: 12 },
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 75, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 15, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E5EDF6", flexDirection: "row", justifyContent: "space-around" },
  navItem: { alignItems: "center", minWidth: 48 },
  navIcon: { color: "#9AA9BA", fontSize: 21 },
  navLabel: { color: "#9AA9BA", fontSize: 10, marginTop: 3 },
  activeNav: { color: "#1677DD", fontWeight: "800" },
});
