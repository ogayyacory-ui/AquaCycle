import {
  useState
} from "react";

import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert
} from "react-native";

import {
  router
} from "expo-router";

import {
  createEvent
} from "../../services/api";

import {
  COLORS
} from "../../constants/colors";


export default function CreateEvent() {

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      category: "Water Cleanup",
      location: "",
      start_datetime: "",
      organizer: "",
      max_participants: "50"
    });


  function update(field, value) {

    setForm({
      ...form,
      [field]: value
    });

  }


  async function submit() {

    if (
      !form.title ||
      !form.description ||
      !form.location ||
      !form.start_datetime ||
      !form.organizer
    ) {

      Alert.alert(
        "Missing information",
        "Please complete all required fields."
      );

      return;
    }


    try {

      const response =
        await createEvent({
          ...form,
          max_participants:
            Number(
              form.max_participants
            )
        });

      Alert.alert(
        "Event Published",
        "Your community event is now live.",
        [
          {
            text: "View Event",
            onPress: () =>
              router.replace(
                `/events/${response.event.id}`
              )
          }
        ]
      );

    } catch (error) {

      Alert.alert(
        "Couldn't create event",
        error.message
      );

    }
  }


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.label}>
        EVENT ORGANIZER
      </Text>

      <Text style={styles.title}>
        Create an event
      </Text>

      <Text style={styles.subtitle}>
        Turn an idea into community action.
      </Text>


      <Field
        label="Event title"
        value={form.title}
        onChange={v =>
          update("title", v)
        }
        placeholder="e.g. Nairobi River Cleanup"
      />


      <Field
        label="Description"
        value={form.description}
        onChange={v =>
          update("description", v)
        }
        placeholder="What will participants do?"
        multiline
      />


      <Field
        label="Category"
        value={form.category}
        onChange={v =>
          update("category", v)
        }
        placeholder="Water Cleanup"
      />


      <Field
        label="Location"
        value={form.location}
        onChange={v =>
          update("location", v)
        }
        placeholder="Where will this happen?"
      />


      <Field
        label="Date & time"
        value={form.start_datetime}
        onChange={v =>
          update("start_datetime", v)
        }
        placeholder="2026-08-29 09:00"
      />


      <Field
        label="Organizer"
        value={form.organizer}
        onChange={v =>
          update("organizer", v)
        }
        placeholder="Organization or community"
      />


      <Field
        label="Maximum participants"
        value={form.max_participants}
        onChange={v =>
          update(
            "max_participants",
            v
          )
        }
        placeholder="50"
        keyboardType="numeric"
      />


      <Pressable
        style={styles.button}
        onPress={submit}
      >

        <Text style={styles.buttonText}>
          Publish Event
        </Text>

      </Pressable>

    </ScrollView>
  );
}


function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  keyboardType
}) {

  return (

    <View style={styles.field}>

      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9BA8AB"
        multiline={multiline}
        keyboardType={keyboardType}
        style={[
          styles.input,
          multiline &&
            styles.multiline
        ]}
      />

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  content: {
    padding: 24,
    paddingTop: 70,
    paddingBottom: 50
  },

  label: {
    color: COLORS.darkGreen,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5
  },

  title: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: "800",
    marginTop: 8
  },

  subtitle: {
    color: COLORS.muted,
    marginTop: 8,
    marginBottom: 30
  },

  field: {
    marginBottom: 17
  },

  fieldLabel: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 7
  },

  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 13,
    color: COLORS.text
  },

  multiline: {
    minHeight: 120,
    textAlignVertical: "top"
  },

  button: {
    backgroundColor: COLORS.navy,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "800"
  }

});