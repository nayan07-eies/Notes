import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, AlertTriangle, ChevronDown, ChevronUp, Package, Layers, Calendar, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import Modal from "../components/Modal";

const CATEGORIES = ["tablets", "syrup", "injection", "topical", "drops", "inhaler", "other"];
const UNITS = ["tablet", "capsule", "ml", "mg", "g", "strip", "bottle", "tube"];
const GST_SLABS = [0, 5, 12, 18];

const emptyMedicineForm = {
  name: "",
  genericName: "",
  brand: "",
  manufacturer: "",
  category: "tablets",
  unit: "tablet",
  rackLocation: "",
  barcodeId: "",
  reorderThreshold: 10,
};

const emptyBatchForm = {
  batchNo: "",
  manufactureDate: "",
  expiryDate: "",
  purchasePrice: "",
  sellingPrice: "",
  mrp: "",
  gstSlab: 5,
  quantity: "", 
  supplier: "",
  invoiceNo: "",
};

export default function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [summary, setSummary] = useState({ totalMedicines: 0, totalStock: 0, expiringSoon: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [filterType, setFilterType] = useState(""); 
  
  const [medModal, setMedModal] = useState(false);
  const [batchModal, setBatchModal] = useState(false);
  
  const [activeMedicine, setActiveMedicine] = useState(null);
  const [activeBatchId, setActiveBatchId] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const [medForm, setMedForm] = useState(emptyMedicineForm);
  const [batchForm, setBatchForm] = useState(emptyBatchForm);
  const [saving, setSaving] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (filterType) params.filterType = filterType;
      
      const res = await api.get("/medicines", { params });
      setMedicines(res.data.medicines || []);
      if (res.data.summary) setSummary(res.data.summary);
    } catch {
      toast.error("Failed to load inventory data matrix.");
    } finally {
      setLoading(false);
    }
  }, [search, category, filterType]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const toggleRow = (id) => {
    setExpandedRows((p) => ({ ...p, [id]: !p[id] }));
  };

  // ── MEDICINE MASTER LOGIC ──
  const openAddMedicine = () => {
    setMedForm(emptyMedicineForm);
    setMedModal(true);
  };

  const handleMedicineSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/medicines", medForm);
      toast.success("New product catalog template established!");
      setMedModal(false);
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process database entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedicine = async (id, batchCount) => {
    const warnMsg = batchCount > 0 
      ? `Warning: Wiping this item will completely destroy all ${batchCount} active batch stock logs! Action cannot be undone. Proceed?`
      : "Are you sure you want to remove this catalog master item entry?";
    if (!confirm(warnMsg)) return;
    try {
      await api.delete(`/medicines/${id}`);
      toast.success("Catalog master cleared.");
      fetchInventory();
    } catch {
      toast.error("Failed to eliminate product mapping.");
    }
  };

  // ── BATCH SPECIFIC TRANSACTIONS ──
  const openAddBatch = (medicine) => {
    setActiveMedicine(medicine);
    setActiveBatchId(null);
    setBatchForm(emptyBatchForm);
    setBatchModal(true);
  };

  const openEditBatch = (medicine, batch) => {
    setActiveMedicine(medicine);
    setActiveBatchId(batch._id);
    
    const parseDateStr = (dateVal) => {
      if (!dateVal) return "";
      return dateVal.includes("T") ? dateVal.split("T")[0] : dateVal;
    };

    setBatchForm({
      batchNo: batch.batchNo,
      manufactureDate: parseDateStr(batch.manufactureDate),
      expiryDate: parseDateStr(batch.expiryDate),
      purchasePrice: batch.purchasePrice || "",
      sellingPrice: batch.sellingPrice || "",
      mrp: batch.mrp || "",
      gstSlab: batch.gstSlab ?? 5,
      quantity: batch.quantity ?? "", 
      supplier: batch.supplier || "",
      invoiceNo: batch.invoiceNo || "",
    });
    setBatchModal(true);
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeBatchId) {
        await api.put(`/medicines/batches/${activeBatchId}`, batchForm);
        toast.success("Batch pricing allocation and tracking metadata revised!");
      } else {
        await api.post(`/medicines/${activeMedicine._id}/batches`, batchForm);
        toast.success("New physical storage inventory batch pushed!");
      }
      setBatchModal(false);
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal transaction record error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    if (!confirm("Are you sure you want to drop this target batch sequence allocation from active tracking layout?")) return;
    try {
      await api.delete(`/medicines/batches/${batchId}`);
      toast.success("Batch logs dropped.");
      fetchInventory();
    } catch {
      toast.error("Failed to decay batch target trace parameters.");
    }
  };

  const checkExpiryStatus = (expiryDateStr) => {
    const days = (new Date(expiryDateStr) - new Date()) / (1000 * 60 * 60 * 24);
    if (days <= 0) return { label: "Expired", variant: styles.badgeDanger };
    if (days <= 30) return { label: "Expiring Soon", variant: styles.badgeWarning };
    return { label: "Stable", variant: styles.badgeSuccess };
  };

  return (
    <div style={styles.container}>
      {/* Visual Diagnostic Hub */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.card, borderLeft: "4px solid #4F46E5" }}>
          <div style={styles.cardHeader}><Package size={18} color="#4F46E5" /> Total Items</div>
          <div style={styles.cardVal}>{summary.totalMedicines}</div>
        </div>
        <div style={{ ...styles.card, borderLeft: "4px solid #10B981" }}>
          <div style={styles.cardHeader}><Layers size={18} color="#10B981" /> Total Pieces</div>
          <div style={styles.cardVal}>{summary.totalStock}</div>
        </div>
        <div style={{ ...styles.card, borderLeft: "4px solid #F59E0B" }}>
          <div style={styles.cardHeader}><Calendar size={18} color="#F59E0B" /> Expiring (30 Days)</div>
          <div style={styles.cardVal}>{summary.expiringSoon}</div>
        </div>
        <div style={{ ...styles.card, borderLeft: "4px solid #EF4444" }}>
          <div style={styles.cardHeader}><AlertTriangle size={18} color="#EF4444" /> Low Stock Warning</div>
          <div style={styles.cardVal}>{summary.lowStock}</div>
        </div>
      </div>

      {/* Primary Filtering Configuration Pipeline */}
      <div style={styles.filterStrip}>
        <div style={styles.searchContainer}>
          <Search size={16} color="#94A3B8" />
          <input
            style={styles.searchInput}
            placeholder="Filter catalog via token names, component compounds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <select style={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Category Lists</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
        </select>

        <select style={styles.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Standard Inventory View</option>
          <option value="lowStock">Trigger Reorder List Only</option>
          <option value="expiring">Near Expiry Risk Group</option>
          <option value="outOfStock">Exhausted Stock Logs</option>
        </select>

        <button style={styles.primaryAddBtn} onClick={openAddMedicine}>
          <Plus size={16} /> Add Product Master
        </button>
      </div>

      {/* Main Matrix Accordion Container */}
      <div style={styles.matrixWrap}>
        {loading ? (
          <div style={styles.centerMessage}><div style={styles.spinner} /> Assembling dynamic data sets...</div>
        ) : medicines.length === 0 ? (
          <div style={styles.centerMessage}><Info size={32} color="#94A3B8" /> No items matching current parameter configuration profiles found.</div>
        ) : (
          medicines.map((med) => {
            const rowExpanded = !!expandedRows[med._id];
            const isLow = med.totalStock <= med.reorderThreshold;
            
            return (
              <div key={med._id} style={styles.accordionNode}>
                {/* Accordion Visible Header Anchor Card */}
                <div style={styles.nodeHeader} onClick={() => toggleRow(med._id)}>
                  <div style={styles.metaColumn}>
                    <div style={styles.medPrimaryName}>{med.name}</div>
                    <div style={styles.medSecondaryName}>{med.genericName} • <span style={{fontWeight:600}}>{med.manufacturer}</span></div>
                  </div>

                  <div style={styles.statsRow}>
                    <div style={styles.statMetricPill}>
                      <span style={styles.statLabel}>Total Stock:</span>
                      <span style={{...styles.statValCount, color: isLow ? "#EF4444" : "#10B981"}}>
                        {med.totalStock} {med.unit}s
                      </span>
                    </div>

                    <div style={styles.badgeRow}>
                      <span style={styles.categoryBadge}>{med.category}</span>
                      {isLow && <span style={styles.lowStockBadge}>LOW STOCK</span>}
                      {med.nearestExpiry && (
                        <span style={styles.expiryTrackBadge}>
                          Next Exp: {new Date(med.nearestExpiry).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 🚀 ARROW DROPDOWN LAYOUT RESOLVED: Restructured nested structural tags for clean bubble events */}
                  <div style={styles.controlGroup}>
                    <button 
                      type="button"
                      style={styles.innerActionBtnAdd} 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        openAddBatch(med);
                      }}
                    >
                      <Plus size={13} /> Push New Batch
                    </button>

                    <button 
                      type="button"
                      style={styles.innerActionBtnDelete} 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleDeleteMedicine(med._id, med.batches?.length || 0);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>

                    <div style={{ marginLeft: 8, color: "#64748B", display: "flex", alignItems: "center" }}>
                      {rowExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Sub-Table Expansion Grid Section */}
                {rowExpanded && (
                  <div style={styles.nodeBodyTransitionBlock}>
                    {!med.batches || med.batches.length === 0 ? (
                      <div style={styles.innerEmptyBlock}>⚠️ No batch records pushed for this drug variant yet. Click "Push New Batch" to add storage parameters.</div>
                    ) : (
                      <table style={styles.innerTable}>
                        <thead>
                          <tr style={styles.innerTrHead}>
                            {["Batch No", "Expiry Date", "Qty Allocation", "Purchase", "MRP", "GST", "Fiscal Access"].map(lbl => (
                              <th key={lbl} style={styles.innerTh}>{lbl}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {med.batches.map(batch => {
                            const expMeta = checkExpiryStatus(batch.expiryDate);
                            return (
                              <tr key={batch._id} style={styles.innerTrBody}>
                                <td style={styles.innerTd}><strong>{batch.batchNo}</strong></td>
                                <td style={styles.innerTd}>
                                  <span style={{ ...styles.statusPill, ...expMeta.variant }}>
                                    {new Date(batch.expiryDate).toLocaleDateString("en-IN")} ({expMeta.label})
                                  </span>
                                </td>
                                <td style={styles.innerTd}><strong>{batch.quantity}</strong> units</td>
                                <td style={styles.innerTd}>₹{batch.purchasePrice}</td>
                                <td style={styles.innerTd}>₹{batch.mrp}</td>
                                <td style={styles.innerTd}>{batch.gstSlab}%</td>
                                <td style={styles.innerTd}>
                                  <div style={styles.actionCluster}>
                                    <button type="button" style={styles.miniEdit} onClick={() => openEditBatch(med, batch)}><Edit2 size={12} /></button>
                                    <button type="button" style={styles.miniDelete} onClick={() => handleDeleteBatch(batch._id)}><Trash2 size={12} /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── MODAL 1: PROVISION NEW MASTER ENTRY ── */}
      <Modal isOpen={medModal} onClose={() => setMedModal(false)} title="Provision New Catalog Product Variant">
        <form onSubmit={handleMedicineSubmit}>
          <div style={styles.modalFormGrid}>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Drug Name / Variant Identifier *</label>
              <input style={styles.fieldInput} required placeholder="e.g. Paracetamol 500mg" value={medForm.name} onChange={(e) => setMedForm(p=>({...p, name: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Generic Structural Composition *</label>
              <input style={styles.fieldInput} required placeholder="e.g. Acetaminophen" value={medForm.genericName} onChange={(e) => setMedForm(p=>({...p, genericName: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Brand Label / Trademark</label>
              <input style={styles.fieldInput} placeholder="e.g. Calpol" value={medForm.brand} onChange={(e) => setMedForm(p=>({...p, brand: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Manufacturer *</label>
              <input style={styles.fieldInput} required placeholder="e.g. GSK Labs" value={medForm.manufacturer} onChange={(e) => setMedForm(p=>({...p, manufacturer: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Category Class *</label>
              <select style={styles.fieldInput} value={medForm.category} onChange={(e) => setMedForm(p=>({...p, category: e.target.value}))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Measurement Unit *</label>
              <select style={styles.fieldInput} value={medForm.unit} onChange={(e) => setMedForm(p=>({...p, unit: e.target.value}))}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Rack Allocation Code</label>
              <input style={styles.fieldInput} placeholder="e.g. B-04" value={medForm.rackLocation} onChange={(e) => setMedForm(p=>({...p, rackLocation: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Reorder Flag Threshold</label>
              <input type="number" style={styles.fieldInput} value={medForm.reorderThreshold} onChange={(e) => setMedForm(p=>({...p, reorderThreshold: Number(e.target.value)}))} />
            </div>
          </div>
          <div style={styles.modalActionsContainer}>
            <button type="button" style={styles.secondaryBtn} onClick={() => setMedModal(false)}>Cancel</button>
            <button type="submit" style={styles.primaryBtn} disabled={saving}>{saving ? "Saving..." : "Deploy Variant"}</button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 2: INVENTORY STOCK BATCH ALLOCATION ── */}
      <Modal isOpen={batchModal} onClose={() => setBatchModal(false)} title={`${activeBatchId ? 'Modify Active' : 'Append New'} Inventory Delivery Run Batch`}>
        <form onSubmit={handleBatchSubmit}>
          <div style={styles.modalFormGrid}>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Batch Serial Assignment No *</label>
              <input style={styles.fieldInput} required placeholder="e.g. BTC-78A" value={batchForm.batchNo} onChange={(e) => setBatchForm(p=>({...p, batchNo: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Manufacturing Date</label>
              <input type="date" style={styles.fieldInput} value={batchForm.manufactureDate} onChange={(e) => setBatchForm(p=>({...p, manufactureDate: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Expiration Date Limit *</label>
              <input type="date" style={styles.fieldInput} required value={batchForm.expiryDate} onChange={(e) => setBatchForm(p=>({...p, expiryDate: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Quantity Loaded *</label>
              <input type="number" style={styles.fieldInput} required placeholder="0" value={batchForm.quantity} onChange={(e) => setBatchForm(p=>({...p, quantity: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Base Cost Purchase Price (₹) *</label>
              <input type="number" step="0.01" style={styles.fieldInput} required placeholder="0.00" value={batchForm.purchasePrice} onChange={(e) => setBatchForm(p=>({...p, purchasePrice: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Selling Retail Price (₹) *</label>
              <input type="number" step="0.01" style={styles.fieldInput} required placeholder="0.00" value={batchForm.sellingPrice} onChange={(e) => setBatchForm(p=>({...p, sellingPrice: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Max Retail Price MRP (₹) *</label>
              <input type="number" step="0.01" style={styles.fieldInput} required placeholder="0.00" value={batchForm.mrp} onChange={(e) => setBatchForm(p=>({...p, mrp: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>GST Slab Allocation *</label>
              <select style={styles.fieldInput} value={batchForm.gstSlab} onChange={(e) => setBatchForm(p=>({...p, gstSlab: Number(e.target.value)}))}>
                {GST_SLABS.map(g => <option key={g} value={g}>{g}%</option>)}
              </select>
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Consignment Supplier</label>
              <input style={styles.fieldInput} placeholder="Supplier name" value={batchForm.supplier} onChange={(e) => setBatchForm(p=>({...p, supplier: e.target.value}))} />
            </div>
            <div style={styles.fieldBox}>
              <label style={styles.fieldLabel}>Invoice Reference Number</label>
              <input style={styles.fieldInput} placeholder="INV-XXXX" value={batchForm.invoiceNo} onChange={(e) => setBatchForm(p=>({...p, invoiceNo: e.target.value}))} />
            </div>
          </div>
          <div style={styles.modalActionsContainer}>
            <button type="button" style={styles.secondaryBtn} onClick={() => setBatchModal(false)}>Cancel</button>
            <button type="submit" style={styles.primaryBtn} disabled={saving}>{saving ? "Saving..." : "Deploy Batch Data"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  container: { padding: "12px 0 40px" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 },
  card: { background: "white", padding: 18, borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 8 },
  cardHeader: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.02em" },
  cardVal: { fontSize: 26, fontWeight: 800, color: "#1E293B" },
  filterStrip: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" },
  searchContainer: { display: "flex", alignItems: "center", gap: 8, background: "white", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "8px 14px", flex: 1, minWidth: 260 },
  searchInput: { border: "none", outline: "none", fontSize: 13, fontFamily: "Inter", width: "100%", color: "#1E293B" },
  select: { padding: "9px 14px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, fontFamily: "Inter", background: "white", color: "#1E293B", cursor: "pointer", outline: "none" },
  primaryAddBtn: { display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", background: "var(--primary)", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter", transition: "background 0.2s" },
  matrixWrap: { display: "flex", flexDirection: "column", gap: 12 },
  centerMessage: { padding: 60, textAlign: "center", color: "#64748B", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontSize: 14, background: "white", borderRadius: 10, border: "1px solid #E2E8F0" },
  spinner: { width: 28, height: 28, border: "3px solid #E2E8F0", borderTop: "3px solid var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  accordionNode: { background: "white", border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", transition: "all 0.2s" },
  nodeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer", userSelect: "none", flexWrap: "wrap", gap: 16 },
  metaColumn: { display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 200 },
  medPrimaryName: { fontSize: 16, fontWeight: 700, color: "#1E293B" },
  medSecondaryName: { fontSize: 12, color: "#64748B" },
  statsRow: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, minWidth: 220 }, 
  statMetricPill: { fontSize: 13, display: "flex", gap: 4, alignItems: "baseline" },
  statLabel: { color: "#64748B", fontWeight: 500 },
  statValCount: { fontWeight: 700 },
  badgeRow: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 },
  categoryBadge: { background: "#F1F5F9", color: "#475569", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase" },
  lowStockBadge: { background: "#FEE2E2", color: "#EF4444", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 },
  expiryTrackBadge: { background: "#EFF6FF", color: "#2563EB", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 },
  controlGroup: { display: "flex", alignItems: "center", gap: 8 },
  innerActionBtnAdd: { display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" },
  innerActionBtnDelete: { padding: "6px 8px", background: "#FFF5F5", color: "#C53030", border: "1px solid #FEB2B2", borderRadius: 6, cursor: "pointer" },
  nodeBodyTransitionBlock: { padding: "0 20px 20px", background: "#FAFAFA", borderTop: "1px dashed #E2E8F0" },
  innerEmptyBlock: { padding: "16px 0", textAlign: "center", color: "#64748B", fontSize: 12.5, fontStyle: "italic" },
  innerTable: { width: "100%", borderCollapse: "collapse", marginTop: 12, background: "white", borderRadius: 8, overflow: "hidden", border: "1.5px solid #E2E8F0" },
  innerTh: { padding: "10px 14px", background: "#F8FAFC", color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", textAlign: "left", borderBottom: "1.5px solid #E2E8F0" },
  innerTrBody: { borderBottom: "1px solid #F1F5F9" },
  innerTd: { padding: "10px 14px", fontSize: 13, color: "#334155", verticalAlign: "middle" },
  statusPill: { padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 },
  badgeSuccess: { background: "#D1FAE5", color: "#065F46" },
  badgeWarning: { background: "#FEF3C7", color: "#92400E" },
  badgeDanger: { background: "#FEE2E2", color: "#991B1B" },
  actionCluster: { display: "flex", gap: 4 },
  miniEdit: { padding: "4px 6px", background: "#EFF6FF", color: "#2563EB", border: "none", borderRadius: 4, cursor: "pointer" },
  miniDelete: { padding: "4px 6px", background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 4, cursor: "pointer" },
  modalFormGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" },
  fieldBox: { display: "flex", flexDirection: "column", gap: 4 },
  fieldLabel: { fontSize: 12, fontWeight: 600, color: "#334155" },
  fieldInput: { padding: "8px 12px", border: "1.5px solid #E2E8F0", borderRadius: 6, fontSize: 13, fontFamily: "Inter", outline: "none", color: "#1E293B" },
  modalActionsContainer: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, paddingTop: 14, borderTop: "1px solid #E2E8F0" },
  secondaryBtn: { padding: "8px 16px", background: "transparent", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#475569" },
  primaryBtn: { padding: "8px 20px", background: "var(--primary)", color: "white", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }
};