import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { BottomNav } from "../app/index";

export default function WebMapScreen() {
  return <View style={styles.screen}>
    <View style={styles.top}><TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Map</Text><TouchableOpacity style={styles.add} onPress={() => router.push("/report")}><Text style={styles.addText}>＋</Text></TouchableOpacity></View>
    <iframe
      title="AquaCycle issue map"
      src="https://www.openstreetmap.org/export/embed.html?bbox=36.72%2C-1.35%2C36.89%2C-1.22&layer=mapnik&marker=-1.2864%2C36.8172"
      style={styles.mapFrame}
      allowFullScreen
    />
    <View style={styles.card}><View style={styles.dot}><Text style={styles.dotText}>⌖</Text></View><View style={styles.copy}><Text style={styles.cardTitle}>Trash in River</Text><Text style={styles.cardText}>Near Riverside Bridge · Reported recently</Text></View><Text style={styles.arrow}>›</Text></View>
    <BottomNav active="Map" />
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#DCEEF1" },
  top: { height: 56, backgroundColor: "#07324D", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, zIndex: 2 },
  back: { color: "#FFF", fontSize: 33, lineHeight: 30 }, title: { color: "#FFF", fontSize: 15, fontWeight: "800" }, add: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#09A9E7", alignItems: "center", justifyContent: "center" }, addText: { color: "#FFF", fontSize: 20 },
  mapFrame: { borderWidth: 0, flex: 1, height: "100%", width: "100%" },
  card: { position: "absolute", left: 18, right: 18, bottom: 91, minHeight: 81, borderRadius: 15, backgroundColor: "#FFF", padding: 12, flexDirection: "row", alignItems: "center", boxShadow: "0 4px 14px rgba(5,42,62,0.18)" },
  dot: { height: 48, width: 48, borderRadius: 12, backgroundColor: "#F5A623", justifyContent: "center", alignItems: "center" }, dotText: { color: "#FFF", fontSize: 24 }, copy: { flex: 1, marginLeft: 10 }, cardTitle: { color: "#0E3F59", fontSize: 12, fontWeight: "800" }, cardText: { color: "#557382", fontSize: 10, marginTop: 4 }, arrow: { color: "#049CD9", fontSize: 26 },
});
