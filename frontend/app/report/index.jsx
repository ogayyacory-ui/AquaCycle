import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function ReportScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.icon}>🚨</Text>
      <Text style={styles.title}>Report a Water Problem</Text>
      <Text style={styles.description}>
        Help your community identify pollution, flooding, blocked drains, unsafe water, broken pipes and sanitation problems.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What needs attention?</Text>
        <Text style={styles.cardText}>A full report form can be added here with location, photos and details.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4FBFC" },
  content: { padding: 25, paddingTop: 60, paddingBottom: 40 },
  icon: { fontSize: 45 },
  title: { marginTop: 15, fontSize: 32, lineHeight: 38, fontWeight: "800", color: "#063B4C" },
  description: { marginTop: 15, fontSize: 16, lineHeight: 25, color: "#668087" },
  card: { marginTop: 28, padding: 20, borderRadius: 18, backgroundColor: "#FFF4E8" },
  cardTitle: { fontSize: 19, fontWeight: "800", color: "#633E1C" },
  cardText: { marginTop: 7, fontSize: 14, lineHeight: 21, color: "#80644B" },
  button: { marginTop: 30, padding: 16, borderRadius: 15, backgroundColor: "#11C5D9", alignItems: "center" },
  buttonText: { fontWeight: "800", color: "#00323D" },
});
