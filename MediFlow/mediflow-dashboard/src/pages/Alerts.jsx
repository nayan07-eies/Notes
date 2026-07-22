// import { useState, useEffect } from "react";
// import { Clock, Package, AlertTriangle, Info } from "lucide-react";
// import { toast } from "react-hot-toast";
// import api from "../api/axios";

// export default function Alerts() {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     fetchAlerts();
//   }, []);
//   useEffect(() => {
//     fetchAlerts();
//   }, [filter]);

//   const fetchAlerts = async () => {
//     setLoading(true);
//     try {
//       const params = {};
//       if (filter === "low_stock") params.type = "low_stock";
//       if (filter === "expiry") params.type = "expiry";
//       if (filter === "critical") params.severity = "critical";
//       if (filter === "warning") params.severity = "warning";
//       if (filter === "info") params.severity = "info";

//       const res = await api.get("/alerts", { params });
//       setAlerts(res.data.alerts);
//     } catch {
//       toast.error("Failed to load alerts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSeverityStyle = (severity) => {
//     if (severity === "critical")
//       return { bg: "#FEE2E2", color: "#DC2626", border: "#FCA5A5" };
//     if (severity === "warning")
//       return { bg: "#FEF3C7", color: "#D97706", border: "#FCD34D" };
//     return { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" };
//   };

//   const criticalCount = alerts.filter((a) => a.severity === "critical").length;
//   const warningCount = alerts.filter((a) => a.severity === "warning").length;
//   const infoCount = alerts.filter((a) => a.severity === "info").length;

//   const filters = [
//     { key: "all", label: "All Alerts" },
//     { key: "critical", label: "🔴 Critical" },
//     { key: "warning", label: "🟠 Warning" },
//     { key: "info", label: "🔵 Info" },
//     { key: "low_stock", label: "📦 Low Stock" },
//     { key: "expiry", label: "⏰ Expiry" },
//   ];

