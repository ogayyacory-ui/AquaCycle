import { useState } from "react";
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { createReport } from "../../services/api";

const TYPES = ["Trash / Pollution", "Blocked Drain", "Water Quality", "Broken Pipe"];

export default function ReportScreen() {
  const [type, setType] = useState(TYPES[0]);
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [finding, setFinding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function useLocation() {
    setFinding(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) throw new Error("Allow location access in your device settings.");
      const point = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const nextCoords = { latitude: point.coords.latitude, longitude: point.coords.longitude };
      const [address] = await Location.reverseGeocodeAsync(nextCoords);
      setCoords(nextCoords);
      setLocation([address?.name, address?.street, address?.district || address?.city, address?.region].filter(Boolean).join(", ") || "Current location");
    } catch (error) { Alert.alert("Location unavailable", error.message || "Enter a nearby landmark instead."); }
    finally { setFinding(false); }
  }

  async function addPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Photos permission needed", "Allow photo access to attach evidence.");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.75 });
    if (!result.canceled) setPhoto(result.assets[0]);
  }

  async function submit() {
    if (!details.trim() || !location.trim()) return Alert.alert("Complete the report", "Describe the issue and add a location.");
    setSubmitting(true);
    try {
      await createReport({ problem_type: type, description: details.trim(), location: location.trim(), urgency: "medium", latitude: coords?.latitude, longitude: coords?.longitude, photo_url: photo?.uri });
      Alert.alert("Report submitted", "Thank you — your community can now see this issue.", [{ text: "View map", onPress: () => router.replace("/map") }]);
    } catch (error) { Alert.alert("Couldn’t submit", error.response?.data?.error || error.message || "Please try again."); }
    finally { setSubmitting(false); }
  }

  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.header}><TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.title}>Report a Problem</Text><View style={styles.headerGap} /></View>
    <View style={styles.switch}><Text style={styles.switchActive}>Water Issue</Text><Text style={styles.switchText}>Other</Text></View>
    <Text style={styles.label}>Describe the issue</Text><TextInput value={details} onChangeText={setDetails} multiline textAlignVertical="top" maxLength={500} placeholder="There is trash floating in the river near the bridge. It looks like plastic bottles and other waste." placeholderTextColor="#90A4AE" style={styles.description} /><Text style={styles.count}>{details.length}/500</Text>
    <Text style={styles.label}>Add a photo (optional)</Text><View style={styles.mediaRow}>{photo ? <Image source={{ uri: photo.uri }} style={styles.photo} /> : <View style={styles.photoEmpty}><Text style={styles.photoEmoji}>🌊</Text></View>}<TouchableOpacity style={styles.addPhoto} onPress={addPhoto}><Text style={styles.addPhotoText}>＋</Text></TouchableOpacity></View>
    <Text style={styles.label}>Location</Text><TouchableOpacity style={styles.locationRow} onPress={useLocation} disabled={finding}><Text style={styles.pin}>⌖</Text><Text style={styles.locationText}>{finding ? "Finding your location…" : location || "Use current location"}</Text><Text style={styles.chevron}>›</Text></TouchableOpacity>
    <Text style={styles.label}>Issue Type</Text><View style={styles.types}>{TYPES.map((item) => <TouchableOpacity key={item} onPress={() => setType(item)} style={[styles.type, type === item && styles.typeSelected]}><Text style={[styles.typeText, type === item && styles.typeTextSelected]}>{item}</Text></TouchableOpacity>)}</View>
    <TouchableOpacity style={[styles.submit, submitting && styles.disabled]} onPress={submit} disabled={submitting}><Text style={styles.submitText}>{submitting ? "Submitting…" : "Submit Report"}</Text></TouchableOpacity>
  </ScrollView></View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#F6FCFE" }, content: { padding: 20, paddingTop: Platform.OS === "ios" ? 58 : 35, paddingBottom: 35 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }, back: { color: "#083A56", fontSize: 37, lineHeight: 34 }, title: { color: "#092F48", fontSize: 16, fontWeight: "800" }, headerGap: { width: 24 }, switch: { height: 38, flexDirection: "row", backgroundColor: "#E8F2F6", borderRadius: 12, padding: 3, marginBottom: 22 }, switchActive: { flex: 1, color: "#FFF", fontSize: 11, fontWeight: "800", textAlign: "center", paddingTop: 9, borderRadius: 9, backgroundColor: "#08A8E9" }, switchText: { flex: 1, color: "#5A7484", fontSize: 11, fontWeight: "700", textAlign: "center", paddingTop: 9 }, label: { color: "#163F56", fontSize: 11, fontWeight: "800", marginBottom: 8 }, description: { height: 108, borderColor: "#D3E6ED", borderWidth: 1, borderRadius: 10, backgroundColor: "#FFF", padding: 11, color: "#143B53", fontSize: 12, lineHeight: 17 }, count: { color: "#89A1AD", fontSize: 9, textAlign: "right", marginTop: 4, marginBottom: 18 }, mediaRow: { flexDirection: "row", gap: 10, marginBottom: 21 }, photo: { width: 70, height: 70, borderRadius: 9 }, photoEmpty: { width: 70, height: 70, borderRadius: 9, backgroundColor: "#B7DCE0", alignItems: "center", justifyContent: "center" }, photoEmoji: { fontSize: 32 }, addPhoto: { width: 70, height: 70, borderRadius: 9, borderColor: "#B8DAE6", borderWidth: 1, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center" }, addPhotoText: { color: "#44A9CC", fontSize: 28, fontWeight: "300" }, locationRow: { height: 48, borderWidth: 1, borderColor: "#D3E6ED", borderRadius: 10, backgroundColor: "#FFF", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginBottom: 21 }, pin: { color: "#069EDD", fontSize: 18 }, locationText: { flex: 1, marginLeft: 10, color: "#466676", fontSize: 11 }, chevron: { color: "#4B768D", fontSize: 24 }, types: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, type: { width: "48.5%", minHeight: 37, borderWidth: 1, borderColor: "#D1E6ED", borderRadius: 9, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center" }, typeSelected: { borderColor: "#09A8E9", backgroundColor: "#E4F8FE" }, typeText: { color: "#587484", fontSize: 10 }, typeTextSelected: { color: "#007FAF", fontWeight: "800" }, submit: { height: 51, borderRadius: 14, backgroundColor: "#08A7E6", justifyContent: "center", alignItems: "center", marginTop: 28 }, disabled: { opacity: 0.6 }, submitText: { color: "#FFF", fontSize: 14, fontWeight: "800" } });
