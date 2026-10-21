import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { getReports, updateReportStatus } from "../../services/api";

const TEAM_OPTIONS = [
  { label: "Operations", value: "Operations Desk" },
  { label: "Water Team", value: "Water Services Team" },
  { label: "Sanitation", value: "Sanitation Unit" },
];

export default function OfficerQueueScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadReports() {
    try {
      const data = await getReports();
      setReports(Array.isArray(data) ? data : []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const openReports = useMemo(
    () => reports.filter((report) => (report.status || "reported") !== "resolved"),
    [reports],
  );

  async function assignReport(reportId, assignedTo, nextStatus = "assigned") {
    try {
      await updateReportStatus(reportId, {
        status: nextStatus,
        assigned_to: assignedTo,
      });
      await loadReports();
    } catch {
      alert("Assignment could not be saved. Please try again.");
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Incident queue</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Open incidents</Text>
          <Text style={styles.summaryValue}>{openReports.length}</Text>
        </View>

        {loading ? (
          <Text style={styles.loading}>Loading queue…</Text>
        ) : openReports.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No active incidents</Text>
            <Text style={styles.emptyText}>All reported issues have been cleared or are not yet in the queue.</Text>
          </View>
        ) : (
          openReports.map((report) => (
            <View key={report.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardMeta}>
                  <Text style={styles.reportType}>{report.problem_type}</Text>
                  <Text style={styles.location}>{report.location}</Text>
                </View>
                <Text style={[styles.statusBadge, report.status === "under_review" && styles.statusBadgeReview]}>
                  {report.status || "reported"}
                </Text>
              </View>

              <Text style={styles.description} numberOfLines={2}>{report.description}</Text>

              <View style={styles.assignmentRow}>
                {TEAM_OPTIONS.map((team) => (
                  <TouchableOpacity
                    key={team.value}
                    style={[
                      styles.teamButton,
                      report.assigned_to === team.value && styles.teamButtonSelected,
                    ]}
                    onPress={() => assignReport(report.id, team.value)}
                  >
                    <Text
                      style={[
                        styles.teamButtonText,
                        report.assigned_to === team.value && styles.teamButtonTextSelected,
                      ]}
                    >
                      {team.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.tracking}>#{report.tracking_number || `AQC-${report.id}`}</Text>
                <TouchableOpacity onPress={() => router.push({ pathname: "/report/[id]", params: { id: String(report.id) } })}>
                  <Text style={styles.detailLink}>View report</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  summaryBox: {
    backgroundColor: "#0B5475",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  summaryLabel: {
    color: "#D9F4FF",
    fontSize: 11,
  },
  summaryValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 6,
  },
  loading: {
    color: "#4F6776",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
  },
  emptyTitle: {
    color: "#103E57",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 6,
  },
  emptyText: {
    color: "#5B7484",
    fontSize: 12,
    lineHeight: 18,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#0A4562",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardMeta: {
    flex: 1,
    paddingRight: 10,
  },
  reportType: {
    color: "#103E57",
    fontWeight: "800",
    fontSize: 15,
  },
  location: {
    color: "#698498",
    fontSize: 11,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: "#EAF7FD",
    color: "#0B6C9E",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 10,
    fontWeight: "700",
    overflow: "hidden",
    textTransform: "capitalize",
  },
  statusBadgeReview: {
    backgroundColor: "#FFF2DA",
    color: "#A15C00",
  },
  description: {
    color: "#3D5E72",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  assignmentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  teamButton: {
    backgroundColor: "#EDF5F9",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  teamButtonSelected: {
    backgroundColor: "#0B9FDB",
  },
  teamButtonText: {
    color: "#194A67",
    fontSize: 10,
    fontWeight: "700",
  },
  teamButtonTextSelected: {
    color: "#FFFFFF",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tracking: {
    color: "#678396",
    fontSize: 10,
    fontWeight: "700",
  },
  detailLink: {
    color: "#0B9FDB",
    fontWeight: "700",
    fontSize: 12,
  },
});
