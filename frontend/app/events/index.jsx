import {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import {
  router,
  useFocusEffect,
} from "expo-router";

import EventCard from "../../components/EventCard";

import { getEvents } from "../../services/api";
import { COLORS } from "../../constants/colors";


export default function EventsScreen() {

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);


  // ============================================================
  // LOAD EVENTS
  // ============================================================

  const loadEvents = async () => {

    try {

      setError(null);

      const data = await getEvents();

      /*
       * Your Flask API may return either:
       *
       * []
       *
       * or:
       *
       * {
       *   "events": []
       * }
       *
       * This handles both.
       */

      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents(data.events || []);
      }

    } catch (err) {

      console.log(
        "EVENTS ERROR:",
        err.message
      );

      setError(
        "Unable to load events. Check your connection."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // ============================================================
  // LOAD WHEN SCREEN OPENS
  // ============================================================

  useFocusEffect(
    useCallback(() => {

      loadEvents();

    }, [])
  );


  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh = () => {

    setRefreshing(true);

    loadEvents();

  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <View style={styles.center}>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading community events...
        </Text>

      </View>
    );
  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error && events.length === 0) {

    return (
      <View style={styles.center}>

        <Text style={styles.errorIcon}>
          🌊
        </Text>

        <Text style={styles.errorTitle}>
          Something went wrong
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadEvents}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>

      </View>
    );
  }


  // ============================================================
  // SCREEN
  // ============================================================

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <View style={styles.headerText}>

          <Text style={styles.title}>
            Community Events
          </Text>

          <Text style={styles.subtitle}>
            Connect, learn and take action together.
          </Text>

        </View>


        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            router.push("/events/create")
          }
        >
          <Text style={styles.addButtonText}>
            +
          </Text>
        </TouchableOpacity>

      </View>


      {/* LIST */}

      <FlatList
        data={events}
        keyExtractor={(item) =>
          String(item.id)
        }
        renderItem={({ item }) => (
          <EventCard event={item} />
        )}

        contentContainerStyle={[
          styles.list,
          events.length === 0 &&
            styles.emptyList,
        ]}

        showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }

        ListEmptyComponent={
          <View style={styles.empty}>

            <Text style={styles.emptyIcon}>
              📅
            </Text>

            <Text style={styles.emptyTitle}>
              No events yet
            </Text>

            <Text style={styles.emptyText}>
              Be the first to create a community
              water or environmental event.
            </Text>

            <TouchableOpacity
              style={styles.createButton}
              onPress={() =>
                router.push("/events/create")
              }
            >
              <Text style={styles.createButtonText}>
                Create an Event
              </Text>
            </TouchableOpacity>

          </View>
        }
      />

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    flex: 1,
    paddingRight: 15,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "400",
  },

  list: {
    padding: 20,
    paddingTop: 5,
    paddingBottom: 40,
  },

  emptyList: {
    flexGrow: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 15,
    color: COLORS.textSecondary,
    fontSize: 15,
  },

  errorIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },

  errorText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 14,
  },

  retryText: {
    color: COLORS.white,
    fontWeight: "700",
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 22,
  },

  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 15,
  },

  createButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },

});