import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CheckCircle, XCircle, Truck, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const STATUS_COLORS = {
  pending: { bg: "#FEF3C7", color: "#D97706", border: "#FCD34D" },
  accepted: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
  rejected: { bg: "#FEE2E2", color: "#DC2626", border: "#FCA5A5" },
  dispatched: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
  received: { bg: "#ECFDF5", color: "#059669", border: "#6EE7B7" },
};

export default function SupplierDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pos, setPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [viewPO, setViewPO] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Wrapped in useCallback to eliminate stale closure side effects & satisfy ESLint requirements
  const fetchPOs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/supplier-portal/po");
      setPOs(res.data.pos || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPOs();
  }, [fetchPOs]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/supplier-portal/po/${id}/status`, { status });
      toast.success(`Order ${status}!`);
      fetchPOs();
      
      // FIX: Only dismiss the preview modal if the active updated card is the one inside the modal view
      setViewPO((prev) => (prev?._id === id ? null : prev));
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const tabs = [
    {
      key: "pending",
      label: "Pending",
      count: pos.filter((p) => p.status === "pending").length,
    },
    {
      key: "accepted",
      label: "Accepted",
      count: pos.filter((p) => p.status === "accepted").length,
    },
    {
      key: "dispatched",
      label: "Dispatched",
      count: pos.filter((p) => p.status === "dispatched").length,
    },
    { key: "all", label: "All Orders", count: pos.length },
  ];

  const filtered =
    activeTab === "all" ? pos : pos.filter((p) => p.status === activeTab);

  return (
    <div style={S.page}>
      {/* ── Sidebar ── */}
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoBadge}>+</div>
          <span style={S.logoText}>MediFlow</span>
        </div>

        <div style={S.supplierInfo}>
          <div style={S.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={S.supplierName}>{user?.name}</div>
            <div style={S.supplierRole}>Supplier Portal</div>
          </div>
        </div>

        <div style={S.sidebarDivider} />

        <div style={S.sidebarStats}>
          <div style={S.sidebarStat}>
            <div style={S.sidebarStatVal}>
              {pos.filter((p) => p.status === "pending").length}
            </div>
            <div style={S.sidebarStatLabel}>Pending</div>
          </div>
          <div style={S.sidebarStat}>
            <div style={S.sidebarStatVal}>
              {pos.filter((p) => p.status === "accepted").length}
            </div>
            <div style={S.sidebarStatLabel}>Accepted</div>
          </div>
          <div style={S.sidebarStat}>
            <div style={S.sidebarStatVal}>{pos.length}</div>
            <div style={S.sidebarStatLabel}>Total</div>
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button style={S.logoutBtn} onClick={logout}>
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={S.main}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Purchase Orders</h1>
            <p style={S.subtitle}>Orders sent to you by MediFlow pharmacy</p>
          </div>
          {pos.filter((p) => p.status === "pending").length > 0 && (
            <div style={S.alertBadge}>
              🔔 {pos.filter((p) => p.status === "pending").length} order(s) need your response
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={S.tabs}>
          {tabs.map((t) => (
            <button
              key={t.key}
              style={{ ...S.tab, ...(activeTab === t.key ? S.tabActive : {}) }}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  style={{
                    ...S.tabCount,
                    ...(activeTab === t.key ? S.tabCountActive : {}),
                    ...(t.key === "pending" && t.count > 0
                      ? { background: "#FEE2E2", color: "#DC2626" }
                      : {}),
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* PO List */}
        {loading ? (
          <div style={S.empty}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={S.emptyState}>
            <Package size={48} color="#E2E8F0" />
            <p style={{ color: "#94A3B8", marginTop: 12 }}>
              No orders in this category
            </p>
          </div>
        ) : (
          <div style={S.poList}>
            {filtered.map((po) => {
              const sc = STATUS_COLORS[po.status] || STATUS_COLORS.pending;
              return (
                <div key={po._id} style={S.poCard}>
                  <div style={S.poCardTop}>
                    <div>
                      <div style={S.poNumber}>{po.poNumber}</div>
                      <div style={S.poDate}>
                        {new Date(po.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <span
                      style={{
                        ...S.statusBadge,
                        background: sc.bg,
                        color: sc.color,
                        border: `1px solid ${sc.border}`,
                      }}
                    >
                      {po.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Items preview */}
                  <div style={S.itemsPreview}>
                    {po.items.slice(0, 2).map((item, i) => (
                      <div key={i} style={S.itemRow}>
                        <span style={S.itemName}>{item.medicineName}</span>
                        <span style={S.itemQty}>{item.quantity} units</span>
                        {item.expectedPrice > 0 && (
                          <span style={S.itemPrice}>
                            ₹{item.expectedPrice}/unit
                          </span>
                        )}
                      </div>
                    ))}
                    {po.items.length > 2 && (
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>
                        +{po.items.length - 2} more item(s)
                      </div>
                    )}
                  </div>

                  {po.expectedDelivery && (
                    <div style={S.deliveryRow}>
                      <Truck size={13} color="#94A3B8" />
                      <span>
                        Expected by {new Date(po.expectedDelivery).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={S.poActions}>
                    <button style={S.viewBtn} onClick={() => setViewPO(po)}>
                      View Details
                    </button>
                    {po.status === "pending" && (
                      <>
                        <button
                          style={S.acceptBtn}
                          disabled={updating === po._id}
                          onClick={() => updateStatus(po._id, "accepted")}
                        >
                          <CheckCircle size={14} />
                          {updating === po._id ? "Updating..." : "Accept"}
                        </button>
                        <button
                          style={S.rejectBtn}
                          disabled={updating === po._id}
                          onClick={() => updateStatus(po._id, "rejected")}
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </>
                    )}
                    {po.status === "accepted" && (
                      <button
                        style={S.dispatchBtn}
                        disabled={updating === po._id}
                        onClick={() => updateStatus(po._id, "dispatched")}
                      >
                        <Truck size={14} />
                        {updating === po._id ? "Updating..." : "Mark Dispatched"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Detail Modal */}
        {viewPO && (
          <div style={S.overlay} onClick={() => setViewPO(null)}>
            <div style={S.modal} onClick={(e) => e.stopPropagation()}>
              <div style={S.modalHeader}>
                <div>
                  <div style={S.modalTitle}>{viewPO.poNumber}</div>
                  <div style={S.modalSub}>
                    Received on {new Date(viewPO.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <button style={S.closeBtn} onClick={() => setViewPO(null)}>
                  ✕
                </button>
              </div>

              <div style={S.modalBody}>
                {/* Status */}
                <div style={S.detailRow}>
                  <span style={S.detailLabel}>Status</span>
                  <span
                    style={{
                      ...S.statusBadge,
                      background: STATUS_COLORS[viewPO.status]?.bg,
                      color: STATUS_COLORS[viewPO.status]?.color,
                    }}
                  >
                    {viewPO.status.toUpperCase()}
                  </span>
                </div>
                {viewPO.expectedDelivery && (
                  <div style={S.detailRow}>
                    <span style={S.detailLabel}>Expected Delivery</span>
                    <span style={S.detailVal}>
                      {new Date(viewPO.expectedDelivery).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                )}
                {viewPO.notes && (
                  <div style={S.detailRow}>
                    <span style={S.detailLabel}>Notes</span>
                    <span style={S.detailVal}>{viewPO.notes}</span>
                  </div>
                )}

                {/* Items Table */}
                <div style={S.itemsTable}>
                  <div style={S.itemsTableHead}>
                    <span>Medicine</span>
                    <span>Quantity</span>
                    <span>Expected Price</span>
                  </div>
                  {viewPO.items.map((item, i) => (
                    <div key={i} style={S.itemsTableRow}>
                      <span style={{ fontWeight: 600 }}>
                        {item.medicineName}
                      </span>
                      <span>{item.quantity} units</span>
                      <span>
                        {item.expectedPrice > 0 ? `₹${item.expectedPrice}/unit` : "—"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Modal Actions */}
                {viewPO.status === "pending" && (
                  <div style={S.modalActions}>
                    <button
                      style={S.acceptBtn}
                      disabled={updating === viewPO._id}
                      onClick={() => updateStatus(viewPO._id, "accepted")}
                    >
                      <CheckCircle size={15} />
                      {updating === viewPO._id ? "Updating..." : "Accept Order"}
                    </button>
                    <button
                      style={S.rejectBtn}
                      disabled={updating === viewPO._id}
                      onClick={() => updateStatus(viewPO._id, "rejected")}
                    >
                      <XCircle size={15} />
                      Reject Order
                    </button>
                  </div>
                )}
                {viewPO.status === "accepted" && (
                  <div style={S.modalActions}>
                    <button
                      style={S.dispatchBtn}
                      disabled={updating === viewPO._id}
                      onClick={() => updateStatus(viewPO._id, "dispatched")}
                    >
                      <Truck size={15} />
                      {updating === viewPO._id ? "Updating..." : "Mark as Dispatched"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const S = {
  page: { display: "flex", minHeight: "100vh", background: "var(--bg)" },
  sidebar: {
    width: 220,
    background: "var(--primary)",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logo: { display: "flex", alignItems: "center", gap: 8, marginBottom: 28 },
  logoBadge: {
    width: 28,
    height: 28,
    background: "white",
    color: "var(--primary)",
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
  },
  logoText: { color: "white", fontWeight: 700, fontSize: 17 },
  supplierInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 15,
    flexShrink: 0,
  },
  supplierName: { color: "white", fontWeight: 600, fontSize: 13 },
  supplierRole: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 1 },
  sidebarDivider: {
    height: 1,
    background: "rgba(255,255,255,0.12)",
    margin: "4px 0 20px",
  },
  sidebarStats: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sidebarStat: { textAlign: "center" },
  sidebarStatVal: { fontSize: 22, fontWeight: 700, color: "white" },
  sidebarStatLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.08)",
    border: "none",
    color: "rgba(255,255,255,0.8)",
    padding: "9px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    width: "100%",
    fontFamily: "Inter",
  },
  main: { flex: 1, padding: "32px 36px", overflowY: "auto" },
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
  alertBadge: {
    background: "#FEF3C7",
    color: "#D97706",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid #FCD34D",
  },
  tabs: {
    display: "flex",
    gap: 4,
    marginBottom: 24,
    background: "white",
    padding: 4,
    borderRadius: 10,
    border: "1px solid var(--border)",
    width: "fit-content",
  },
  tab: {
    padding: "7px 16px",
    borderRadius: 7,
    border: "none",
    background: "transparent",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Inter",
    color: "var(--text-soft)",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  tabActive: { background: "var(--primary)", color: "white", fontWeight: 600 },
  tabCount: {
    background: "var(--border)",
    color: "var(--text-soft)",
    fontSize: 11,
    fontWeight: 600,
    padding: "1px 6px",
    borderRadius: 20,
  },
  tabCountActive: { background: "rgba(255,255,255,0.25)", color: "white" },
  empty: { textAlign: "center", color: "var(--text-soft)", padding: 40 },
  emptyState: { textAlign: "center", padding: "60px 0" },
  poList: { display: "flex", flexDirection: "column", gap: 14 },
  poCard: {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "18px 20px",
    boxShadow: "var(--shadow)",
  },
  poCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  poNumber: { fontWeight: 700, fontSize: 15, color: "var(--primary)" },
  poDate: { fontSize: 12, color: "var(--text-soft)", marginTop: 3 },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    display: "inline-block",
  },
  itemsPreview: {
    background: "var(--bg)",
    borderRadius: 8,
    padding: "10px 14px",
    marginBottom: 12,
  },
  itemRow: { display: "flex", alignItems: "center", gap: 16, padding: "4px 0" },
  itemName: { fontWeight: 600, fontSize: 13, color: "var(--text)", flex: 1 },
  itemQty: { fontSize: 13, color: "var(--text-soft)" },
  itemPrice: { fontSize: 13, color: "var(--primary)", fontWeight: 600 },
  deliveryRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "var(--text-soft)",
    marginBottom: 14,
  },
  poActions: { display: "flex", gap: 10, flexWrap: "wrap" },
  viewBtn: {
    padding: "8px 16px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
    color: "var(--text)",
  },
  acceptBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    background: "#ECFDF5",
    color: "#059669",
    border: "1px solid #6EE7B7",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
  },
  rejectBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    background: "#FEE2E2",
    color: "#DC2626",
    border: "1px solid #FCA5A5",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
  },
  dispatchBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    background: "#F5F3FF",
    color: "#7C3AED",
    border: "1px solid #DDD6FE",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "white",
    borderRadius: 14,
    width: "100%",
    maxWidth: 520,
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "20px 24px",
    borderBottom: "1px solid var(--border)",
  },
  modalTitle: { fontSize: 17, fontWeight: 700, color: "var(--text)" },
  modalSub: { fontSize: 12, color: "var(--text-soft)", marginTop: 3 },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    color: "var(--text-soft)",
    padding: 4,
  },
  modalBody: { padding: "20px 24px", overflowY: "auto" },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid var(--bg)",
  },
  detailLabel: { fontSize: 13, color: "var(--text-soft)", fontWeight: 500 },
  detailVal: { fontSize: 13, color: "var(--text)", fontWeight: 600 },
  itemsTable: {
    background: "var(--bg)",
    borderRadius: 8,
    padding: "12px 14px",
    margin: "16px 0",
  },
  itemsTableHead: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-soft)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1px solid var(--border)",
  },
  itemsTableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    fontSize: 13,
    color: "var(--text)",
    padding: "6px 0",
    borderBottom: "1px solid var(--border)",
  },
  modalActions: { display: "flex", gap: 10, marginTop: 16 },
};