import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { router } from "expo-router";
import { ActivityIndicator, Alert, Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { getWeather } from "../../services/api";

function conditionVisual(code) {
  if (code === 0 || code === 1) return { label: code === 0 ? "Clear sky" : "Mainly clear", kind: "sunny" };
  if (code === 2) return { label: "Partly cloudy", kind: "partly" };
  if (code === 3 || code === 45 || code === 48) return { label: "Cloudy", kind: "cloudy" };
  if (code >= 95) return { label: "Stormy", kind: "storm" };
  if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return { label: "Rain", kind: "rain" };
  return { label: "Cloudy", kind: "cloudy" };
}

function formatTime(value) {
  if (!value) return "--";
  return new Date(value).toLocaleTimeString([], { hour: "numeric" });
}

function formatDay(value, index) {
  if (index === 0) return "TODAY";
  return value ? new Date(`${value}T12:00:00`).toLocaleDateString([], { weekday: "short" }).toUpperCase() : "--";
}

function display(value, suffix = "") {
  return value === null || value === undefined ? "--" : `${value}${suffix}`;
}

export default function WeatherScreen() {
  const [weather, setWeather] = useState(null);
  const [place, setPlace] = useState(null);
  const [state, setState] = useState("loading");
  const [message, setMessage] = useState("");

  const loadWeather = useCallback(async () => {
    setState("loading");
    setMessage("");
    let locationFound = null;

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setState("permission");
        setMessage("Location access is needed for local weather. You can enable it in device settings.");
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        throw new Error("Turn on Location Services in your phone settings, then try again.");
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = position.coords;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error("Your phone did not return valid GPS coordinates. Please try again.");
      }

      let address = {};
      let locationMessage = "";
      try {
        const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
        address = addresses[0] || {};
      } catch {
        locationMessage = "Place name unavailable; showing your GPS coordinates.";
      }

      locationFound = {
        latitude,
        longitude,
        accuracy: position.coords.accuracy,
        city: address.city || address.subregion || address.region || "Your current location",
        region: address.region,
      };
      setPlace(locationFound);

      const result = await getWeather(latitude, longitude);
      setWeather(result);
      setMessage(locationMessage);
      setState("ready");
    } catch (error) {
      setState(locationFound ? "weather-error" : "error");
      setMessage(error.message || "Weather is temporarily unavailable. Check your connection and try again.");
    }
  }, []);

  useEffect(() => { loadWeather(); }, [loadWeather]);

  const openLocationOnMap = useCallback(async () => {
    if (!place) return;

    const query = `${place.latitude},${place.longitude}`;
    try {
      await Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      );
    } catch {
      Alert.alert("Map unavailable", "Could not open a map for your current location.");
    }
  }, [place]);

  if (state === "weather-error" && place) {
    return <View style={styles.stateScreen}>
      <Text style={styles.logo}>AQUACYCLE</Text>
      <Text style={styles.stateTitle}>Weather unavailable</Text>
      <Text style={styles.stateText}>{message}</Text>
      <Text style={styles.stateText}>
        {place.city}{place.region ? `, ${place.region}` : ""}
        {"\n"}GPS: {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
        {"\n"}Accuracy: {place.accuracy == null ? "Unknown" : `±${Math.round(place.accuracy)} metres`}
      </Text>
      <Pressable style={styles.retryButton} onPress={openLocationOnMap}>
        <Text style={styles.retryText}>Open location on map</Text>
      </Pressable>
      <Pressable style={styles.retryButton} onPress={loadWeather}>
        <Text style={styles.retryText}>Retry weather</Text>
      </Pressable>
    </View>;
  }

  if (state !== "ready") {
    return <View style={styles.stateScreen}><Text style={styles.logo}>AQUACYCLE</Text>{state === "loading" ? <><ActivityIndicator color="#35D8EF" size="large" /><Text style={styles.stateTitle}>Finding your local weather</Text></> : <><Text style={styles.stateTitle}>{state === "permission" ? "Location access" : "Location unavailable"}</Text><Text style={styles.stateText}>{message}</Text><Pressable style={styles.retryButton} onPress={loadWeather}><Text style={styles.retryText}>{state === "permission" ? "Try again" : "Retry"}</Text></Pressable></>}</View>;
  }

  const current = weather.current || {};
  const visual = conditionVisual(current.weatherCode);
  const forecast = weather.forecast || [];
  const hourly = (weather.hourly || []).slice(0, 8);

  return <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={false} onRefresh={loadWeather} tintColor="#35D8EF" />}>
    <View style={styles.atmosphere} />
    <View style={styles.topBar}><Pressable hitSlop={12} onPress={() => router.push("/(tabs)/profile")}><Text style={styles.menu}>☰</Text></Pressable><Text style={styles.logo}>AQUACYCLE</Text><Pressable hitSlop={12} onPress={() => router.push("/(tabs)/profile")}><Text style={styles.bell}>♧</Text></Pressable></View>
    <Text style={styles.greeting}>Good morning, Alex</Text>
    <Text style={styles.city}>{place.city}{place.region ? `, ${place.region}` : ""} <Text style={styles.pin}>⌖</Text></Text>
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Your current location</Text>
      <Text style={styles.stateText}>
        GPS: {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
        {"\n"}Accuracy: {place.accuracy == null ? "Unknown" : `±${Math.round(place.accuracy)} metres`}
      </Text>
      <Pressable style={styles.retryButton} onPress={openLocationOnMap}>
        <Text style={styles.retryText}>Open location on map</Text>
      </Pressable>
    </View>
    {!!message && <Text style={styles.stateText}>{message}</Text>}
    <View style={styles.hero}><View><Text style={styles.temperature}>{display(current.temperature)}<Text style={styles.unit}>{weather.units?.temperature || "°C"}</Text></Text><Text style={styles.condition}>{visual.label}</Text><Text style={styles.feels}>♢ Feels like {display(current.feelsLike, weather.units?.temperature || "°C")}</Text></View><WeatherArt kind={visual.kind} /></View>
    <View style={styles.metrics}><Metric icon="♢" label="Humidity" value={display(current.humidity, "%")} /><Metric icon="≋" label="Wind" value={`${display(current.windSpeed, " km/h")}`} /><Metric icon="≈" label="Rain chance" value={display(current.precipitationProbability, "%")} /><Metric icon="↗" label="Direction" value={display(current.windDirection, "°")} /></View>
    <View style={styles.panel}><View style={styles.panelHeader}><Text style={styles.panelTitle}>Hourly forecast</Text><Text style={styles.action}>Updated now</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false}>{hourly.map((item, index) => <View key={`${item.time}-${index}`} style={[styles.hour, index === 0 && styles.activeHour]}><Text style={styles.time}>{index === 0 ? "NOW" : formatTime(item.time)}</Text><MiniWeather code={item.weatherCode} /><Text style={styles.forecastTemp}>{display(item.temperature, weather.units?.temperature || "°C")}</Text><Text style={styles.rain}>{display(item.precipitationProbability, "%")}</Text></View>)}</ScrollView></View>
    <View style={styles.panel}><View style={styles.panelHeader}><Text style={styles.panelTitle}>7-day forecast</Text><Text style={styles.action}>Sunrise {formatTime(forecast[0]?.sunrise)}</Text></View><ScrollView horizontal showsHorizontalScrollIndicator={false}>{forecast.map((item, index) => <View key={item.date || index} style={styles.day}><Text style={styles.time}>{formatDay(item.date, index)}</Text><MiniWeather code={item.weatherCode} /><Text style={styles.forecastTemp}>{display(item.temperatureMax, weather.units?.temperature || "°C")} <Text style={styles.low}>{display(item.temperatureMin, weather.units?.temperature || "°C")}</Text></Text><Text style={styles.rain}>{display(item.precipitationProbability, "%")} rain</Text></View>)}</ScrollView></View>
    <View style={styles.advice}><View style={styles.waveCircle}><Text style={styles.waveIcon}>≈</Text></View><View style={styles.adviceCopy}><Text style={styles.adviceTitle}>AquaCycle conditions</Text><Text style={styles.adviceText}>{current.precipitation > 0 ? "Keep collection containers covered and avoid contaminated runoff." : "Clear conditions are a good time to inspect tanks, gutters and leaks."}</Text></View></View>
  </ScrollView>;
}

