import { useEffect, useMemo, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { deleteEvent, getEvents, getImpact, getReports } from "../../services/api";

export default function OperationsOverviewScreen() {
  const [impact, setImpact] = useState({ metrics: {} });
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      try {
        const [impactData, reportData, eventData] = await Promise.all([
          getImpact(),
          getReports(),
          getEvents(),
        ]);

        if (!active) return;
        setImpact(impactData || { metrics: {} });
        setReports(Array.isArray(reportData) ? reportData : []);
        setEvents(Array.isArray(eventData) ? eventData : eventData?.events || []);
      } catch {
        if (active) {
          setImpact({ metrics: {} });
          setReports([]);
          setEvents([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOverview();
    return () => {
      active = false;
    };
  }, []);

  const confirmDeleteEvent = (event) => {
    if (Platform.OS === "web") {
      if (window.confirm(`Delete “${event.title}” and its registrations?`)) {
        deleteSelectedEvent(event);
      }
      return;
    }

    Alert.alert(
      "Delete event?",
      `“${event.title}” and its registrations will be permanently deleted.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteSelectedEvent(event),
        },
      ]
    );
  };

  const deleteSelectedEvent = async (event) => {
    setDeletingEventId(event.id);
    try {
      await deleteEvent(event.id);
      setEvents((currentEvents) => currentEvents.filter((item) => item.id !== event.id));
    } catch {
      Alert.alert("Unable to delete event", "Please try again.");
    } finally {
      setDeletingEventId(null);
    }
  };

  const metrics = useMemo(() => impact?.metrics || {}, [impact]);
  const reportCounts = useMemo(() => {
    const entries = Object.entries(metrics.reports_by_status || {});
    return entries.map(([key, value]) => ({ key, value }));
  }, [metrics]);

  const teams = useMemo(() => {
    const map = {};

    reports.forEach((report) => {
      const team = report.assigned_to || "Unassigned";
      map[team] = (map[team] || 0) + 1;
    });

    return Object.entries(map).map(([team, count]) => ({ team, count }));
  }, [reports]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Operations overview</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Service status</Text>
          <Text style={styles.heroValue}>{metrics.total_reports ?? reports.length ?? 0}</Text>
          <Text style={styles.heroSubtext}>Open and tracked incidents across the service area</Text>
        </View>

        {loading ? (
          <Text style={styles.loading}>Loading service overview…</Text>
        ) : (
          <>
            <View style={styles.grid}>
              <StatCard label="Verified" value={metrics.verified_reports ?? 0} color="#1D9A68" />
              <StatCard label="Resolved" value={metrics.resolved_reports ?? 0} color="#0B6F81" />
              <StatCard label="Pending" value={metrics.pending_reports ?? 0} color="#CA8A1E" />
              <StatCard label="Total" value={metrics.total_reports ?? reports.length ?? 0} color="#0B9FDB" />
            </View>

            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Manage events</Text>
              {events.length ? (
                events.map((event) => (
                  <View key={event.id} style={styles.eventRow}>
                    <View style={styles.eventMeta}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventDetails}>{event.location}</Text>
                    </View>
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${event.title}`}
                      disabled={deletingEventId === event.id}
                      onPress={() => confirmDeleteEvent(event)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>
                        {deletingEventId === event.id ? "Deleting…" : "Delete"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No events to manage.</Text>
              )}
            </View>

            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Issue mix</Text>
              {reportCounts.length ? (
                reportCounts.map(({ key, value }) => (
                  <View key={key} style={styles.row}>
                    <Text style={styles.rowLabel}>{key}</Text>
                    <Text style={styles.rowValue}>{value}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No issue distribution is available yet.</Text>
              )}
            </View>

            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Assigned teams</Text>
              {teams.length ? (
                teams.map(({ team, count }) => (
                  <View key={team} style={styles.row}>
                    <Text style={styles.rowLabel}>{team}</Text>
                    <Text style={styles.rowValue}>{count}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No assignments have been made yet.</Text>
              )}
            </View>

            <TouchableOpacity style={styles.primaryAction} onPress={() => router.push("/officer/queue")}>
              <Text style={styles.primaryActionText}>Open incident queue</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, color }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4FBFF",
  },
  content: {
    padding: 18,
    paddingTop: 52,
    paddingBottom: 46,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    fontSize: 34,
    lineHeight: 34,
    color: "#0B3D57",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#103E57",
  },
  spacer: {
    width: 24,
  },
  heroCard: {
    backgroundColor: "#0B5475",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  heroLabel: {
    color: "#D9F4FF",
    fontSize: 11,
  },
  heroValue: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 6,
  },
  heroSubtext: {
    color: "#D9F4FF",
    fontSize: 12,
    marginTop: 8,
  },
  loading: {
    color: "#4F6776",
    fontSize: 13,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderTopWidth: 4,
    shadowColor: "#0A4562",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    color: "#103E57",
    fontSize: 28,
    fontWeight: "800",
  },
  statLabel: {
    color: "#648193",
    fontSize: 11,
    marginTop: 6,
  },
  panel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#0A4562",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#103E57",
    marginBottom: 12,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF5F9",
  },
  eventMeta: {
    flex: 1,
    marginRight: 12,
  },
  eventTitle: {
    color: "#103E57",
    fontSize: 13,
    fontWeight: "700",
  },
  eventDetails: {
    color: "#648193",
    fontSize: 11,
    marginTop: 4,
  },
  deleteButton: {
    minWidth: 72,
    alignItems: "center",
    backgroundColor: "#FFF0EE",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  deleteButtonText: {
    color: "#B42318",
    fontSize: 12,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF5F9",
  },
  rowLabel: {
    color: "#3C5F78",
    fontSize: 12,
    textTransform: "capitalize",
  },
  rowValue: {
    color: "#103E57",
    fontWeight: "800",
    fontSize: 12,
  },
  emptyText: {
    color: "#678195",
    fontSize: 12,
  },
  primaryAction: {
    backgroundColor: "#0B9FDB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
