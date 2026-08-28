import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function SolutionsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>AQUACYCLE SOLUTIONS</Text>
      <Text style={styles.title}>Practical ways to protect every drop.</Text>
      <Text style={styles.description}>
        Explore water collection, treatment, reuse and community solutions for a healthier environment.
      </Text>
      {[
        ["Rainwater collection", "Capture rainfall for gardens, cleaning and other non-drinking uses."],
        ["Greywater reuse", "Give lightly used household water a second life through safe reuse."],
        ["Community action", "Work together to identify problems and improve local water systems."],
      ].map(([title, description]) => (
        <View style={styles.card} key={title}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardText}>{description}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4FBFC" },
  content: { padding: 25, paddingTop: 60, paddingBottom: 40 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.5, color: "#00A7BD" },
  title: { marginTop: 8, fontSize: 34, lineHeight: 40, fontWeight: "800", color: "#063B4C" },
  description: { marginTop: 14, fontSize: 16, lineHeight: 24, color: "#668087" },
  card: { marginTop: 18, padding: 20, borderRadius: 18, backgroundColor: "#FFFFFF" },
  cardTitle: { fontSize: 19, fontWeight: "800", color: "#063B4C" },
  cardText: { marginTop: 7, fontSize: 14, lineHeight: 21, color: "#668087" },
  button: { marginTop: 28, padding: 16, borderRadius: 15, backgroundColor: "#11C5D9", alignItems: "center" },
  buttonText: { fontWeight: "800", color: "#00323D" },
});
