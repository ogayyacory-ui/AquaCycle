import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { getReport, updateReportStatus } from "../../services/api";

const STATUS_OPTIONS = ["reported", "under_review", "assigned", "in_progress", "resolved"];

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("reported");
  const [resolutionNote, setResolutionNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadReport() {
      try {
        const data = await getReport(Number(id));
        if (!active) return;
        setReport(data);
        setStatus(data.status || "reported");
        setResolutionNote(data.resolution_note || "");
      } catch {
        if (active) {
          Alert.alert("Report not found", "This incident could not be loaded.");
          router.back();
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (id) loadReport();
    return () => {
      active = false;
    };
  }, [id]);

  async function saveStatus() {
    if (!report) return;

    setSaving(true);
    try {
      const updated = await updateReportStatus(report.id, {
        status,
        resolution_note: resolutionNote,
        verified: status === "resolved",
      });
      setReport(updated.report || report);
      Alert.alert("Status updated", "The incident tracking record has been updated.");
    } catch (error) {
      Alert.alert("Update failed", error.response?.data?.error || "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <Text style={styles.loading}>Loading incident…</Text>
      </View>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Incident details</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.card}>
          <Text style={styles.heading}>{report.problem_type}</Text>
          <Text style={styles.meta}>Tracking: {report.tracking_number || `AQC-${report.id}`}</Text>
          <Text style={styles.meta}>Location: {report.location}</Text>
          <Text style={styles.meta}>Urgency: {report.urgency}</Text>
          <Text style={styles.meta}>Source: {report.source || "citizen"}</Text>
          <Text style={styles.meta}>Verified: {report.verified ? "Yes" : "No"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.body}>{report.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Status</Text>
          {STATUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.statusOption, status === option && styles.statusOptionSelected]}
              onPress={() => setStatus(option)}
            >
              <Text style={[styles.statusText, status === option && styles.statusTextSelected]}>{option.replace("_", " ")}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Resolution note</Text>
          <TextInput
            value={resolutionNote}
            onChangeText={setResolutionNote}
            placeholder="Add evidence or closure details"
            multiline
            textAlignVertical="top"
            style={styles.noteInput}
          />
        </View>

        <TouchableOpacity style={styles.primaryAction} onPress={saveStatus} disabled={saving}>
          <Text style={styles.primaryActionText}>{saving ? "Saving…" : "Update incident"}</Text>
        </TouchableOpacity>
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
    paddingBottom: 50,
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#0A4562",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#103E57",
    marginBottom: 8,
  },
  meta: {
    color: "#517082",
    fontSize: 12,
    marginBottom: 4,
  },
  label: {
    fontWeight: "800",
    color: "#103E57",
    fontSize: 13,
    marginBottom: 10,
  },
  body: {
    color: "#3D5E72",
    fontSize: 13,
    lineHeight: 22,
  },
  statusOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#EDF8FF",
    marginBottom: 8,
  },
  statusOptionSelected: {
    backgroundColor: "#0B9FDB",
  },
  statusText: {
    color: "#174A68",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  statusTextSelected: {
    color: "#FFFFFF",
  },
  noteInput: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: "#D9EEF7",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F9FDFF",
    color: "#1A3A4F",
  },
  primaryAction: {
    backgroundColor: "#0B9FDB",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  loading: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#3D5E72",
    fontWeight: "700",
  },
});
