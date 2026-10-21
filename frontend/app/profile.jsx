import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { BottomNav } from "./index";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  if (!user) {
    return (
      <View style={styles.signedOutScreen}>
        <Text style={styles.signedOutTitle}>You’re not signed in</Text>
        <Text style={styles.signedOutCopy}>Log in to view your profile.</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>
    );
  }
  function logout() { signOut(); router.replace("/"); }
  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><Text style={styles.back} onPress={() => router.back()}>‹</Text><View style={styles.avatar}><Text style={styles.initial}>{user.name.charAt(0).toUpperCase()}</Text></View><Text style={styles.name}>{user.name}</Text><Text style={styles.email}>{user.email}</Text><View style={styles.badge}><Text style={styles.badgeText}>✓  Eco Warrior</Text></View><View style={styles.stats}><Stat value="12" label="Reports" /><Stat value="5" label="Events" /><Stat value="3.2 kg" label="Waste removed" /></View><Menu label="My Reports" sub="View your reported issues" onPress={() => router.push("/map")} /><Menu label="My Events" sub="Events you’re attending or joined" onPress={() => router.push("/events")} /><Menu label="Officer Portal" sub="Service status and response overview" onPress={() => router.push("/officer")} /><Menu label="Settings" sub="Notifications, account & privacy" onPress={() => Alert.alert("Settings", "Account settings are coming next.")} /><TouchableOpacity style={styles.logout} onPress={logout}><Text style={styles.logoutText}>Log out</Text></TouchableOpacity></ScrollView><BottomNav active="Profile" /></View>;
}
function Stat({ value, label }) { return <View style={styles.stat}><Text style={styles.value}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
function Menu({ label, sub, onPress }) { return <TouchableOpacity style={styles.menu} onPress={onPress}><View><Text style={styles.menuTitle}>{label}</Text><Text style={styles.menuSub}>{sub}</Text></View><Text style={styles.arrow}>›</Text></TouchableOpacity>; }
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#F4FBFF" }, signedOutScreen: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#F4FBFF" }, signedOutTitle: { color: "#103D56", fontSize: 22, fontWeight: "800" }, signedOutCopy: { color: "#668091", fontSize: 14, marginTop: 8, marginBottom: 20 }, loginButton: { minWidth: 150, minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#009EDF", paddingHorizontal: 20 }, loginButtonText: { color: "#FFF", fontSize: 15, fontWeight: "800" }, content: { padding: 21, paddingTop: 52, paddingBottom: 96 }, back: { color: "#0B3D57", fontSize: 37, lineHeight: 30 }, avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: "#0B9FDB", justifyContent: "center", alignItems: "center", alignSelf: "center", marginTop: 8 }, initial: { color: "#FFF", fontSize: 35, fontWeight: "800" }, name: { color: "#103D56", fontSize: 23, fontWeight: "800", textAlign: "center", marginTop: 12 }, email: { color: "#668091", fontSize: 11, textAlign: "center", marginTop: 5 }, badge: { alignSelf: "center", marginTop: 10, backgroundColor: "#DDF7E8", borderRadius: 14, paddingHorizontal: 11, paddingVertical: 5 }, badgeText: { color: "#17844D", fontSize: 10, fontWeight: "800" }, stats: { flexDirection: "row", backgroundColor: "#FFF", borderRadius: 14, paddingVertical: 16, marginTop: 23, marginBottom: 17 }, stat: { flex: 1, alignItems: "center", borderRightWidth: 1, borderRightColor: "#E5EEF1" }, value: { color: "#123F57", fontWeight: "800", fontSize: 15 }, statLabel: { color: "#748D9A", fontSize: 9, marginTop: 4 }, menu: { backgroundColor: "#FFF", borderRadius: 13, padding: 14, marginBottom: 9, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, menuTitle: { color: "#143E55", fontSize: 13, fontWeight: "800" }, menuSub: { color: "#78909B", fontSize: 10, marginTop: 4 }, arrow: { color: "#079CDA", fontSize: 25 }, logout: { borderRadius: 12, borderWidth: 1, borderColor: "#B9DDE8", padding: 14, alignItems: "center", marginTop: 10 }, logoutText: { color: "#087EAC", fontWeight: "800" } });