//   return (
//     <div>
//       {/* Header */}
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.title}>Alerts</h1>
//           <p style={styles.subtitle}>
//             Auto-refreshed on page load · {alerts.length} active alerts
//           </p>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div style={styles.summaryGrid}>
//         <div style={{ ...styles.summaryCard, borderLeft: "4px solid #DC2626" }}>
//           <div style={styles.summaryIcon}>
//             <AlertTriangle size={18} color="#DC2626" />
//           </div>
//           <div>
//             <div style={styles.summaryLabel}>Critical</div>
//             <div style={{ ...styles.summaryValue, color: "#DC2626" }}>
//               {criticalCount}
//             </div>
//           </div>
//         </div>
//         <div style={{ ...styles.summaryCard, borderLeft: "4px solid #D97706" }}>
//           <div style={styles.summaryIcon}>
//             <AlertTriangle size={18} color="#D97706" />
//           </div>
//           <div>
//             <div style={styles.summaryLabel}>Warning</div>
//             <div style={{ ...styles.summaryValue, color: "#D97706" }}>
//               {warningCount}
//             </div>
//           </div>
//         </div>
//         <div style={{ ...styles.summaryCard, borderLeft: "4px solid #2563EB" }}>
//           <div style={styles.summaryIcon}>
//             <Info size={18} color="#2563EB" />
//           </div>
//           <div>
//             <div style={styles.summaryLabel}>Info</div>
//             <div style={{ ...styles.summaryValue, color: "#2563EB" }}>
//               {infoCount}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Panel */}
//       <div style={styles.mainPanel}>
//         {/* Filter Sidebar */}
//         <div style={styles.filterPanel}>
//           <div style={styles.filterTitle}>Filter By</div>
//           {filters.map((f) => (
//             <button
//               key={f.key}
//               style={{
//                 ...styles.filterItem,
//                 ...(filter === f.key ? styles.filterItemActive : {}),
//               }}
//               onClick={() => setFilter(f.key)}
//             >
//               {f.label}
//               {f.key === "all" && (
//                 <span style={styles.filterCount}>{alerts.length}</span>
//               )}
//               {f.key === "critical" && criticalCount > 0 && (
//                 <span
//                   style={{
//                     ...styles.filterCount,
//                     background: "#FEE2E2",
//                     color: "#DC2626",
//                   }}
//                 >
//                   {criticalCount}
//                 </span>
//               )}
//               {f.key === "warning" && warningCount > 0 && (
//                 <span
//                   style={{
//                     ...styles.filterCount,
//                     background: "#FEF3C7",
//                     color: "#D97706",
//                   }}
//                 >
//                   {warningCount}
//                 </span>
//               )}
//               {f.key === "info" && infoCount > 0 && (
//                 <span
//                   style={{
//                     ...styles.filterCount,
//                     background: "#DBEAFE",
//                     color: "#2563EB",
//                   }}
//                 >
//                   {infoCount}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Alerts List */}
//         <div style={styles.alertsPanel}>
//           {loading ? (
//             <div style={styles.empty}>Checking for alerts...</div>
//           ) : alerts.length === 0 ? (
//             <div style={styles.emptyState}>
//               <AlertTriangle size={48} color="var(--border)" />
//               <h3 style={{ color: "var(--text-soft)", marginTop: 12 }}>
//                 No Alerts
//               </h3>
//               <p
//                 style={{
//                   color: "var(--text-soft)",
//                   marginTop: 6,
//                   fontSize: 13,
//                 }}
//               >
//                 No alerts found for the selected filter.
//               </p>
//             </div>
//           ) : (
//             alerts.map((alert) => {
//               const s = getSeverityStyle(alert.severity);
//               return (
//                 <div
//                   key={alert._id}
//                   style={{
//                     ...styles.alertCard,
//                     background: s.bg,
//                     borderLeft: `4px solid ${s.border}`,
//                   }}
//                 >
//                   <div style={styles.alertLeft}>
//                     <div style={{ color: s.color, marginTop: 2 }}>
//                       {alert.type === "low_stock" ? (
//                         <Package size={18} />
//                       ) : (
//                         <Clock size={18} />
//                       )}
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={styles.alertMessage}>{alert.message}</div>
//                       <div style={styles.alertMeta}>
//                         <span
//                           style={{
//                             ...styles.severityBadge,
//                             background: s.bg,
//                             color: s.color,
//                             border: `1px solid ${s.border}`,
//                           }}
//                         >
//                           {alert.severity.toUpperCase()}
//                         </span>
//                         <span style={styles.alertTypeBadge}>
//                           {alert.type === "low_stock"
//                             ? "Low Stock"
//                             : "Expiry Alert"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 700,
//     color: "var(--text)",
//     letterSpacing: "-0.02em",
//   },
//   subtitle: { fontSize: 13, color: "var(--text-soft)", marginTop: 4 },
//   summaryGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3,1fr)",
//     gap: 14,
//     marginBottom: 24,
//   },
//   summaryCard: {
//     background: "white",
//     border: "1px solid var(--border)",
//     borderRadius: 10,
//     padding: "16px 20px",
//     boxShadow: "var(--shadow)",
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//   },
//   summaryIcon: { flexShrink: 0 },
//   summaryLabel: {
//     fontSize: 12,
//     color: "var(--text-soft)",
//     fontWeight: 600,
//     textTransform: "uppercase",
//     letterSpacing: "0.04em",
//     marginBottom: 4,
//   },
//   summaryValue: { fontSize: 26, fontWeight: 700 },
//   mainPanel: { display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 },
//   filterPanel: {
//     background: "white",
//     border: "1px solid var(--border)",
//     borderRadius: 10,
//     padding: 16,
//     boxShadow: "var(--shadow)",
//     height: "fit-content",
//   },
//   filterTitle: {
//     fontSize: 11,
//     fontWeight: 700,
//     color: "var(--text-soft)",
//     textTransform: "uppercase",
//     letterSpacing: "0.06em",
//     marginBottom: 12,
//     paddingBottom: 8,
//     borderBottom: "1px solid var(--border)",
//   },
//   filterItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     padding: "9px 12px",
//     border: "none",
//     background: "transparent",
//     borderRadius: 7,
//     fontSize: 13,
//     fontWeight: 500,
//     cursor: "pointer",
//     fontFamily: "Inter",
//     color: "var(--text-soft)",
//     marginBottom: 2,
//     textAlign: "left",
//   },
//   filterItemActive: {
//     background: "var(--primary-light)",
//     color: "var(--primary)",
//     fontWeight: 600,
//   },
//   filterCount: {
//     background: "var(--border)",
//     color: "var(--text-soft)",
//     fontSize: 11,
//     fontWeight: 600,
//     padding: "1px 7px",
//     borderRadius: 20,
//   },
//   alertsPanel: { display: "flex", flexDirection: "column", gap: 10 },
//   alertCard: {
//     borderRadius: 10,
//     padding: "16px 20px",
//     display: "flex",
//     alignItems: "center",
//     boxShadow: "var(--shadow)",
//   },
//   alertLeft: { display: "flex", alignItems: "flex-start", gap: 14, flex: 1 },
//   alertMessage: {
//     fontSize: 14,
//     fontWeight: 500,
//     color: "var(--text)",
//     marginBottom: 7,
//     lineHeight: 1.4,
//   },
//   alertMeta: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     flexWrap: "wrap",
//   },
//   severityBadge: {
//     padding: "2px 8px",
//     borderRadius: 20,
//     fontSize: 10,
//     fontWeight: 700,
//   },
//   alertTypeBadge: {
//     fontSize: 12,
//     color: "var(--text-soft)",
//     background: "white",
//     padding: "2px 8px",
//     borderRadius: 20,
//     border: "1px solid var(--border)",
//   },
//   empty: {
//     textAlign: "center",
//     color: "var(--text-soft)",
//     padding: 40,
//     background: "white",
//     borderRadius: 10,
//     border: "1px solid var(--border)",
//   },
//   emptyState: {
//     textAlign: "center",
//     padding: "60px 0",
//     background: "white",
//     borderRadius: 10,
//     border: "1px solid var(--border)",
//   },
// };

