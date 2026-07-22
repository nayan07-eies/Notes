import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  KeyRound,
  Pill,
  Search,
  Building2
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import Modal from "../components/Modal";

const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  address: { street: "", city: "", state: "", pincode: "" },
  gstNumber: "",
  drugLicenseNumber: "",
  medicines: [],
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]); 
  const [pendingSignups, setPendingSignups] = useState([]); // Suppliers who self-registered online
  const [searchFilter, setSearchFilter] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [suppliersRes, medicinesRes, pendingRes] = await Promise.all([
        api.get("/suppliers"),
        api.get("/medicines"),
        api.get("/suppliers/pending-signups") // API endpoint returning self-registered supplier applications
      ]);
      
      const supplierData = suppliersRes.data?.suppliers || suppliersRes.data?.data || [];
      const medicineData = medicinesRes.data?.medicines || medicinesRes.data?.data || [];
      const pendingData = pendingRes.data?.pending || pendingRes.data?.data || [];
      
      setSuppliers(Array.isArray(supplierData) ? supplierData : []);
      setMedicines(Array.isArray(medicineData) ? medicineData : []);
      setPendingSignups(Array.isArray(pendingData) ? pendingData : []);
    } catch (err) {
      toast.error("Failed to synchronize component data records");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setSearchFilter("");
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditItem(s);
    setForm({
      name: s.name,
      company: s.company,
      email: s.email,
      phone: s.phone,
      address: s.address || { street: "", city: "", state: "", pincode: "" },
      gstNumber: s.gstNumber || "",
      drugLicenseNumber: s.drugLicenseNumber || "",
      medicines: s.medicines?.map((m) => m._id || m) || [],
    });
    setSearchFilter("");
    setShowModal(true);
  };

  const handleSelectPendingSupplier = (selectedId) => {
    const selected = pendingSignups.find(p => p._id === selectedId);
    if (!selected) return;

    // Auto-populate the form with the profile data submitted by the supplier
    setForm({
      name: selected.name || "",
      company: selected.company || "",
      email: selected.email || "",
      phone: selected.phone || "",
      address: selected.address || { street: "", city: "", state: "", pincode: "" },
      gstNumber: selected.gstNumber || "",
      drugLicenseNumber: selected.drugLicenseNumber || "",
      medicines: selected.medicines?.map((m) => m._id || m) || [],
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this supplier profile?")) return;
    try {
      await api.delete(`/suppliers/${id}`);
      toast.success("Supplier profile deleted successfully");
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete profile");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editItem && !form.company) {
      toast.error("Please select a registered supplier application to establish an agreement.");
      return;
    }

    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/suppliers/${editItem._id}`, form);
        toast.success("Supplier catalog configurations updated!");
      } else {
        await api.post("/suppliers/approve", form); // Promotes the registration record to an active supplier node
        toast.success("Supplier agreement successfully established!");
      }
      setShowModal(false);
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to commit record updates");
    } finally {
      setSaving(false);
    }
  };

  const toggleMedicineSelection = (medId) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.includes(medId)
        ? prev.medicines.filter((id) => id !== medId)
        : [...prev.medicines, medId],
    }));
  };

  const filteredMedicinesIndex = medicines.filter((med) =>
    med.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    med.strength?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div>
      {/* Structural Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Supplier Management</h1>
          <p style={styles.subtitle}>{suppliers.length} active wholesale distribution nodes verified</p>
        </div>
        <button style={styles.addBtn} onClick={openAdd}>
          <Plus size={16} /> Add Supplier Profile
        </button>
      </div>

      {loading ? (
        <div style={styles.empty}>Processing secure supplier data layers...</div>
      ) : suppliers.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ color: "var(--text-soft)", fontSize: 14, marginBottom: 16 }}>
            No verified suppliers found. Establish active profiles from registered signups to start ordering.
          </p>
          <button style={styles.addBtn} onClick={openAdd}>
            <Plus size={16} /> Link Registered Supplier
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {suppliers.map((sup) => (
            <div key={sup._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>{sup.company.charAt(0).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.companyName}>{sup.company}</div>
                  <div style={styles.contactName}>{sup.name} (POC)</div>
                </div>
                <div style={styles.cardActions}>
                  <button style={styles.editBtn} onClick={() => openEdit(sup)}><Edit2 size={14} /></button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(sup._id)}><Trash2 size={14} /></button>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoRow}><Mail size={13} color="var(--text-soft)" /><span>{sup.email}</span></div>
                <div style={styles.infoRow}><Phone size={13} color="var(--text-soft)" /><span>{sup.phone}</span></div>
                {sup.address?.city && (
                  <div style={styles.infoRow}>
                    <MapPin size={13} color="var(--text-soft)" />
                    <span>{sup.address.city}, {sup.address.state}</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                  {sup.gstNumber && <div style={styles.gstRow}>GST: {sup.gstNumber}</div>}
                  {sup.drugLicenseNumber && <div style={styles.gstRow}>DL: {sup.drugLicenseNumber}</div>}
                </div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "var(--text-soft)", marginBottom: 6 }}>
                  <Pill size={12} /> APPROVED ITEM CATALOG ({sup.medicines?.length || 0})
                </div>
                <div style={styles.categories}>
                  {sup.medicines && sup.medicines.length > 0 ? (
                    sup.medicines.map((med) => (
                      <span key={med._id || med} style={styles.catBadge}>{med.name} {med.strength || ""}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: 12, color: "var(--text-soft)", fontStyle: "italic" }}>No product configurations mapped</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unified Core Modal Workspace Panel */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? "Modify Supplier Catalog Details" : "Establish Profile from Registered Wholesalers"}
        width={650}
      >
        <form onSubmit={handleSubmit}>
          
          {/* ── CONDITIONAL RENDER: APPLICATION SELECTOR DROPDOWN FOR NEW ENTRIES ── */}
          {!editItem && (
            <div style={{ marginBottom: 20, padding: 14, background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <label style={{ ...styles.label, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Building2 size={15} color="var(--primary)" /> Select Registered Supplier Application *
              </label>
              
              {pendingSignups.length === 0 ? (
                <div style={{ padding: "10px 0", color: "var(--red)", fontSize: 13, fontWeight: 600, fontStyle: "italic" }}>
                  ⚠️ No remaining registered suppliers to add. All application logs are cleared.
                </div>
              ) : (
                <select
                  required
                  onChange={(e) => handleSelectPendingSupplier(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: 7, border: "1.5px solid var(--border)", fontSize: 13, outline: "none" }}
                  defaultValue=""
                >
                  <option value="" disabled>-- Choose a Pending Supplier Signup Request --</option>
                  {pendingSignups.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.company} ({p.name})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* ── READ ONLY SUBMITTED DATA VISUALIZATIONS ── */}
          {form.company && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10, borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>
                Profile Dossier Information (Submitted by Supplier)
              </h4>
              <div style={styles.profileDataGrid}>
                <div><strong>Contact Person:</strong> {form.name}</div>
                <div><strong>Company Title:</strong> {form.company}</div>
                <div><strong>Email Address:</strong> {form.email}</div>
                <div><strong>Phone Number:</strong> {form.phone}</div>
                <div><strong>Registered Base:</strong> {form.address.city}, {form.address.state}</div>
                <div><strong>Postal Pincode:</strong> {form.address.pincode}</div>
                <div><strong>GST Registration:</strong> {form.gstNumber || "N/A"}</div>
                <div><strong>Drug License (DL):</strong> {form.drugLicenseNumber || "N/A"}</div>
              </div>
            </div>
          )}

          {/* Searchable Multi-Select Medicine Assignment Matrix */}
          {form.company && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ ...styles.label, marginBottom: 6, display: "block" }}>
                Configure Approved Pharmaceutical Catalog Allocation
              </label>
              
              <div style={styles.searchContainer}>
                <Search size={14} style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Filter stock records by name or dosage strength configuration..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.catGrid}>
                {filteredMedicinesIndex.length > 0 ? (
                  filteredMedicinesIndex.map((med) => {
                    const isChecked = form.medicines.includes(med._id);
                    return (
                      <button
                        key={med._id}
                        type="button"
                        onClick={() => toggleMedicineSelection(med._id)}
                        style={{
                          ...styles.catToggle,
                          ...(isChecked ? styles.catToggleActive : {}),
                        }}
                      >
                        {med.name} {med.strength || ""}
                      </button>
                    );
                  })
                ) : (
                  <div style={{ fontSize: 12, color: "var(--text-soft)", width: "100%", padding: "10px 0", textAlign: "center" }}>
                    No inventory metrics match string criteria.
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={styles.modalFooter}>
            <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
            <button 
              type="submit" 
              style={styles.saveBtn} 
              disabled={saving || (!editItem && !form.company)}
            >
              {saving ? "Processing Records..." : editItem ? "Update Catalog Settings" : "Verify & Add Profile"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13, color: "var(--text-soft)", marginTop: 4 },
  addBtn: { display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", background: "var(--primary)", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  empty: { textAlign: "center", color: "var(--text-soft)", padding: 40 },
  emptyState: { textAlign: "center", padding: "60px 0", background: "white", borderRadius: 10, border: "1px solid var(--border)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 },
  card: { background: "white", border: "1px solid var(--border)", borderRadius: 10, padding: 20, boxShadow: "var(--shadow)", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  cardHeader: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  avatar: { width: 42, height: 42, borderRadius: 10, background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 },
  companyName: { fontWeight: 700, fontSize: 14, color: "var(--text)", lineHeight: 1.3 },
  contactName: { fontSize: 12, color: "var(--text-soft)", marginTop: 2 },
  cardActions: { display: "flex", gap: 6, marginLeft: "auto" },
  editBtn: { padding: "6px 8px", background: "var(--blue-light)", color: "var(--blue)", border: "none", borderRadius: 6, cursor: "pointer" },
  deleteBtn: { padding: "6px 8px", background: "var(--red-light)", color: "var(--red)", border: "none", borderRadius: 6, cursor: "pointer" },
  cardBody: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 },
  infoRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-soft)" },
  gstRow: { fontSize: 11, color: "var(--text-soft)", background: "var(--bg)", padding: "4px 8px", borderRadius: 5, fontFamily: "monospace" },
  categories: { display: "flex", flexWrap: "wrap", gap: 6 },
  catBadge: { background: "var(--primary-light)", color: "var(--primary)", padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600 },
  label: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 5 },
  profileDataGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontSize: 13, background: "var(--bg)", padding: 14, borderRadius: 8, border: "1px solid var(--border)", color: "var(--text)" },
  searchContainer: { position: "relative", marginBottom: 10 },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-soft)" },
  searchInput: { width: "100%", padding: "8px 12px 8px 34px", border: "1.5px solid var(--border)", borderRadius: 7, fontSize: 13, outline: "none" },
  catGrid: { display: "flex", flexWrap: "wrap", gap: 6, maxHeight: "150px", overflowY: "auto", border: "1.5px solid var(--border)", padding: 10, borderRadius: 8, background: "white" },
  catToggle: { padding: "5px 12px", border: "1.5px solid var(--border)", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "white", color: "var(--text-soft)" },
  catToggleActive: { background: "var(--primary)", color: "white", border: "1.5px solid var(--primary)", fontWeight: 600 },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: "1px solid var(--border)" },
  cancelBtn: { padding: "9px 20px", background: "transparent", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  saveBtn: { padding: "9px 24px", background: "var(--primary)", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
};