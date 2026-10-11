import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { createReport } from "../services/api";

const TYPES = ["Pollution", "Flooding", "Blocked drain", "Unsafe water", "Broken pipe", "Sanitation"];

export default function ReportScreen() {
  const [type, setType] = useState(TYPES[0]);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [mediaItems, setMediaItems] = useState([]);
  const [coords, setCoords] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void detectLocation(false);
  }, []);

  async function detectLocation(showAlert = true) {
    try {
      setLocationLoading(true);
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        if (showAlert) {
          Alert.alert("Location permission needed", "Enable location access so your report can be placed automatically.");
        }
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = position.coords;
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = addresses[0] || {};
      const formatted = [address.name, address.street, address.district || address.subregion, address.city || address.region]
        .filter(Boolean)
        .join(", ") || "Current location";

      setCoords({ latitude, longitude });
      setLocation(formatted);

      if (showAlert) {
        Alert.alert("Location found", formatted);
      }
    } catch (error) {
      Alert.alert("Location unavailable", error.message || "Could not determine your location right now.");
    } finally {
      setLocationLoading(false);
    }
  }

  async function pickMedia() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Photo and video access needed", "Allow media access to attach evidence to your report.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
      videoMaxDuration: 30
    });

    if (!result.canceled) {
      const nextItems = result.assets.map((asset) => ({
        ...asset,
        kind: asset.type === "video" ? "video" : "image"
      }));
      setMediaItems((current) => [...current, ...nextItems]);
    }
  }

  function removeMedia(index) {
    setMediaItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function submit() {
    if (!location.trim() || !description.trim()) {
      Alert.alert("Missing information", "Add a location and describe the problem before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const primaryImage = mediaItems.find((item) => item.kind === "image")?.uri || null;
      const primaryVideo = mediaItems.find((item) => item.kind === "video")?.uri || null;

      await createReport({
        problem_type: type,
        location: location.trim(),
        description: description.trim(),
        urgency,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
        photo_url: primaryImage,
        video_url: primaryVideo
      });

      Alert.alert("Report submitted", "Your report has entered the Water Action Network.", [{ text: "Done", onPress: () => router.replace("/(tabs)/profile") }]);
    } catch (error) {
      Alert.alert("Couldn't submit report", error.response?.data?.error || error.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Back</Text></Pressable>
      <Text style={styles.eyebrow}>WATER ACTION NETWORK</Text>
      <Text style={styles.title}>Report a problem</Text>
      <Text style={styles.subtitle}>Help your community respond to local water issues.</Text>

      <Text style={styles.label}>What needs attention?</Text>
      <View style={styles.chips}>{TYPES.map(item => <Pressable key={item} style={[styles.chip, type === item && styles.chipSelected]} onPress={() => setType(item)}><Text style={[styles.chipText, type === item && styles.chipTextSelected]}>{item}</Text></Pressable>)}</View>

      <Text style={styles.label}>Location</Text>
      <View style={styles.locationRow}>
        <TextInput value={location} onChangeText={setLocation} placeholder="Street, landmark or neighborhood" placeholderTextColor="#8AA0A8" style={styles.locationInput} />
        <Pressable style={styles.locationButton} onPress={() => detectLocation(true)} disabled={locationLoading}>
          <Text style={styles.locationButtonText}>{locationLoading ? "Finding..." : "Use my location"}</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Urgency</Text>
      <View style={styles.urgencyRow}>{["low", "medium", "high"].map(item => <Pressable key={item} style={[styles.urgency, urgency === item && styles.urgencySelected]} onPress={() => setUrgency(item)}><Text style={[styles.urgencyText, urgency === item && styles.urgencyTextSelected]}>{item}</Text></Pressable>)}</View>
      <Field label="Details" value={description} onChangeText={setDescription} placeholder="Describe what you observed..." multiline />

      <Text style={styles.label}>Photo or video evidence</Text>
      {mediaItems.length > 0 ? <View style={styles.previewList}>{mediaItems.map((item, index) => (
        <View key={`${item.uri}-${index}`} style={styles.previewCard}>
          {item.kind === "image" ? <Image source={{ uri: item.uri }} style={styles.previewImage} /> : <View style={styles.videoPreview}><Text style={styles.videoText}>🎬</Text></View>}
          <Pressable style={styles.remove} onPress={() => removeMedia(index)}><Text style={styles.removeText}>Remove</Text></Pressable>
        </View>
      ))}</View> : null}
      <Pressable style={styles.upload} onPress={pickMedia}><Text style={styles.uploadIcon}>＋</Text><Text style={styles.uploadText}>Add photo or video</Text></Pressable>
      <Pressable style={[styles.submit, submitting && styles.disabled]} onPress={submit} disabled={submitting}>{submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitText}>Submit report</Text>}</Pressable>
    </ScrollView>
  </KeyboardAvoidingView>;
}

function Field({ label, multiline, ...props }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} multiline={multiline} textAlignVertical={multiline ? "top" : "center"} placeholderTextColor="#8AA0A8" style={[styles.input, multiline && styles.multiline]} /></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4FBFC" },
  content: { padding: 24, paddingTop: 58, paddingBottom: 50 },
  back: { color: "#087EA4", fontSize: 14, fontWeight: "700", marginBottom: 28 },
  eyebrow: { color: "#087EA4", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  title: { color: "#082F49", fontSize: 34, fontWeight: "800", marginTop: 8 },
  subtitle: { color: "#64748B", fontSize: 14, marginTop: 8, marginBottom: 26 },
  label: { color: "#082F49", fontSize: 12, fontWeight: "800", marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  chip: { borderWidth: 1, borderColor: "#CBE3E7", borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: "#FFFFFF" },
  chipSelected: { backgroundColor: "#087EA4", borderColor: "#087EA4" },
  chipText: { color: "#52717B", fontSize: 11 },
  chipTextSelected: { color: "#FFFFFF", fontWeight: "700" },
  field: { marginBottom: 18 },
  input: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D5E8EB", borderRadius: 11, minHeight: 46, paddingHorizontal: 13, color: "#082F49", fontSize: 13 },
  multiline: { minHeight: 120, paddingTop: 13 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 },
  locationInput: { flex: 1, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D5E8EB", borderRadius: 11, minHeight: 46, paddingHorizontal: 13, color: "#082F49", fontSize: 13 },
  locationButton: { backgroundColor: "#DCF7FA", borderColor: "#87D9E7", borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 12 },
  locationButtonText: { color: "#0A5F77", fontSize: 11, fontWeight: "800" },
  urgencyRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  urgency: { flex: 1, borderWidth: 1, borderColor: "#D5E8EB", borderRadius: 10, alignItems: "center", paddingVertical: 10, backgroundColor: "#FFFFFF" },
  urgencySelected: { borderColor: "#087EA4", backgroundColor: "#E4F7FA" },
  urgencyText: { color: "#64748B", fontSize: 12, textTransform: "capitalize" },
  urgencyTextSelected: { color: "#087EA4", fontWeight: "800" },
  upload: { minHeight: 78, borderWidth: 1, borderStyle: "dashed", borderColor: "#89C4CF", borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", marginBottom: 22 },
  uploadIcon: { color: "#087EA4", fontSize: 25 },
  uploadText: { color: "#087EA4", fontSize: 11, fontWeight: "700" },
  previewList: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 },
  previewCard: { width: 92, marginRight: 10, marginBottom: 10 },
  previewImage: { width: 92, height: 92, borderRadius: 12 },
  videoPreview: { width: 92, height: 92, borderRadius: 12, backgroundColor: "#D9F4F8", alignItems: "center", justifyContent: "center" },
  videoText: { fontSize: 28 },
  remove: { backgroundColor: "#E0F2F7", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 8 },
  removeText: { color: "#005A7A", fontSize: 11, fontWeight: "700", textAlign: "center" },
  submit: { backgroundColor: "#0F766E", borderRadius: 12, paddingVertical: 15, alignItems: "center", marginTop: 8 },
  disabled: { opacity: 0.65 },
  submitText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" }
});