import { useState, useEffect, useMemo } from "react";
import { Clock, Package, AlertTriangle, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

// Mirrors the backend's actual severity rules (alertController.js):
// low_stock is only ever critical or warning; expiry can be all three.
const FILTER_GROUPS = [
  {
    key: "low_stock",
    label: "Low Stock",
    icon: Package,
    severities: ["critical", "warning"],
  },
  {
    key: "expiry",
    label: "Expiry",
    icon: Clock,
    severities: ["critical", "warning", "info"],
  },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  // filter = { type: null | "low_stock" | "expiry", severity: null | "critical" | "warning" | "info" }
  const [filter, setFilter] = useState({ type: null, severity: null });

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Fetch the full alert list once — filtering happens client-side so
  // sidebar counts always reflect all alerts, not just the current view.
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/alerts");
      setAlerts(res.data.alerts);
    } catch {
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyle = (severity) => {
    if (severity === "critical")
      return { bg: "#FEE2E2", color: "#DC2626", border: "#FCA5A5" };
    if (severity === "warning")
      return { bg: "#FEF3C7", color: "#D97706", border: "#FCD34D" };
    return { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" };
  };

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const infoCount = alerts.filter((a) => a.severity === "info").length;

  const countFor = (type, severity) =>
    alerts.filter(
      (a) => a.type === type && (!severity || a.severity === severity),
    ).length;

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (filter.type && a.type !== filter.type) return false;
      if (filter.severity && a.severity !== filter.severity) return false;
      return true;
    });
  }, [alerts, filter]);

  const isAllActive = !filter.type && !filter.severity;
  const isGroupActive = (type) => filter.type === type && !filter.severity;
  const isSubActive = (type, severity) =>
    filter.type === type && filter.severity === severity;

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Alerts</h1>
          <p style={styles.subtitle}>
            Auto-refreshed on page load · {alerts.length} active alerts
          </p>
        </div>
      </div>

      {/* Summary Cards — always reflect the full alert list */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, borderLeft: "4px solid #DC2626" }}>
          <div style={styles.summaryIcon}>
            <AlertTriangle size={18} color="#DC2626" />
          </div>
          <div>
            <div style={styles.summaryLabel}>Critical</div>
            <div style={{ ...styles.summaryValue, color: "#DC2626" }}>
              {criticalCount}
            </div>
          </div>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: "4px solid #D97706" }}>
          <div style={styles.summaryIcon}>
            <AlertTriangle size={18} color="#D97706" />
          </div>
          <div>
            <div style={styles.summaryLabel}>Warning</div>
            <div style={{ ...styles.summaryValue, color: "#D97706" }}>
              {warningCount}
            </div>
          </div>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: "4px solid #2563EB" }}>
          <div style={styles.summaryIcon}>
            <Info size={18} color="#2563EB" />
          </div>
          <div>
            <div style={styles.summaryLabel}>Info</div>
            <div style={{ ...styles.summaryValue, color: "#2563EB" }}>
              {infoCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div style={styles.mainPanel}>
        {/* Filter Sidebar */}
        <div style={styles.filterPanel}>
          <div style={styles.filterTitle}>Filter By</div>

          <button
            style={{
              ...styles.filterItem,
              ...(isAllActive ? styles.filterItemActive : {}),
            }}
            onClick={() => setFilter({ type: null, severity: null })}
          >
            All Alerts
            <span style={styles.filterCount}>{alerts.length}</span>
          </button>

          {FILTER_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.key} style={styles.filterGroup}>
                <button
                  style={{
                    ...styles.filterItem,
                    ...styles.filterGroupHeader,
                    ...(isGroupActive(group.key)
                      ? styles.filterItemActive
                      : {}),
                  }}
                  onClick={() => setFilter({ type: group.key, severity: null })}
                >
                  <span style={styles.filterGroupLabel}>
                    <GroupIcon size={13} />
                    {group.label}
                  </span>
                  <span style={styles.filterCount}>
                    {countFor(group.key, null)}
                  </span>
                </button>

                {group.severities.map((sev) => {
                  const s = getSeverityStyle(sev);
                  const count = countFor(group.key, sev);
                  return (
                    <button
                      key={sev}
                      style={{
                        ...styles.filterSubItem,
                        ...(isSubActive(group.key, sev)
                          ? styles.filterItemActive
                          : {}),
                      }}
                      onClick={() =>
                        setFilter({ type: group.key, severity: sev })
                      }
                    >
                      <span style={styles.filterSubLabel}>
                        <span style={{ ...styles.dot, background: s.color }} />
                        {sev.charAt(0).toUpperCase() + sev.slice(1)}
                      </span>
                      {count > 0 && (
                        <span
                          style={{
                            ...styles.filterCount,
                            background: s.bg,
                            color: s.color,
                          }}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Alerts List */}
        <div style={styles.alertsPanel}>
          {loading ? (
            <div style={styles.empty}>Checking for alerts...</div>
          ) : filteredAlerts.length === 0 ? (
            <div style={styles.emptyState}>
              <AlertTriangle size={48} color="var(--border)" />
              <h3 style={{ color: "var(--text-soft)", marginTop: 12 }}>
                No Alerts
              </h3>
              <p
                style={{
                  color: "var(--text-soft)",
                  marginTop: 6,
                  fontSize: 13,
                }}
              >
                No alerts found for the selected filter.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const s = getSeverityStyle(alert.severity);
              return (
                <div
                  key={alert._id}
                  style={{
                    ...styles.alertCard,
                    background: s.bg,
                    borderLeft: `4px solid ${s.border}`,
                  }}
                >
                  <div style={styles.alertLeft}>
                    <div style={{ color: s.color, marginTop: 2 }}>
                      {alert.type === "low_stock" ? (
                        <Package size={18} />
                      ) : (
                        <Clock size={18} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.alertMessage}>{alert.message}</div>
                      <div style={styles.alertMeta}>
                        <span
                          style={{
                            ...styles.severityBadge,
                            background: s.bg,
                            color: s.color,
                            border: `1px solid ${s.border}`,
                          }}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                        <span style={styles.alertTypeBadge}>
                          {alert.type === "low_stock"
                            ? "Low Stock"
                            : "Expiry Alert"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.02em",
  },
  subtitle: { fontSize: 13, color: "var(--text-soft)", marginTop: 4 },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 14,
    marginBottom: 24,
  },
  summaryCard: {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "16px 20px",
    boxShadow: "var(--shadow)",
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  summaryIcon: { flexShrink: 0 },
  summaryLabel: {
    fontSize: 12,
    color: "var(--text-soft)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: 4,
  },
  summaryValue: { fontSize: 26, fontWeight: 700 },
  mainPanel: { display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 },
  filterPanel: {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: 16,
    boxShadow: "var(--shadow)",
    height: "fit-content",
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-soft)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: "1px solid var(--border)",
  },
  filterGroup: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid var(--border)",
  },
  filterGroupHeader: {
    fontWeight: 700,
    color: "var(--text)",
  },
  filterGroupLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  filterItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "9px 12px",
    border: "none",
    background: "transparent",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Inter",
    color: "var(--text-soft)",
    marginBottom: 2,
    textAlign: "left",
  },
  filterSubItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "7px 12px 7px 22px",
    border: "none",
    background: "transparent",
    borderRadius: 7,
    fontSize: 12.5,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Inter",
    color: "var(--text-soft)",
    marginBottom: 2,
    textAlign: "left",
  },
  filterSubLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    display: "inline-block",
    flexShrink: 0,
  },
  filterItemActive: {
    background: "var(--primary-light)",
    color: "var(--primary)",
    fontWeight: 600,
  },
  filterCount: {
    background: "var(--border)",
    color: "var(--text-soft)",
    fontSize: 11,
    fontWeight: 600,
    padding: "1px 7px",
    borderRadius: 20,
  },
  alertsPanel: { display: "flex", flexDirection: "column", gap: 10 },
  alertCard: {
    borderRadius: 10,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    boxShadow: "var(--shadow)",
  },
  alertLeft: { display: "flex", alignItems: "flex-start", gap: 14, flex: 1 },
  alertMessage: {
    fontSize: 14,
    fontWeight: 500,
    color: "var(--text)",
    marginBottom: 7,
    lineHeight: 1.4,
  },
  alertMeta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  severityBadge: {
    padding: "2px 8px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
  },
  alertTypeBadge: {
    fontSize: 12,
    color: "var(--text-soft)",
    background: "white",
    padding: "2px 8px",
    borderRadius: 20,
    border: "1px solid var(--border)",
  },
  empty: {
    textAlign: "center",
    color: "var(--text-soft)",
    padding: 40,
    background: "white",
    borderRadius: 10,
    border: "1px solid var(--border)",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 0",
    background: "white",
    borderRadius: 10,
    border: "1px solid var(--border)",
  },
};
