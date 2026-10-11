import { useMemo, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { BottomNav } from "../app/index";

const issues = [
  { id: "1", title: "Trash in River", subtitle: "Near Riverside Bridge", coordinate: { latitude: -1.2864, longitude: 36.8172 }, color: "#F5A623" },
  { id: "2", title: "Blocked Drain", subtitle: "Westlands, Nairobi", coordinate: { latitude: -1.2676, longitude: 36.8108 }, color: "#F05267" },
  { id: "3", title: "Water quality check", subtitle: "Kilimani", coordinate: { latitude: -1.2921, longitude: 36.7837 }, color: "#12A8D8" },
];

export default function MapScreen() {
  const [selected, setSelected] = useState(issues[0]);
  const region = useMemo(() => ({ latitude: -1.285, longitude: 36.803, latitudeDelta: 0.12, longitudeDelta: 0.12 }), []);
  return <View style={styles.screen}>
    <MapView style={styles.map} provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined} initialRegion={region} showsUserLocation showsMyLocationButton zoomEnabled scrollEnabled rotateEnabled pitchEnabled>
      {issues.map((issue) => <Marker key={issue.id} coordinate={issue.coordinate} title={issue.title} description={issue.subtitle} pinColor={issue.color} onPress={() => setSelected(issue)} />)}
    </MapView>
    <View style={styles.top}><TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Map</Text><TouchableOpacity style={styles.add} onPress={() => router.push("/report")}><Text style={styles.addText}>＋</Text></TouchableOpacity></View>
    <View style={styles.segment}><Text style={styles.segmentActive}>Issues</Text><Text style={styles.segmentText}>Events</Text></View>
    <TouchableOpacity style={styles.issueCard} onPress={() => router.push("/report")}><View style={[styles.issueDot, { backgroundColor: selected.color }]}><Text style={styles.issuePin}>⌖</Text></View><View style={styles.issueCopy}><Text style={styles.issueTitle}>{selected.title}</Text><Text style={styles.issueSubtitle}>{selected.subtitle}</Text><Text style={styles.issueWhen}>Reported recently</Text></View><Text style={styles.chevron}>›</Text></TouchableOpacity>
    <BottomNav active="Map" />
  </View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#DCEEF1" }, map: { ...StyleSheet.absoluteFillObject }, top: { position: "absolute", top: Platform.OS === "ios" ? 52 : 25, left: 18, right: 18, height: 45, borderRadius: 14, backgroundColor: "#07324D", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 13 }, back: { color: "#FFF", fontSize: 33, lineHeight: 30 }, title: { color: "#FFF", fontSize: 15, fontWeight: "800" }, add: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#09A9E7", alignItems: "center", justifyContent: "center" }, addText: { color: "#FFF", fontSize: 20 }, segment: { position: "absolute", top: Platform.OS === "ios" ? 107 : 80, left: 52, right: 52, height: 37, borderRadius: 12, backgroundColor: "#EAF7FA", padding: 3, flexDirection: "row" }, segmentActive: { flex: 1, color: "#FFF", backgroundColor: "#08A7E6", borderRadius: 9, paddingTop: 8, textAlign: "center", fontSize: 11, fontWeight: "800" }, segmentText: { flex: 1, color: "#567483", paddingTop: 8, textAlign: "center", fontSize: 11, fontWeight: "700" }, issueCard: { position: "absolute", left: 18, right: 18, bottom: 91, minHeight: 81, borderRadius: 15, backgroundColor: "#FFF", padding: 12, flexDirection: "row", alignItems: "center", shadowColor: "#052A3E", shadowOpacity: 0.18, shadowRadius: 9, elevation: 5 }, issueDot: { height: 48, width: 48, borderRadius: 12, justifyContent: "center", alignItems: "center" }, issuePin: { color: "#FFF", fontSize: 24 }, issueCopy: { flex: 1, marginLeft: 10 }, issueTitle: { color: "#0E3F59", fontSize: 12, fontWeight: "800" }, issueSubtitle: { color: "#557382", fontSize: 10, marginTop: 4 }, issueWhen: { color: "#899FA9", fontSize: 9, marginTop: 3 }, chevron: { color: "#049CD9", fontSize: 26 } });
