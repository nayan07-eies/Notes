import { useState, useEffect } from "react";
import { Plus, Eye, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import Modal from "../components/Modal";

const STATUS_COLORS = {
  pending: { bg: "#FEF3C7", color: "#D97706" },
  accepted: { bg: "#EFF6FF", color: "#2563EB" },
  rejected: { bg: "#FEE2E2", color: "#DC2626" },
  dispatched: { bg: "#F5F3FF", color: "#7C3AED" },
  received: { bg: "#ECFDF5", color: "#059669" },
};

const emptyForm = {
  supplierId: "",
  expectedDelivery: "",
  notes: "",
  items: [{ medicineName: "", quantity: "", expectedPrice: "" }],
};

export default function PurchaseOrders() {
  const [pos, setPOs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewPO, setViewPO] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [poRes, supRes, medRes] = await Promise.all([
        api.get("/suppliers/po/all"),
        api.get("/suppliers"),
        api.get("/medicines", { params: { limit: 100 } }),
      ]);
      setPOs(poRes.data.pos);
      setSuppliers(supRes.data.suppliers);
      setMedicines(medRes.data.medicines);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const addItem = () => {
    setForm((p) => ({
      ...p,
      items: [
        ...p.items,
        { medicineName: "", quantity: "", expectedPrice: "" },
      ],
    }));
  };

  const removeItem = (idx) => {
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
  };

  const updateItem = (idx, key, val) => {
    setForm((p) => ({
      ...p,
      items: p.items.map((item, i) =>
        i === idx ? { ...item, [key]: val } : item,
      ),
    }));
  };

  const selectMedicine = (idx, medName) => {
    updateItem(idx, "medicineName", medName);
  };

  // Only offer medicines that fall under a category this supplier actually stocks.
  // If the supplier has no categories set (empty array), don't restrict — treat as "supplies everything".
  const selectedSupplier = suppliers.find((s) => s._id === form.supplierId);
  const availableMedicines =
    selectedSupplier && selectedSupplier.categories?.length > 0
      ? medicines.filter((m) =>
          selectedSupplier.categories.includes(m.category),
        )
      : medicines;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplierId) {
      toast.error("Please select a supplier");
      return;
    }
    if (form.items.some((i) => !i.medicineName || !i.quantity)) {
      toast.error("Fill all medicine items");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        supplierId: form.supplierId,
        expectedDelivery: form.expectedDelivery,
        notes: form.notes,
        items: form.items.map((i) => ({
          medicineName: i.medicineName,
          quantity: Number(i.quantity),
          expectedPrice: Number(i.expectedPrice) || 0,
        })),
      };
      await api.post("/suppliers/po/create", payload);
      toast.success("Purchase Order created!");
      setShowModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create PO");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/suppliers/po/${id}/status`, { status });
      toast.success(`PO status updated to ${status}`);
      fetchAll();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredPOs =
    statusFilter === "all" ? pos : pos.filter((p) => p.status === statusFilter);

  const statusCounts = {
    all: pos.length,
    pending: pos.filter((p) => p.status === "pending").length,
    accepted: pos.filter((p) => p.status === "accepted").length,
    dispatched: pos.filter((p) => p.status === "dispatched").length,
    received: pos.filter((p) => p.status === "received").length,
  };

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Purchase Orders</h1>
          <p style={styles.subtitle}>{pos.length} total orders</p>
        </div>
        <button style={styles.addBtn} onClick={openCreate}>
          <Plus size={16} /> Create Purchase Order
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div style={styles.tabs}>
        {["all", "pending", "accepted", "dispatched", "received"].map((s) => (
          <button
            key={s}
            style={{
              ...styles.tab,
              ...(statusFilter === s ? styles.tabActive : {}),
            }}
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span
              style={{
                ...styles.tabCount,
                ...(statusFilter === s ? styles.tabCountActive : {}),
              }}
            >
              {statusCounts[s] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* PO Table */}
      <div style={styles.tableWrap}>
        {loading ? (
          <div style={styles.empty}>Loading purchase orders...</div>
        ) : filteredPOs.length === 0 ? (
          <div style={styles.empty}>
            No purchase orders found. Create your first PO!
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {[
                  "PO Number",
                  "Supplier",
                  "Items",
                  "Expected Delivery",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPOs.map((po, i) => {
                const sc = STATUS_COLORS[po.status] || STATUS_COLORS.pending;
                return (
                  <tr
                    key={po._id}
                    style={{ background: i % 2 === 0 ? "white" : "#FAFAFA" }}
                  >
                    <td style={styles.td}>
                      <strong style={{ color: "var(--primary)" }}>
                        {po.poNumber}
                      </strong>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.supplierName}>
                        {po.supplierId?.company || po.supplierName}
                      </div>
                      <div style={styles.supplierContact}>
                        {po.supplierId?.name}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.itemCount}>
                        {po.items.length} item(s)
                      </span>
                    </td>
                    <td style={styles.td}>
                      {po.expectedDelivery
                        ? new Date(po.expectedDelivery).toLocaleDateString(
                            "en-IN",
                          )
                        : "—"}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: sc.bg,
                          color: sc.color,
                        }}
                      >
                        {po.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          style={styles.viewBtn}
                          onClick={() => setViewPO(po)}
                        >
                          <Eye size={14} /> View
                        </button>
                        {po.status === "pending" && (
                          <select
                            style={styles.statusSelect}
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value)
                                updateStatus(po._id, e.target.value);
                            }}
                          >
                            <option value="" disabled>
                              Update
                            </option>
                            <option value="accepted">Accept</option>
                            <option value="rejected">Reject</option>
                          </select>
                        )}
                        {po.status === "accepted" && (
                          <button
                            style={styles.dispatchBtn}
                            onClick={() => updateStatus(po._id, "dispatched")}
                          >
                            Mark Dispatched
                          </button>
                        )}
                        {po.status === "dispatched" && (
                          <button
                            style={styles.receiveBtn}
                            onClick={() => updateStatus(po._id, "received")}
                          >
                            Mark Received
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* View PO Modal */}
      {viewPO && (
        <Modal
          isOpen={!!viewPO}
          onClose={() => setViewPO(null)}
          title={`Purchase Order — ${viewPO.poNumber}`}
          width={580}
        >
          <div style={styles.viewGrid}>
            <div>
              <div style={styles.viewLabel}>Supplier</div>
              <div style={styles.viewValue}>
                {viewPO.supplierId?.company || viewPO.supplierName}
              </div>
            </div>
            <div>
              <div style={styles.viewLabel}>Status</div>
              <span
                style={{
                  ...styles.statusBadge,
                  background: STATUS_COLORS[viewPO.status]?.bg,
                  color: STATUS_COLORS[viewPO.status]?.color,
                }}
              >
                {viewPO.status.toUpperCase()}
              </span>
            </div>
            <div>
              <div style={styles.viewLabel}>Expected Delivery</div>
              <div style={styles.viewValue}>
                {viewPO.expectedDelivery
                  ? new Date(viewPO.expectedDelivery).toLocaleDateString(
                      "en-IN",
                    )
                  : "Not specified"}
              </div>
            </div>
            <div>
              <div style={styles.viewLabel}>Created On</div>
              <div style={styles.viewValue}>
                {new Date(viewPO.createdAt).toLocaleDateString("en-IN")}
              </div>
            </div>
          </div>

          {viewPO.notes && (
            <div style={styles.notesBox}>
              <div style={styles.viewLabel}>Notes</div>
              <div style={{ fontSize: 13, color: "var(--text)", marginTop: 4 }}>
                {viewPO.notes}
              </div>
            </div>
          )}

          <div style={styles.viewLabel}>Ordered Items</div>
          <table style={{ ...styles.table, marginTop: 8 }}>
            <thead>
              <tr>
                {["Medicine", "Quantity", "Expected Price"].map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {viewPO.items.map((item, i) => (
                <tr
                  key={i}
                  style={{ background: i % 2 === 0 ? "white" : "#FAFAFA" }}
                >
                  <td style={styles.td}>{item.medicineName}</td>
                  <td style={styles.td}>{item.quantity} units</td>
                  <td style={styles.td}>
                    {item.expectedPrice ? `₹${item.expectedPrice}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      {/* Create PO Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Purchase Order"
        width={640}
      >
        <form onSubmit={handleSubmit}>
          {/* Supplier */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Supplier *</label>
            <select
              style={styles.input}
              value={form.supplierId}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  supplierId: e.target.value,
                  items: [
                    { medicineName: "", quantity: "", expectedPrice: "" },
                  ],
                }))
              }
              required
            >
              <option value="">Select supplier...</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.company} — {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Expected Delivery</label>
              <input
                style={styles.input}
                type="date"
                value={form.expectedDelivery}
                onChange={(e) =>
                  setForm((p) => ({ ...p, expectedDelivery: e.target.value }))
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Notes</label>
              <input
                style={styles.input}
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Optional notes..."
              />
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <label style={styles.label}>Medicine Items *</label>
              <button type="button" style={styles.addItemBtn} onClick={addItem}>
                <Plus size={13} /> Add Item
              </button>
            </div>

            {form.items.map((item, idx) => (
              <div key={idx} style={styles.itemRow}>
                <div style={{ flex: 2 }}>
                  <select
                    style={styles.input}
                    value={item.medicineName}
                    onChange={(e) => selectMedicine(idx, e.target.value)}
                    required
                    disabled={!form.supplierId}
                  >
                    <option value="">
                      {!form.supplierId
                        ? "Select a supplier first..."
                        : availableMedicines.length === 0
                          ? "No medicines match this supplier's categories"
                          : "Select medicine..."}
                    </option>
                    {availableMedicines.map((m) => (
                      <option key={m._id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(idx, "quantity", e.target.value)
                    }
                    required
                    min="1"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="Price (₹)"
                    value={item.expectedPrice}
                    onChange={(e) =>
                      updateItem(idx, "expectedPrice", e.target.value)
                    }
                    step="0.01"
                  />
                </div>
                {form.items.length > 1 && (
                  <button
                    type="button"
                    style={styles.removeItemBtn}
                    onClick={() => removeItem(idx)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={styles.modalFooter}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Creating..." : "Create Purchase Order"}
            </button>
          </div>
        </form>
      </Modal>
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
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    background: "var(--primary)",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
  },
  tabs: {
    display: "flex",
    gap: 4,
    marginBottom: 20,
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
  tableWrap: {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "var(--shadow)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "11px 14px",
    background: "var(--primary-light)",
    color: "var(--primary)",
    fontWeight: 600,
    fontSize: 11,
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid var(--border)",
    fontSize: 13,
    verticalAlign: "middle",
  },
  empty: { padding: 48, textAlign: "center", color: "var(--text-soft)" },
  supplierName: { fontWeight: 600, color: "var(--text)" },
  supplierContact: { fontSize: 12, color: "var(--text-soft)", marginTop: 2 },
  itemCount: {
    background: "var(--primary-light)",
    color: "var(--primary)",
    padding: "3px 8px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    display: "inline-block",
  },
  actions: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  viewBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 12px",
    background: "var(--primary-light)",
    color: "var(--primary)",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Inter",
  },
  statusSelect: {
    padding: "6px 10px",
    border: "1px solid var(--border)",
    borderRadius: 6,
    fontSize: 12,
    fontFamily: "Inter",
    cursor: "pointer",
    background: "white",
  },
  dispatchBtn: {
    padding: "6px 12px",
    background: "#F5F3FF",
    color: "#7C3AED",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Inter",
  },
  receiveBtn: {
    padding: "6px 12px",
    background: "#ECFDF5",
    color: "#059669",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Inter",
  },
  viewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 20,
  },
  viewLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-soft)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: 4,
  },
  viewValue: { fontSize: 14, fontWeight: 500, color: "var(--text)" },
  notesBox: {
    background: "var(--bg)",
    borderRadius: 8,
    padding: "12px 14px",
    marginBottom: 16,
  },
  formGroup: { marginBottom: 14, flex: 1 },
  formRow: { display: "flex", gap: 16, marginBottom: 0 },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: 5,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid var(--border)",
    borderRadius: 7,
    fontSize: 13,
    fontFamily: "Inter",
    color: "var(--text)",
    outline: "none",
  },
  addItemBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "6px 12px",
    background: "var(--primary-light)",
    color: "var(--primary)",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Inter",
  },
  itemRow: { display: "flex", gap: 10, marginBottom: 10, alignItems: "center" },
  removeItemBtn: {
    background: "var(--red-light)",
    color: "var(--red)",
    border: "none",
    borderRadius: 6,
    width: 32,
    height: 36,
    cursor: "pointer",
    fontSize: 14,
    flexShrink: 0,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    paddingTop: 16,
    borderTop: "1px solid var(--border)",
  },
  cancelBtn: {
    padding: "9px 20px",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
  },
  saveBtn: {
    padding: "9px 24px",
    background: "var(--primary)",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
  },
};
