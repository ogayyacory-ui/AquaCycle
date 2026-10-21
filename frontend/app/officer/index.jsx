import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { getImpact, getReports } from "../../services/api";
import { BottomNav } from "../index";

export default function OfficerDashboardScreen() {
  const [impact, setImpact] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [impactData, reportsData] = await Promise.all([
          getImpact(),
          getReports(),
        ]);

        if (!active) return;
        setImpact(impactData);
        setReports(Array.isArray(reportsData) ? reportsData : []);
      } catch {
        if (active) {
          setImpact({ metrics: {} });
          setReports([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const metrics = impact?.metrics || {};
  const statusCounts = Object.entries(metrics.reports_by_status || {})
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);

  const recentReports = reports.slice(0, 4);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Officer Dashboard</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.summaryBanner}>
          <Text style={styles.bannerTitle}>Water service overview</Text>
          <Text style={styles.bannerSubtitle}>Verified incidents and service response status</Text>
        </View>

        {loading ? (
          <Text style={styles.loading}>Loading service data…</Text>
        ) : (
          <>
            <View style={styles.tiles}>
              <MetricCard label="Total reports" value={metrics.total_reports ?? reports.length ?? 0} accent="#0B9FDB" />
              <MetricCard label="Verified" value={metrics.verified_reports ?? 0} accent="#1E9A66" />
              <MetricCard label="Resolved" value={metrics.resolved_reports ?? 0} accent="#0D7A7A" />
              <MetricCard label="Pending" value={metrics.pending_reports ?? 0} accent="#E7A93F" />
            </View>

            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Issue status</Text>
              {statusCounts.length ? (
                statusCounts.map(({ key, value }) => (
                  <View key={key} style={styles.statusRow}>
                    <Text style={styles.statusKey}>{key}</Text>
                    <View style={styles.statusBarTrack}>
                      <View
                        style={[
                          styles.statusBarFill,
                          { width: `${Math.min((value / Math.max(metrics.total_reports || 1, 1)) * 100, 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.statusValue}>{value}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No status data has been recorded yet.</Text>
              )}
            </View>

            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Recent incidents</Text>
              {recentReports.length ? (
                recentReports.map((report) => (
                  <TouchableOpacity
                    key={report.id}
                    style={styles.reportRow}
                    onPress={() => router.push({ pathname: "/report/[id]", params: { id: String(report.id) } })}
                  >
                    <View style={styles.reportMeta}>
                      <Text style={styles.reportType}>{report.problem_type}</Text>
                      <Text style={styles.reportLocation}>{report.location}</Text>
                    </View>
                    <View style={styles.reportBadgeWrapper}>
                      <Text style={[styles.reportBadge, report.status === "resolved" && styles.reportBadgeResolved]}>
                        {report.status || "reported"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No incidents have been submitted yet.</Text>
              )}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.primaryAction} onPress={() => router.push("/report")}>
                <Text style={styles.primaryActionText}>Submit new incident</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryAction} onPress={() => router.push("/officer/queue")}>
                <Text style={styles.secondaryActionText}>Open incident queue</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tertiaryAction} onPress={() => router.push("/officer/admin")}>
                <Text style={styles.tertiaryActionText}>Operations overview</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
      <BottomNav active="Home" />
    </View>
  );
}

function MetricCard({ label, value, accent }) {
  return (
    <View style={[styles.metricCard, { borderTopColor: accent }]}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4FBFF",
  },
  content: {
    paddingTop: 52,
    paddingHorizontal: 18,
    paddingBottom: 96,
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
    color: "#0A4562",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#103E57",
  },
  spacer: {
    width: 24,
  },
  summaryBanner: {
    backgroundColor: "#0B5475",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  bannerTitle: {
    color: "#F5FDFF",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: "#D3F3FF",
    fontSize: 12,
  },
  tiles: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 10,
  },
  metricCard: {
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
  metricValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#103E57",
  },
  metricLabel: {
    marginTop: 6,
    color: "#698498",
    fontSize: 11,
  },
  panel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#0A4562",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  panelTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#103E57",
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusKey: {
    width: 92,
    color: "#3E6079",
    fontSize: 11,
    textTransform: "capitalize",
  },
  statusBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 6,
    backgroundColor: "#EAF5FB",
    overflow: "hidden",
    marginRight: 10,
  },
  statusBarFill: {
    height: "100%",
    borderRadius: 6,
    backgroundColor: "#0B9FDB",
  },
  statusValue: {
    width: 30,
    textAlign: "right",
    color: "#103E57",
    fontWeight: "700",
    fontSize: 11,
  },
  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF5F9",
  },
  reportMeta: {
    flex: 1,
    paddingRight: 10,
  },
  reportType: {
    color: "#103E57",
    fontWeight: "700",
    fontSize: 13,
  },
  reportLocation: {
    color: "#6B8795",
    fontSize: 11,
    marginTop: 3,
  },
  reportBadgeWrapper: {
    alignItems: "flex-end",
  },
  reportBadge: {
    backgroundColor: "#EAF7FD",
    color: "#0B6C9E",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: "700",
    overflow: "hidden",
    textTransform: "capitalize",
  },
  reportBadgeResolved: {
    backgroundColor: "#DFF5E8",
    color: "#177D4D",
  },
  emptyText: {
    color: "#6F8A97",
    fontSize: 12,
  },
  loading: {
    color: "#46677C",
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 16,
  },
  buttonRow: {
    gap: 10,
    marginBottom: 24,
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
  secondaryAction: {
    backgroundColor: "#EAF7FF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryActionText: {
    color: "#0B5D86",
    fontWeight: "800",
  },
  tertiaryAction: {
    backgroundColor: "#EAF9F1",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  tertiaryActionText: {
    color: "#166B42",
    fontWeight: "800",
  },
});
