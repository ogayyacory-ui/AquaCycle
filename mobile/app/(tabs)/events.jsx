import {
  useEffect,
  useState
} from "react";

import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import {
  router
} from "expo-router";

import {
  CalendarDays,
  MapPin,
  Users,
  Plus
} from "lucide-react-native";

import {
  getEvents
} from "../../services/api";

import {
  COLORS
} from "../../constants/colors";


export default function EventsScreen() {

  const [events, setEvents] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadEvents();

  }, []);


  async function loadEvents() {

    try {

      const data =
        await getEvents();

      setEvents(data.events);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }


  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <View>

          <Text style={styles.label}>
            COMMUNITY ACTION
          </Text>

          <Text style={styles.title}>
            Events
          </Text>

        </View>

        <Pressable
          style={styles.add}
          onPress={() =>
            router.push(
              "/events/create"
            )
          }
        >

          <Plus
            color={COLORS.white}
            size={22}
          />

        </Pressable>

      </View>


      {loading ? (

        <ActivityIndicator
          color={COLORS.aqua}
          size="large"
        />

      ) : (

        <ScrollView
          contentContainerStyle={
            styles.list
          }
        >

          {events.map(event => (

            <Pressable
              key={event.id}
              style={styles.card}
              onPress={() =>
                router.push(
                  `/events/${event.id}`
                )
              }
            >

              <View style={styles.cover}>

                <CalendarDays
                  color={COLORS.aqua}
                  size={34}
                />

                <Text style={styles.category}>
                  {event.category}
                </Text>

              </View>


              <View style={styles.body}>

                <Text style={styles.date}>
                  {event.start_datetime}
                </Text>

                <Text style={styles.eventTitle}>
                  {event.title}
                </Text>

                <Text style={styles.description}>
                  {event.description}
                </Text>


                <View style={styles.meta}>

                  <View style={styles.metaItem}>

                    <MapPin
                      size={14}
                      color={COLORS.muted}
                    />

                    <Text>
                      {event.location}
                    </Text>

                  </View>


                  <View style={styles.metaItem}>

                    <Users
                      size={14}
                      color={COLORS.muted}
                    />

                    <Text>
                      {event.registered_count}/
                      {event.max_participants}
                    </Text>

                  </View>

                </View>

              </View>

            </Pressable>

          ))}

        </ScrollView>

      )}

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 65
  },

  header: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  label: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.darkGreen
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.text
  },

  add: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center"
  },

  list: {
    padding: 20,
    gap: 15,
    paddingBottom: 40
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border
  },

  cover: {
    height: 145,
    backgroundColor: COLORS.navy,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },

  category: {
    position: "absolute",
    top: 15,
    left: 15,
    color: COLORS.white,
    backgroundColor: "#FFFFFF18",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    fontSize: 9
  },

  body: {
    padding: 20
  },

  date: {
    color: COLORS.darkGreen,
    fontSize: 9,
    fontWeight: "800"
  },

  eventTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "800",
    marginVertical: 7
  },

  description: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18
  },

  meta: {
    marginTop: 15,
    gap: 8
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },

  metaItemText: {
    fontSize: 10
  }

});