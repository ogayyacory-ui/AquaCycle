import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import {
  useLocalSearchParams,
  router,
} from "expo-router";

import {
  getEvent,
  registerForEvent,
} from "../../services/api";

import {
  COLORS,
} from "../../constants/colors";


export default function EventDetailsScreen() {

  const { id } =
    useLocalSearchParams();

  const [event, setEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [registering, setRegistering] =
    useState(false);


  useEffect(() => {

    loadEvent();

  }, [id]);


  const loadEvent = async () => {

    try {

      const data =
        await getEvent(id);

      setEvent(
        data.event || data
      );

    } catch (error) {

      console.log(
        "EVENT DETAILS ERROR:",
        error.message
      );

      Alert.alert(
        "Error",
        "Unable to load this event.",
        [
          {
            text: "Go Back",
            onPress: () =>
              router.back(),
          },
        ]
      );

    } finally {

      setLoading(false);

    }
  };


  const handleRegister = async () => {

    if (!name.trim() || !email.trim()) {

      Alert.alert(
        "Missing information",
        "Please enter your name and email."
      );

      return;
    }


    try {

      setRegistering(true);

      await registerForEvent(
        id,
        {
          name: name.trim(),
          email: email.trim(),
        }
      );

      Alert.alert(
        "You're registered 🎉",
        `You have registered for ${event.title}.`,
        [
          {
            text: "Done",
          },
        ]
      );

      setName("");
      setEmail("");

      await loadEvent();

    } catch (error) {

      console.log(
        "REGISTRATION ERROR:",
        error.response?.data ||
        error.message
      );

      Alert.alert(
        "Registration failed",
        error.response?.data?.error ||
        "Unable to register. Please try again."
      );

    } finally {

      setRegistering(false);

    }
  };


  if (loading) {

    return (
      <View style={styles.center}>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading event...
        </Text>

      </View>
    );
  }


  if (!event) {

    return (
      <View style={styles.center}>

        <Text style={styles.errorTitle}>
          Event not found
        </Text>

      </View>
    );
  }


  const date =
    new Date(event.start_datetime);


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={false}
    >

      {/* CATEGORY */}

      <View style={styles.categoryBadge}>

        <Text style={styles.categoryText}>
          {event.category}
        </Text>

      </View>


      {/* TITLE */}

      <Text style={styles.title}>
        {event.title}
      </Text>


      {/* DESCRIPTION */}

      <Text style={styles.description}>
        {event.description}
      </Text>


      {/* EVENT DETAILS */}

      <View style={styles.detailsCard}>

        <Detail
          icon="📅"
          title="Date"
          value={
            date.toLocaleDateString(
              "en-KE",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )
          }
        />

        <Detail
          icon="🕐"
          title="Time"
          value={
            date.toLocaleTimeString(
              "en-KE",
              {
                hour: "numeric",
                minute: "2-digit",
              }
            )
          }
        />

        <Detail
          icon="📍"
          title="Location"
          value={event.location}
        />

        <Detail
          icon="👤"
          title="Organizer"
          value={event.organizer}
        />

        <Detail
          icon="👥"
          title="Participants"
          value={`${event.registered_count || 0} / ${event.max_participants}`}
        />

      </View>


      {/* REGISTER */}

      <View style={styles.registerCard}>

        <Text style={styles.registerTitle}>
          Join this event
        </Text>

        <Text style={styles.registerDescription}>
          Add your details to reserve a place.
        </Text>


        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
        />


        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />


        <TouchableOpacity
          style={[
            styles.registerButton,
            registering &&
              styles.disabled,
          ]}
          onPress={handleRegister}
          disabled={registering}
        >

          <Text style={styles.registerButtonText}>
            {registering
              ? "Registering..."
              : "Register for Event"}
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}


/* ============================================================
   DETAIL COMPONENT
============================================================ */

function Detail({
  icon,
  title,
  value,
}) {

  return (
    <View style={styles.detailRow}>

      <Text style={styles.detailIcon}>
        {icon}
      </Text>

      <View style={styles.detailContent}>

        <Text style={styles.detailTitle}>
          {title}
        </Text>

        <Text style={styles.detailValue}>
          {value}
        </Text>

      </View>

    </View>
  );
}


/* ============================================================
   STYLES
============================================================ */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 22,
    paddingBottom: 50,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 15,
    color: COLORS.textSecondary,
  },

  errorTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: COLORS.text,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 15,
  },

  categoryText: {
    color: COLORS.green,
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase",
  },

  title: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 14,
  },

  description: {
    fontSize: 16,
    lineHeight: 25,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },

  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  detailIcon: {
    fontSize: 22,
    width: 42,
  },

  detailContent: {
    flex: 1,
  },

  detailTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 3,
  },

  detailValue: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },

  registerCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 20,
  },

  registerTitle: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 6,
  },

  registerDescription: {
    color: "#DFF7FC",
    fontSize: 14,
    marginBottom: 18,
  },

  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 15,
    marginBottom: 12,
    color: COLORS.text,
    fontSize: 15,
  },

  registerButton: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  disabled: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "800",
  },

});