function Metric({ icon, label, value }) { return <View style={styles.metric}><Text style={styles.metricIcon}>{icon}</Text><View><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View></View>; }
function MiniWeather({ code }) { const visual = conditionVisual(code); return <Text style={styles.miniIcon}>{visual.kind === "sunny" ? "☼" : visual.kind === "rain" ? "≋" : visual.kind === "storm" ? "ϟ" : "☁"}</Text>; }
function WeatherArt({ kind }) { return <View style={styles.art}><View style={styles.rays} /><View style={[styles.sunDisc, kind === "cloudy" && styles.mutedSun]} /><View style={[styles.cloudOne, kind === "sunny" && styles.hiddenCloud]} /><View style={[styles.cloudTwo, kind === "sunny" && styles.hiddenCloud]} />{(kind === "rain" || kind === "storm") && <Text style={styles.rainLines}>{kind === "storm" ? "ϟ ϟ" : "╱ ╱ ╱"}</Text>}</View>; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#031B33" }, content: { padding: 20, paddingTop: 48, paddingBottom: 30, overflow: "hidden" }, atmosphere: { position: "absolute", width: 380, height: 380, borderRadius: 190, right: -150, top: 0, backgroundColor: "#0A5278", opacity: 0.5 }, topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }, menu: { color: "#E2F9FF", fontSize: 25 }, logo: { color: "#E5FAFF", fontSize: 18, letterSpacing: 4 }, bell: { color: "#D5F6FF", fontSize: 24 }, greeting: { color: "#9BC2D2", fontSize: 13 }, city: { color: "#F3FCFF", fontSize: 21, fontWeight: "700", marginTop: 4 }, pin: { color: "#37D8EF" }, hero: { minHeight: 220, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, temperature: { color: "#FFFFFF", fontSize: 70, fontWeight: "300" }, unit: { fontSize: 25, fontWeight: "600" }, condition: { color: "#EFFBFF", fontSize: 17, marginTop: -4 }, feels: { color: "#39D5EB", fontSize: 12, marginTop: 14 }, art: { width: 170, height: 145, alignItems: "center", justifyContent: "center" }, rays: { position: "absolute", width: 112, height: 112, borderRadius: 56, backgroundColor: "#F5BD35", opacity: 0.24, shadowColor: "#FFC52E", shadowRadius: 25, shadowOpacity: 1 }, sunDisc: { position: "absolute", width: 78, height: 78, borderRadius: 39, backgroundColor: "#FFD64C", shadowColor: "#FFB52B", shadowRadius: 16, shadowOpacity: 1, elevation: 8, top: 25, right: 36 }, mutedSun: { opacity: 0.45 }, cloudOne: { position: "absolute", width: 106, height: 38, borderRadius: 24, backgroundColor: "#F4FBFC", bottom: 28, right: 18, shadowColor: "#B2D5DE", shadowRadius: 9, shadowOpacity: 0.8 }, cloudTwo: { position: "absolute", width: 63, height: 58, borderRadius: 35, backgroundColor: "#FFFFFF", bottom: 35, right: 63, shadowColor: "#B2D5DE", shadowRadius: 9, shadowOpacity: 0.8 }, hiddenCloud: { opacity: 0.18 }, rainLines: { position: "absolute", bottom: 7, right: 53, color: "#5BD8E8", fontSize: 17, letterSpacing: 6 }, metrics: { flexDirection: "row", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#245D77", paddingVertical: 14 }, metric: { flex: 1, flexDirection: "row", alignItems: "center", gap: 5, borderRightWidth: 1, borderRightColor: "#245D77", paddingLeft: 3 }, metricIcon: { color: "#2BD7ED", fontSize: 21 }, metricLabel: { color: "#84B0C0", fontSize: 8 }, metricValue: { color: "#E9FBFF", fontSize: 10, fontWeight: "700", marginTop: 2 }, panel: { backgroundColor: "#0B3855", borderRadius: 15, borderWidth: 1, borderColor: "#15526D", padding: 14, marginTop: 17 }, panelHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 13 }, panelTitle: { color: "#F2FCFF", fontSize: 14, fontWeight: "700" }, action: { color: "#35D8EF", fontSize: 10 }, hour: { width: 57, alignItems: "center", borderRightWidth: 1, borderRightColor: "#1B5871" }, activeHour: { borderBottomWidth: 2, borderBottomColor: "#35D8EF", paddingBottom: 4 }, day: { width: 72, alignItems: "center", borderRightWidth: 1, borderRightColor: "#1B5871" }, time: { color: "#8AB9C8", fontSize: 9, fontWeight: "700" }, miniIcon: { color: "#FFD345", fontSize: 28, marginVertical: 8 }, forecastTemp: { color: "#ECFBFF", fontSize: 11, fontWeight: "700" }, low: { color: "#35C4DD", fontWeight: "500" }, rain: { color: "#72AABD", fontSize: 8, marginTop: 5 }, advice: { flexDirection: "row", alignItems: "center", marginTop: 17, padding: 14, borderRadius: 15, borderWidth: 1, borderColor: "#155B77", backgroundColor: "#0B3D5C" }, waveCircle: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: "#1585A0", justifyContent: "center", alignItems: "center" }, waveIcon: { color: "#35D8EF", fontSize: 31 }, adviceCopy: { flex: 1, marginLeft: 12 }, adviceTitle: { color: "#F0FBFF", fontWeight: "700", fontSize: 13 }, adviceText: { color: "#91BBC8", fontSize: 10, lineHeight: 15, marginTop: 4 }, stateScreen: { flex: 1, backgroundColor: "#031B33", alignItems: "center", justifyContent: "center", padding: 28 }, stateTitle: { color: "#F1FCFF", fontSize: 20, fontWeight: "700", marginTop: 22, textAlign: "center" }, stateText: { color: "#9BC2D2", fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: 10 }, retryButton: { backgroundColor: "#2BD5EB", borderRadius: 22, paddingHorizontal: 25, paddingVertical: 12, marginTop: 22 }, retryText: { color: "#04243A", fontWeight: "800" }
});
