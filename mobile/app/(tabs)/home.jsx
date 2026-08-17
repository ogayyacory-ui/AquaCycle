import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>AquaCycle</Text>
          <Text style={styles.tagline}>
            Every drop has a story.
          </Text>
        </View>

        <View style={styles.drop}>
          <Text style={styles.dropText}>💧</Text>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>
          WATER • COMMUNITY • TECHNOLOGY
        </Text>

        <Text style={styles.heroTitle}>
          What if we could give every drop a second life?
        </Text>

        <Text style={styles.heroText}>
          Technology, communities and sustainable systems working
          together to create cleaner water, better sanitation and
          healthier environments.
        </Text>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            Explore the Solution
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            Report a Water Problem
          </Text>
        </TouchableOpacity>
      </View>

      {/* Water Journey */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>THE WATER JOURNEY</Text>

        <Text style={styles.sectionTitle}>
          Every drop can have a second life.
        </Text>

        <Text style={styles.sectionText}>
          Follow water from rainfall to collection, treatment,
          reuse and its return to nature.
        </Text>

        <View style={styles.journey}>
          {[
            ["🌧️", "Rainfall"],
            ["💧", "Collection"],
            ["🧪", "Filtration"],
            ["🏠", "Use"],
            ["♻️", "Reuse"],
            ["🌱", "Nature"],
          ].map(([icon, title], index) => (
            <View style={styles.journeyItem} key={title}>
              <View style={styles.journeyCircle}>
                <Text style={styles.journeyIcon}>{icon}</Text>
              </View>

              <Text style={styles.journeyTitle}>{title}</Text>

              {index < 5 && (
                <Text style={styles.arrow}>→</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Report */}
      <View style={styles.reportCard}>
        <Text style={styles.reportIcon}>🚨</Text>

        <Text style={styles.reportTitle}>
          See a water problem?
        </Text>

        <Text style={styles.reportText}>
          Report pollution, flooding, blocked drains, unsafe
          water, broken pipes or sanitation problems.
        </Text>

        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportButtonText}>
            Report a Problem
          </Text>
        </TouchableOpacity>
      </View>

      {/* Impact */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>
          DEMO IMPACT DASHBOARD
        </Text>

        <Text style={styles.sectionTitle}>
          See what collective action can achieve.
        </Text>

        <View style={styles.statsGrid}>
          <Stat value="10.4M" label="Litres potentially saved" />
          <Stat value="3,240" label="Community reports" />
          <Stat value="127" label="Water projects" />
          <Stat value="84K" label="People reached" />
        </View>

        <Text style={styles.demoNote}>
          Illustrative demo data — not verified real-world impact.
        </Text>
      </View>

      {/* CTA */}
      <View style={styles.finalSection}>
        <Text style={styles.finalTitle}>
          What if every drop counted?
        </Text>

        <Text style={styles.finalText}>
          Discover how your household or community could collect,
          save and reuse water.
        </Text>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            Start Making an Impact
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4FBFC",
  },

  content: {
    paddingBottom: 40,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#063B4C",
  },

  tagline: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B858C",
  },

  drop: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#DDF7FC",
    alignItems: "center",
    justifyContent: "center",
  },

  dropText: {
    fontSize: 25,
  },

  hero: {
    marginHorizontal: 18,
    padding: 28,
    borderRadius: 30,
    backgroundColor: "#063B4C",
    overflow: "hidden",
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#62E6F5",
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  heroText: {
    marginTop: 18,
    fontSize: 16,
    lineHeight: 25,
    color: "#C9E7EC",
  },

  primaryButton: {
    marginTop: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#11C5D9",
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#00323D",
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryButton: {
    marginTop: 12,
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#5D8F99",
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 42,
  },

  sectionEyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#00A7BD",
  },

  sectionTitle: {
    marginTop: 8,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "800",
    color: "#073B4C",
  },

  sectionText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: "#668087",
  },

  journey: {
    marginTop: 25,
  },

  journeyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  journeyCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#DDF7FC",
    alignItems: "center",
    justifyContent: "center",
  },

  journeyIcon: {
    fontSize: 22,
  },

  journeyTitle: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "700",
    color: "#164B58",
  },

  arrow: {
    marginLeft: "auto",
    fontSize: 22,
    color: "#00A7BD",
  },

  reportCard: {
    marginHorizontal: 20,
    marginTop: 35,
    padding: 25,
    borderRadius: 25,
    backgroundColor: "#FFF4E8",
  },

  reportIcon: {
    fontSize: 30,
  },

  reportTitle: {
    marginTop: 10,
    fontSize: 23,
    fontWeight: "800",
    color: "#633E1C",
  },

  reportText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#80644B",
  },

  reportButton: {
    marginTop: 18,
    backgroundColor: "#E88336",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  reportButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  statsGrid: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48%",
    marginBottom: 12,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },

  statValue: {
    fontSize: 25,
    fontWeight: "800",
    color: "#008DA3",
  },

  statLabel: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 17,
    color: "#71868C",
  },

  demoNote: {
    fontSize: 11,
    color: "#89999D",
    fontStyle: "italic",
  },

  finalSection: {
    marginTop: 40,
    padding: 30,
    backgroundColor: "#DDF7FC",
    alignItems: "center",
  },

  finalTitle: {
    fontSize: 29,
    fontWeight: "800",
    textAlign: "center",
    color: "#063B4C",
  },

  finalText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#52737B",
  },
});