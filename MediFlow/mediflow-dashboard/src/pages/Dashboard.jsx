import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  Receipt,
  Bell,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";
import StatCard from "../components/StatCard";
import api from "../api/axios";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/analytics/dashboard")
      .then((res) => setSummary(res.data.summary))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div style={styles.loading}>Loading dashboard...</div>
      ) : (
        <div style={styles.grid}>
          <StatCard
            label="Total Medicines"
            value={summary?.totalMedicines}
            icon={<Pill size={20} />}
            color="var(--primary)"
            bg="var(--primary-light)"
          />
          <StatCard
            label="Total Revenue"
            value={summary ? `₹${summary.totalRevenue}` : "—"}
            icon={<TrendingUp size={20} />}
            color="#2563EB"
            bg="#EFF6FF"
          />
          <StatCard
            label="Total Bills"
            value={summary?.totalBills}
            icon={<Receipt size={20} />}
            color="#7C3AED"
            bg="#F5F3FF"
          />
          <StatCard
            label="Active Alerts"
            value={summary?.activeAlerts}
            icon={<Bell size={20} />}
            color="var(--amber)"
            bg="var(--amber-light)"
            meta={summary?.activeAlerts > 0 ? "Needs attention" : "All clear"}
          />
          <StatCard
            label="Low Stock Items"
            value={summary?.lowStockCount}
            icon={<AlertTriangle size={20} />}
            color="var(--red)"
            bg="var(--red-light)"
          />
          <StatCard
            label="Total Orders"
            value={summary?.totalOrders}
            icon={<ShoppingCart size={20} />}
            color="var(--primary)"
            bg="var(--primary-light)"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div style={styles.panel}>
        <div style={styles.panelHeader}>
          <h3 style={styles.panelTitle}>Quick Actions</h3>
        </div>
        <div style={styles.panelBody}>
          <button
            style={styles.actionBtn}
            onClick={() => navigate("/inventory")}
          >
            + Add Medicine
          </button>
          <button
            style={{ ...styles.actionBtn, ...styles.actionBtnSecondary }}
            onClick={() => navigate("/billing")}
          >
            + Create Bill
          </button>
          <button
            style={{ ...styles.actionBtn, ...styles.actionBtnAmber }}
            onClick={() => navigate("/purchase-orders")}
          >
            + Purchase Order
          </button>
          <button
            style={{ ...styles.actionBtn, ...styles.actionBtnOutline }}
            onClick={() => navigate("/alerts")}
          >
            View Alerts
          </button>
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
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 13,
    color: "var(--text-soft)",
    marginTop: 4,
  },
  loading: {
    textAlign: "center",
    color: "var(--text-soft)",
    padding: 40,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 28,
  },
  panel: {
    background: "var(--white)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    marginBottom: 24,
  },
  panelHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "var(--text)",
  },
  panelBody: {
    padding: "20px",
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  actionBtn: {
    padding: "9px 18px",
    background: "var(--primary)",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
  },
  actionBtnSecondary: {
    background: "var(--primary-light)",
    color: "var(--primary)",
  },
  actionBtnAmber: {
    background: "var(--amber-light)",
    color: "var(--amber)",
  },
  actionBtnOutline: {
    background: "transparent",
    color: "var(--text)",
    border: "1px solid var(--border)",
  },
};
