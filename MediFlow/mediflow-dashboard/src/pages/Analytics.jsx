import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, Wallet } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";

// Helper to get local date string as YYYY-MM-DD cleanly without UTC distortion
const getLocalTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const periods = [
  { key: "day", label: "Day" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "total", label: "Total" },
];

// Shift the reference date by N units of the given period (Timezone Safe)
function shiftDate(dateStr, period, dir) {
  const parts = dateStr.split("-").map(Number);
  // Construct date treating parts strictly as local time parameters
  const d = new Date(parts[0], parts[1] - 1, parts.length === 3 ? parts[2] : 1);

  if (period === "day") d.setDate(d.getDate() + dir);
  if (period === "month") d.setMonth(d.getMonth() + dir);
  if (period === "year") d.setFullYear(d.getFullYear() + dir);

  const outY = d.getFullYear();
  const outM = String(d.getMonth() + 1).padStart(2, "0");
  const outD = String(d.getDate()).padStart(2, "0");
  return `${outY}-${outM}-${outD}`;
}

// Format the date label indicator safely matching local timezones
function formatDateLabel(dateStr, period) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  
  if (period === "day") return `${parts[1]}-${parts[2]}`; // MM-DD
  if (period === "month") return `${parts[0]}-${parts[1]}`; // YYYY-MM
  if (period === "year") return parts[0]; // YYYY
  return null;
}

