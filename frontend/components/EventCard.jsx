import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

import { COLORS } from "../constants/colors";


export default function EventCard({ event }) {
  const date = new Date(event.start_datetime);

  const formattedDate = date.toLocaleDateString(
    "en-KE",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const formattedTime = date.toLocaleTimeString(
    "en-KE",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        router.push(`/events/${event.id}`)
      }
    >

      {/* CATEGORY */}

      <View style={styles.categoryRow}>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {event.category}
          </Text>
        </View>

        {event.spots_remaining !== undefined && (
          <Text style={styles.spots}>
            {event.spots_remaining} spots left
          </Text>
        )}

      </View>


      {/* TITLE */}

      <Text style={styles.title}>
        {event.title}
      </Text>


      {/* DESCRIPTION */}

      <Text
        style={styles.description}
        numberOfLines={2}
      >
        {event.description}
      </Text>


      {/* EVENT INFO */}

      <View style={styles.infoContainer}>

        <View style={styles.infoRow}>
          <Text style={styles.icon}>
            📅
          </Text>

          <Text style={styles.infoText}>
            {formattedDate}
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.icon}>
            🕐
          </Text>

          <Text style={styles.infoText}>
            {formattedTime}
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.icon}>
            📍
          </Text>

          <Text
            style={styles.infoText}
            numberOfLines={1}
          >
            {event.location}
          </Text>
        </View>

      </View>


      {/* ORGANIZER */}

      <View style={styles.footer}>

        <Text style={styles.organizer}>
          By {event.organizer}
        </Text>

        <Text style={styles.arrow}>
          →
        </Text>

      </View>

    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
  },

  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  categoryBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  categoryText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  spots: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  title: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },

  infoContainer: {
    gap: 9,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 16,
    width: 28,
  },

  infoText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    flex: 1,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 16,
    paddingTop: 14,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  organizer: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },

  arrow: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "700",
  },

});