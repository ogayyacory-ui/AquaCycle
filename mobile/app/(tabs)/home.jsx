import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

const journeyStages = [
  {
    icon: "🌧️",
    title: "Rainfall",
    description:
      "Rain is captured before it becomes runoff and is lost or contaminated.",
    technology: "Rain gauges, collection surfaces and smart harvesting.",
    action: "Communities can identify suitable collection areas.",
  },
  {
    icon: "💧",
    title: "Collection",
    description:
      "Rainwater is collected and directed into storage systems.",
    technology: "Rainwater tanks, gutters and collection systems.",
    action: "Install and maintain household or community tanks.",
  },
  {
    icon: "🏺",
    title: "Storage",
    description:
      "Collected water is stored safely for later use.",
    technology: "Storage tanks and smart water-level sensors.",
    action: "Monitor storage capacity and prevent contamination.",
  },
  {
    icon: "🧪",
    title: "Filtration",
    description:
      "Water can be filtered or treated before appropriate consumption.",
    technology: "Bio-sand filters, UV treatment and other appropriate systems.",
    action: "Use treatment systems suited to the local water source.",
  },
  {
    icon: "🏠",
    title: "Community Use",
    description:
      "Water supports drinking, hygiene, cooking, agriculture and livelihoods.",
    technology: "Smart meters and efficient water fixtures.",
    action: "Reduce unnecessary consumption and fix leaks.",
  },
  {
    icon: "🚿",
    title: "Wastewater",
    description:
      "Used water becomes wastewater that needs responsible management.",
    technology: "Greywater separation and wastewater monitoring.",
    action: "Keep wastewater away from rivers and drinking-water sources.",
  },
  {
    icon: "♻️",
    title: "Treatment & Reuse",
    description:
      "Suitable wastewater can be treated and reused for appropriate purposes.",
    technology: "Constructed wetlands and decentralized treatment.",
    action: "Reuse treated water where safe and appropriate.",
  },
  {
    icon: "🌱",
    title: "Nature",
    description:
      "Responsible water management protects ecosystems and natural water cycles.",
    technology: "Wetlands, restoration projects and environmental monitoring.",
    action: "Protect rivers, wetlands and drainage systems.",
  },
];