export default function Analytics() {
  const [period, setPeriod] = useState("day");
  const [date, setDate] = useState(getLocalTodayStr());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (p, d) => {
    setLoading(true);
    try {
      const params = { period: p };
      if (p !== "total") params.date = d;
      const res = await api.get("/analytics/sales", { params });
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period, date);
  }, [period, date, fetchData]);

  const periodTitle =
    period === "day"
      ? "Today's Revenue"
      : period === "month"
        ? "This Month Revenue"
        : period === "year"
          ? "This Year Revenue"
          : "Total Revenue";

  const periodProfitTitle =
    period === "day"
      ? "Today's Profit"
      : period === "month"
        ? "This Month Profit"
        : period === "year"
          ? "This Year Profit"
          : "Total Profit";

  return (
    <div style={S.page}>
      {/* Header Controls */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Analytics</h1>
          <p style={S.subtitle}>Revenue &amp; profit overview</p>
        </div>
        <div style={S.controls}>
          <div style={S.pillRow}>
            {periods.map((p) => (
              <button
                key={p.key}
                style={{
                  ...S.pill,
                  ...(period === p.key ? S.pillActive : {}),
                }}
                onClick={() => setPeriod(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
          {period !== "total" && (
            <div style={S.dateNav}>
              <button
                style={S.navBtn}
                onClick={() => setDate((d) => shiftDate(d, period, -1))}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={S.dateLabel}>{formatDateLabel(date, period)}</span>
              <button
                style={S.navBtn}
                onClick={() => setDate((d) => shiftDate(d, period, 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div style={S.loading}>
          <div style={S.spinner} />
          <p>Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Chart Section */}
          <div style={S.panel}>
            <div style={S.chartHeader}>
              <span style={S.chartTitle}>Revenue &amp; Profit</span>
              <span style={S.chartUnit}>₹</span>
            </div>
            {!data?.chart || data.chart.length === 0 ? (
              <div style={S.noData}>No sales data for this period</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={data.chart}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    interval={period === "day" ? 1 : "preserveStartEnd"}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} width={40} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 10,
                      border: "1px solid #E2E8F0",
                    }}
                    formatter={(val, name) => [
                      `₹${Number(val).toFixed(2)}`,
                      name === "revenue" ? "Revenue" : "Profit",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} name="revenue" />
                  <Bar dataKey="profit" fill="#34D399" radius={[4, 4, 0, 0]} name="profit" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Metric Grids */}
          <div style={S.statGrid}>
            <div style={{ ...S.statCard, background: "var(--primary-light)" }}>
              <div style={S.statTop}>
                <div>
                  <div style={S.statLabel}>{periodTitle}</div>
                  <div style={{ ...S.statValue, color: "var(--primary)" }}>
                    ₹{data?.periodRevenue ? Number(data.periodRevenue).toFixed(2) : "0.00"}
                  </div>
                </div>
                <div style={{ ...S.statIcon, background: "white" }}>
                  <Wallet size={20} color="var(--primary)" />
                </div>
              </div>
              <div style={S.statDivider} />
              <div style={S.statRow}>
                <div>
                  <div style={S.statMetaLabel}>Cumulative Revenue (₹)</div>
                  <div style={S.statMetaValue}>
                    {data?.cumulativeRevenue ? Number(data.cumulativeRevenue).toFixed(2) : "0.00"}
                  </div>
                </div>
                <div>
                  <div style={S.statMetaLabel}>Bills</div>
                  <div style={S.statMetaValue}>{data?.periodBills ?? 0}</div>
                </div>
              </div>
            </div>

            <div style={{ ...S.statCard, background: "var(--blue-light)" }}>
              <div style={S.statTop}>
                <div>
                  <div style={S.statLabel}>{periodProfitTitle}</div>
                  <div style={{ ...S.statValue, color: "var(--blue)" }}>
                    ₹{data?.periodProfit ? Number(data.periodProfit).toFixed(2) : "0.00"}
                  </div>
                </div>
                <div style={{ ...S.statIcon, background: "white" }}>
                  <TrendingUp size={20} color="var(--blue)" />
                </div>
              </div>
              <div style={S.statDivider} />
              <div style={S.statRow}>
                <div>
                  <div style={S.statMetaLabel}>Margin</div>
                  <div style={S.statMetaValue}>
                    {data?.periodRevenue && data.periodRevenue > 0
                      ? `${((data.periodProfit / data.periodRevenue) * 100).toFixed(1)}%`
                      : "0%"}
                  </div>
                </div>
                <div>
                  <div style={S.statMetaLabel}>Total Bills (all-time)</div>
                  <div style={S.statMetaValue}>{data?.cumulativeBills ?? 0}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const S = {
  page: { paddingBottom: 40 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: "var(--text)",
    letterSpacing: "-0.03em",
    margin: 0,
  },
  subtitle: { fontSize: 13, color: "var(--text-soft)", marginTop: 4 },
  controls: { display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" },
  pillRow: {
    display: "flex",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 999,
    padding: 3,
    gap: 2,
  },
  pill: {
    padding: "6px 16px",
    border: "none",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
    color: "var(--text-soft)",
    background: "transparent",
  },
  pillActive: {
    background: "white",
    color: "var(--primary)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  dateNav: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 999,
    padding: "4px 6px",
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    borderRadius: "50%",
    color: "var(--text-soft)",
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text)",
    minWidth: 70,
    textAlign: "center",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: 60,
    color: "var(--text-soft)",
    fontSize: 13,
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid var(--border)",
    borderTop: "3px solid var(--primary)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  panel: {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px 22px",
    boxShadow: "var(--shadow)",
    marginBottom: 20,
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  chartTitle: { fontSize: 15, fontWeight: 700, color: "var(--text)" },
  chartUnit: { fontSize: 12, color: "var(--text-soft)" },
  noData: {
    textAlign: "center",
    color: "#CBD5E1",
    padding: "60px 0",
    fontSize: 13,
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  statCard: {
    borderRadius: "var(--radius)",
    padding: "20px 22px",
  },
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statLabel: {
    fontSize: 12,
    color: "var(--text-soft)",
    fontWeight: 600,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  statDivider: {
    height: 1,
    background: "rgba(0,0,0,0.06)",
    margin: "16px 0",
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  statMetaLabel: {
    fontSize: 11,
    color: "var(--text-soft)",
    marginBottom: 4,
  },
  statMetaValue: {
    fontSize: 15,
    fontWeight: 700,
    color: "var(--text)",
  },
};