export default function StatCard({
  label,
  value,
  icon,
  color = "var(--primary)",
  bg = "var(--primary-light)",
  meta,
}) {
  return (
    <div style={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={styles.label}>{label}</div>
          <div style={{ ...styles.value, color }}>{value ?? "—"}</div>
          {meta && <div style={styles.meta}>{meta}</div>}
        </div>
        <div style={{ ...styles.iconBox, background: bg, color }}>{icon}</div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--white)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px 22px",
    boxShadow: "var(--shadow)",
  },
  label: {
    fontSize: 12,
    color: "var(--text-soft)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  meta: {
    fontSize: 12,
    color: "var(--text-soft)",
    marginTop: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