export default function HomeScreen() {
  const [selectedStage, setSelectedStage] = useState(null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
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

      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.heroGlow} />

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

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/solutions")}
        >
          <Text style={styles.primaryButtonText}>
            Explore the Solution →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(tabs)/report")}
        >
          <Text style={styles.secondaryButtonText}>
            🚨 Report a Water Problem
          </Text>
        </TouchableOpacity>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.quickSection}>
        <Text style={styles.sectionEyebrow}>EXPLORE AQUACYCLE</Text>

        <View style={styles.quickGrid}>
          <QuickAction
            icon="🗺️"
            title="Water Map"
            text="Explore local water issues"
            onPress={() => router.push("/(tabs)/map")}
          />

          <QuickAction
            icon="🤖"
            title="AquaAI"
            text="Ask a water question"
            onPress={() => router.push("/aqua-ai")}
          />

          <QuickAction
            icon="🏗️"
            title="Build"
            text="Design a smart community"
            onPress={() => router.push("/simulator")}
          />

          <QuickAction
            icon="📅"
            title="Events"
            text="Join community action"
            onPress={() => router.push("/(tabs)/events")}
          />
        </View>
      </View>

      {/* WATER JOURNEY */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>
          THE WATER JOURNEY
        </Text>

        <Text style={styles.sectionTitle}>
          Follow the life of a single drop.
        </Text>

        <Text style={styles.sectionText}>
          Tap each stage to discover what happens, the technology
          involved and how communities can participate.
        </Text>

        <View style={styles.journey}>
          {journeyStages.map((stage, index) => {
            const isSelected = selectedStage === index;

            return (
              <View key={stage.title}>
                <TouchableOpacity
                  style={[
                    styles.journeyItem,
                    isSelected && styles.journeyItemSelected,
                  ]}
                  onPress={() =>
                    setSelectedStage(
                      isSelected ? null : index
                    )
                  }
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.journeyCircle,
                      isSelected && styles.journeyCircleSelected,
                    ]}
                  >
                    <Text style={styles.journeyIcon}>
                      {stage.icon}
                    </Text>
                  </View>

                  <View style={styles.journeyMain}>
                    <Text style={styles.journeyNumber}>
                      0{index + 1}
                    </Text>

                    <Text style={styles.journeyTitle}>
                      {stage.title}
                    </Text>
                  </View>

                  <Text style={styles.expandIcon}>
                    {isSelected ? "−" : "+"}
                  </Text>
                </TouchableOpacity>

                {isSelected && (
                  <View style={styles.journeyDetails}>
                    <Text style={styles.detailHeading}>
                      What happens
                    </Text>
                    <Text style={styles.detailText}>
                      {stage.description}
                    </Text>

                    <Text style={styles.detailHeading}>
                      Technology
                    </Text>
                    <Text style={styles.detailText}>
                      {stage.technology}
                    </Text>

                    <Text style={styles.detailHeading}>
                      Community action
                    </Text>
                    <Text style={styles.detailText}>
                      {stage.action}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* REPORT */}
      <View style={styles.reportCard}>
        <View style={styles.reportIconCircle}>
          <Text style={styles.reportIcon}>🚨</Text>
        </View>

        <Text style={styles.reportTitle}>
          See a water problem?
        </Text>

        <Text style={styles.reportText}>
          Report pollution, flooding, blocked drains, unsafe water,
          broken pipes or sanitation problems.
        </Text>

        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => router.push("/(tabs)/report")}
        >
          <Text style={styles.reportButtonText}>
            Report a Problem →
          </Text>
        </TouchableOpacity>
      </View>

      {/* IMPACT */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>
          DEMO IMPACT DASHBOARD
        </Text>

        <Text style={styles.sectionTitle}>
          See what collective action can achieve.
        </Text>

        <View style={styles.statsGrid}>
          <Stat
            value="10.4M"
            label="Litres potentially saved"
            icon="💧"
          />

          <Stat
            value="3,240"
            label="Community reports"
            icon="📍"
          />

          <Stat
            value="127"
            label="Water projects"
            icon="🏗️"
          />

          <Stat
            value="84K"
            label="People reached"
            icon="👥"
          />
        </View>

        <Text style={styles.demoNote}>
          Illustrative demo data — not verified real-world impact.
        </Text>
      </View>

      {/* BUILD COMMUNITY */}
      <View style={styles.buildCard}>
        <Text style={styles.buildIcon}>🏗️</Text>

        <Text style={styles.buildTitle}>
          Can you build a Water-Smart Community?
        </Text>

        <Text style={styles.buildText}>
          Add rainwater tanks, wetlands, recycling stations,
          treatment systems and more.
        </Text>

        <TouchableOpacity
          style={styles.buildButton}
          onPress={() => router.push("/simulator")}
        >
          <Text style={styles.buildButtonText}>
            Open Community Simulator →
          </Text>
        </TouchableOpacity>
      </View>

      {/* AQUAAI */}
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Text style={styles.aiAvatar}>🤖</Text>

          <View>
            <Text style={styles.aiTitle}>AquaAI</Text>
            <Text style={styles.aiStatus}>
              Water & sanitation advisor
            </Text>
          </View>
        </View>

        <Text style={styles.aiText}>
          Have a water problem? Ask AquaAI for practical ideas,
          possible causes and recommended actions.
        </Text>

        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => router.push("/aqua-ai")}
        >
          <Text style={styles.aiButtonText}>
            Ask AquaAI →
          </Text>
        </TouchableOpacity>
      </View>

      {/* FINAL CTA */}
      <View style={styles.finalSection}>
        <Text style={styles.finalEyebrow}>
          EVERY DROP COUNTS
        </Text>

        <Text style={styles.finalTitle}>
          What if every drop counted?
        </Text>

        <Text style={styles.finalText}>
          Discover how your household or community could collect,
          save and reuse water.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/simulator")}
        >
          <Text style={styles.primaryButtonText}>
            Start Making an Impact
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* QUICK ACTION */

function QuickAction({ icon, title, text, onPress }) {
  return (
    <TouchableOpacity
      style={styles.quickCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.quickIcon}>{icon}</Text>

      <Text style={styles.quickTitle}>{title}</Text>

      <Text style={styles.quickText}>{text}</Text>
    </TouchableOpacity>
  );
}

/* STAT */

function Stat({ value, label, icon }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>

      <Text style={styles.statValue}>{value}</Text>

      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4FBFC",
  },

  content: {
    paddingBottom: 50,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: 29,
    fontWeight: "900",
    color: "#063B4C",
  },

  tagline: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B858C",
  },

  drop: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#DDF7FC",
    alignItems: "center",
    justifyContent: "center",
  },

  dropText: {
    fontSize: 26,
  },

  hero: {
    marginHorizontal: 16,
    padding: 27,
    borderRadius: 30,
    backgroundColor: "#063B4C",
    overflow: "hidden",
  },

  heroGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -80,
    top: -70,
    backgroundColor: "#087F8C",
    opacity: 0.35,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#62E6F5",
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: 36,
    lineHeight: 43,
    fontWeight: "900",
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
    fontWeight: "900",
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

  quickSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },

  quickGrid: {
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  quickCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 17,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2F0F2",
  },

  quickIcon: {
    fontSize: 25,
  },

  quickTitle: {
    marginTop: 9,
    fontSize: 16,
    fontWeight: "800",
    color: "#073B4C",
  },

  quickText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "#71868C",
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 40,
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
    fontWeight: "900",
    color: "#073B4C",
  },

  sectionText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: "#668087",
  },

  journey: {
    marginTop: 23,
  },

  journeyItem: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 9,
    paddingRight: 15,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E3F0F2",
  },

  journeyItemSelected: {
    borderColor: "#11C5D9",
    backgroundColor: "#F1FCFD",
  },

  journeyCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#DDF7FC",
    alignItems: "center",
    justifyContent: "center",
  },

  journeyCircleSelected: {
    backgroundColor: "#BDEFF5",
  },

  journeyIcon: {
    fontSize: 22,
  },

  journeyMain: {
    flex: 1,
    marginLeft: 14,
  },

  journeyNumber: {
    fontSize: 10,
    fontWeight: "800",
    color: "#00A7BD",
  },

  journeyTitle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "800",
    color: "#164B58",
  },

  expandIcon: {
    fontSize: 24,
    color: "#00A7BD",
    fontWeight: "400",
  },

  journeyDetails: {
    marginLeft: 20,
    marginRight: 10,
    marginBottom: 10,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#EAF9FB",
  },

  detailHeading: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "900",
    color: "#007D90",
  },

  detailText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: "#58747B",
  },

  reportCard: {
    marginHorizontal: 20,
    marginTop: 35,
    padding: 25,
    borderRadius: 25,
    backgroundColor: "#FFF4E8",
  },

  reportIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFE4CA",
    alignItems: "center",
    justifyContent: "center",
  },

  reportIcon: {
    fontSize: 27,
  },

  reportTitle: {
    marginTop: 12,
    fontSize: 23,
    fontWeight: "900",
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
    fontWeight: "900",
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
    borderWidth: 1,
    borderColor: "#E2F0F2",
  },

  statIcon: {
    fontSize: 20,
  },

  statValue: {
    marginTop: 8,
    fontSize: 25,
    fontWeight: "900",
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

  buildCard: {
    marginHorizontal: 20,
    marginTop: 30,
    padding: 25,
    borderRadius: 25,
    backgroundColor: "#073B4C",
  },

  buildIcon: {
    fontSize: 30,
  },

  buildTitle: {
    marginTop: 10,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  buildText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#C9E7EC",
  },

  buildButton: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#11C5D9",
    alignItems: "center",
  },

  buildButtonText: {
    color: "#00323D",
    fontWeight: "900",
  },

  aiCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 23,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDECEF",
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  aiAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E2F8FB",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 26,
  },

  aiTitle: {
    marginLeft: 13,
    fontSize: 20,
    fontWeight: "900",
    color: "#073B4C",
  },

  aiStatus: {
    marginLeft: 13,
    marginTop: 2,
    fontSize: 11,
    color: "#00A7BD",
  },

  aiText: {
    marginTop: 15,
    fontSize: 14,
    lineHeight: 21,
    color: "#61787E",
  },

  aiButton: {
    marginTop: 16,
    paddingVertical: 13,
    borderRadius: 13,
    backgroundColor: "#E5F9FB",
    alignItems: "center",
  },

  aiButtonText: {
    fontWeight: "900",
    color: "#007D90",
  },

  finalSection: {
    marginTop: 35,
    padding: 30,
    backgroundColor: "#DDF7FC",
    alignItems: "center",
  },

  finalEyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#00A7BD",
  },

  finalTitle: {
    marginTop: 8,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
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