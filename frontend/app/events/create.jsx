import {
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  createEvent,
} from "../../services/api";

import {
  COLORS,
} from "../../constants/colors";


export default function CreateEventScreen() {

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("Community");

  const [location, setLocation] =
    useState("");

  const [date, setDate] =
    useState("");

  const [organizer, setOrganizer] =
    useState("");

  const [maxParticipants, setMaxParticipants] =
    useState("50");

  const [loading, setLoading] =
    useState(false);


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async () => {

    if (
      !title.trim() ||
      !description.trim() ||
      !location.trim() ||
      !date.trim() ||
      !organizer.trim()
    ) {

      Alert.alert(
        "Missing information",
        "Please fill in all required fields."
      );

      return;
    }


    const participants =
      Number(maxParticipants);


    if (
      !Number.isInteger(participants) ||
      participants <= 0
    ) {

      Alert.alert(
        "Invalid participants",
        "Enter a valid number of participants."
      );

      return;
    }


    try {

      setLoading(true);


      const data = await createEvent({

        title: title.trim(),

        description:
          description.trim(),

        category:
          category.trim(),

        location:
          location.trim(),

        start_datetime:
          date.trim(),

        organizer:
          organizer.trim(),

        max_participants:
          participants,

      });


      Alert.alert(
        "Event created 🎉",
        "Your community event has been posted.",
        [
          {
            text: "View Events",
            onPress: () =>
              router.replace("/events"),
          },
        ]
      );

    } catch (error) {

      console.log(
        "CREATE EVENT ERROR:",
        error.response?.data ||
        error.message
      );

      Alert.alert(
        "Unable to create event",
        error.response?.data?.error ||
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.heading}>
          Create a Community Event
        </Text>

        <Text style={styles.description}>
          Organize a cleanup, water workshop,
          environmental activity or community
          project.
        </Text>


        {/* TITLE */}

        <Input
          label="Event title *"
          placeholder="e.g. Nairobi River Cleanup"
          value={title}
          onChangeText={setTitle}
        />


        {/* DESCRIPTION */}

        <Input
          label="Description *"
          placeholder="Tell the community what this event is about..."
          value={description}
          onChangeText={setDescription}
          multiline
        />


        {/* CATEGORY */}

        <Text style={styles.label}>
          Category *
        </Text>

        <View style={styles.categories}>

          {[
            "Community",
            "Cleanup",
            "Education",
            "Water",
            "Sanitation",
            "Environment",
          ].map((item) => (

            <TouchableOpacity
              key={item}
              style={[
                styles.category,
                category === item &&
                  styles.categorySelected,
              ]}
              onPress={() =>
                setCategory(item)
              }
            >

              <Text
                style={[
                  styles.categoryText,
                  category === item &&
                    styles.categoryTextSelected,
                ]}
              >
                {item}
              </Text>

            </TouchableOpacity>

          ))}

        </View>


        {/* LOCATION */}

        <Input
          label="Location *"
          placeholder="e.g. Karura Forest"
          value={location}
          onChangeText={setLocation}
        />


        {/* DATE */}

        <Input
          label="Date & time *"
          placeholder="2026-08-20T09:00:00"
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.helper}>
          Use format: YYYY-MM-DDTHH:MM:SS
        </Text>


        {/* ORGANIZER */}

        <Input
          label="Organizer *"
          placeholder="e.g. AquaCycle Community"
          value={organizer}
          onChangeText={setOrganizer}
        />


        {/* PARTICIPANTS */}

        <Input
          label="Maximum participants"
          placeholder="50"
          value={maxParticipants}
          onChangeText={setMaxParticipants}
          keyboardType="numeric"
        />


        {/* SUBMIT */}

        <TouchableOpacity
          style={[
            styles.submit,
            loading &&
              styles.submitDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >

          <Text style={styles.submitText}>
            {loading
              ? "Publishing..."
              : "Publish Event"}
          </Text>

        </TouchableOpacity>


        <Text style={styles.note}>
          Events are community-created content.
          Please provide accurate information.
        </Text>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}


/* ============================================================
   INPUT COMPONENT
============================================================ */

function Input({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType = "default",
}) {

  return (
    <View style={styles.inputContainer}>

      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          multiline &&
            styles.textArea,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={
          multiline
            ? "top"
            : "center"
        }
      />

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

  heading: {
    fontSize: 29,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 25,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },

  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    minHeight: 52,
    paddingHorizontal: 15,
    fontSize: 15,
    color: COLORS.text,
  },

  textArea: {
    minHeight: 120,
    paddingTop: 15,
  },

  helper: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 18,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },

  category: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categorySelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },

  categoryTextSelected: {
    color: COLORS.white,
  },

  submit: {
    backgroundColor: COLORS.primary,
    minHeight: 55,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  submitDisabled: {
    opacity: 0.6,
  },

  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },

  note: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
  },

});