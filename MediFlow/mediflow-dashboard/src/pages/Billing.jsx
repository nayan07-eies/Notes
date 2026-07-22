// import { useState, useEffect } from "react";
// import { Search, Plus, Trash2, Receipt, Download } from "lucide-react";
// import { toast } from "react-hot-toast";
// import api from "../api/axios";

// export default function Billing() {
//   const [medicines, setMedicines] = useState([]);
//   const [search, setSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [cartItems, setCartItems] = useState([]);
//   const [customerName, setCustomerName] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [paymentMode, setPaymentMode] = useState("cash");
//   const [discount, setDiscount] = useState(0);
//   const [bills, setBills] = useState([]);
//   const [loadingBills, setLoadingBills] = useState(true);
//   const [creating, setCreating] = useState(false);
//   const [activeTab, setActiveTab] = useState("new");

//   useEffect(() => {
//     fetchBills();
//   }, []);

//   useEffect(() => {
//     if (search.length < 2) {
//       setSearchResults([]);
//       return;
//     }
//     const timer = setTimeout(async () => {
//       try {
//         const res = await api.get("/medicines", {
//           params: { search, limit: 8 },
//         });
//         setSearchResults(res.data.medicines);
//       } catch {
//         setSearchResults([]);
//       }
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const fetchBills = async () => {
//     setLoadingBills(true);
//     try {
//       const res = await api.get("/bills");
//       setBills(res.data.bills);
//     } catch {
//       toast.error("Failed to load bills");
//     } finally {
//       setLoadingBills(false);
//     }
//   };

//   const addToCart = (med) => {
//     setCartItems((prev) => {
//       const exists = prev.find((i) => i.medicineId === med._id);
//       if (exists) {
//         return prev.map((i) =>
//           i.medicineId === med._id ? { ...i, qty: i.qty + 1 } : i,
//         );
//       }
//       return [
//         ...prev,
//         {
//           medicineId: med._id,
//           name: med.name,
//           mrp: med.mrp,
//           gstSlab: med.gstSlab,
//           stock: med.stock,
//           qty: 1,
//         },
//       ];
//     });
//     setSearch("");
//     setSearchResults([]);
//   };

//   const updateQty = (id, qty) => {
//     if (qty < 1) return;
//     setCartItems((prev) =>
//       prev.map((i) => (i.medicineId === id ? { ...i, qty } : i)),
//     );
//   };

//   const removeItem = (id) => {
//     setCartItems((prev) => prev.filter((i) => i.medicineId !== id));
//   };

//   // ── Calculations ──
//   const calcItem = (item) => {
//     const lineTotal = item.mrp * item.qty;
//     const base = Math.round((lineTotal / (1 + item.gstSlab / 100)) * 100) / 100;
//     const gstAmount = Math.round((lineTotal - base) * 100) / 100;
//     return { lineTotal, gstAmount };
//   };

//   const subtotal = cartItems.reduce((s, i) => s + calcItem(i).lineTotal, 0);
//   const totalGST = cartItems.reduce((s, i) => s + calcItem(i).gstAmount, 0);
//   const grandTotal = Math.max(0, subtotal - Number(discount));

//   const handleCreateBill = async () => {
//     if (cartItems.length === 0) {
//       toast.error("Add at least one medicine");
//       return;
//     }
//     setCreating(true);
//     try {
//       const payload = {
//         customerName: customerName || "Walk-in Customer",
//         customerPhone: customerPhone || "",
//         paymentMode,
//         discount: Number(discount),
//         items: cartItems.map((i) => ({ medicineId: i.medicineId, qty: i.qty })),
//       };
//       const res = await api.post("/bills", payload);
//       toast.success(`Bill ${res.data.bill.billNo} created!`);
//       setCartItems([]);
//       setCustomerName("");
//       setCustomerPhone("");
//       setDiscount(0);
//       setPaymentMode("cash");
//       fetchBills();
//       setActiveTab("history");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create bill");
//     } finally {
//       setCreating(false);
//     }
//   };

//   const downloadPDF = async (id) => {
//     try {
//       const token = localStorage.getItem("mediflow_token");
//       const res = await fetch(`http://localhost:5000/api/bills/${id}/pdf`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to download");
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `bill-${id}.pdf`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       toast.error("Failed to download PDF");
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.title}>Billing</h1>
//           <p style={styles.subtitle}>Create GST bills for walk-in customers</p>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div style={styles.tabs}>
//         <button
//           style={{
//             ...styles.tab,
//             ...(activeTab === "new" ? styles.tabActive : {}),
//           }}
//           onClick={() => setActiveTab("new")}
//         >
//           New Bill
//         </button>
//         <button
//           style={{
//             ...styles.tab,
//             ...(activeTab === "history" ? styles.tabActive : {}),
//           }}
//           onClick={() => setActiveTab("history")}
//         >
//           Bill History
//         </button>
//       </div>

//       {activeTab === "new" ? (
//         <div style={styles.billingGrid}>
//           {/* LEFT — Medicine search + cart */}
//           <div>
//             {/* Customer Info */}
//             <div style={styles.panel}>
//               <div style={styles.panelHeader}>
//                 <h3 style={styles.panelTitle}>Customer Details</h3>
//               </div>
//               <div style={styles.panelBody}>
//                 <div style={styles.row}>
//                   <div style={styles.formGroup}>
//                     <label style={styles.label}>Customer Name</label>
//                     <input
//                       style={styles.input}
//                       placeholder="Walk-in Customer"
//                       value={customerName}
//                       onChange={(e) => setCustomerName(e.target.value)}
//                     />
//                   </div>
//                   <div style={styles.formGroup}>
//                     <label style={styles.label}>Phone Number</label>
//                     <input
//                       style={styles.input}
//                       placeholder="9876543210"
//                       value={customerPhone}
//                       onChange={(e) => setCustomerPhone(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Medicine Search */}
//             <div style={styles.panel}>
//               <div style={styles.panelHeader}>
//                 <h3 style={styles.panelTitle}>Add Medicines</h3>
//               </div>
//               <div style={styles.panelBody}>
//                 <div style={styles.searchWrap}>
//                   <div style={styles.searchBox}>
//                     <Search size={15} color="var(--text-soft)" />
//                     <input
//                       style={styles.searchInput}
//                       placeholder="Search medicine by name..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                     />
//                   </div>
//                   {searchResults.length > 0 && (
//                     <div style={styles.dropdown}>
//                       {searchResults.map((med) => (
//                         <div
//                           key={med._id}
//                           style={styles.dropdownItem}
//                           onClick={() => addToCart(med)}
//                         >
//                           <div style={styles.dropdownName}>{med.name}</div>
//                           <div style={styles.dropdownMeta}>
//                             {med.brand} · Stock: {med.stock} · ₹{med.mrp}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Cart Items */}
//                 {cartItems.length === 0 ? (
//                   <div style={styles.emptyCart}>
//                     Search and add medicines to create a bill
//                   </div>
//                 ) : (
//                   <table style={styles.table}>
//                     <thead>
//                       <tr>
//                         {["Medicine", "MRP", "Qty", "GST", "Total", ""].map(
//                           (h) => (
//                             <th key={h} style={styles.th}>
//                               {h}
//                             </th>
//                           ),
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {cartItems.map((item) => {
//                         const { lineTotal, gstAmount } = calcItem(item);
//                         return (
//                           <tr key={item.medicineId}>
//                             <td style={styles.td}>
//                               <div style={styles.medName}>{item.name}</div>
//                             </td>
//                             <td style={styles.td}>₹{item.mrp}</td>
//                             <td style={styles.td}>
//                               <div style={styles.qtyControl}>
//                                 <button
//                                   style={styles.qtyBtn}
//                                   onClick={() =>
//                                     updateQty(item.medicineId, item.qty - 1)
//                                   }
//                                 >
//                                   −
//                                 </button>
//                                 <span style={styles.qtyNum}>{item.qty}</span>
//                                 <button
//                                   style={styles.qtyBtn}
//                                   onClick={() =>
//                                     updateQty(item.medicineId, item.qty + 1)
//                                   }
//                                 >
//                                   +
//                                 </button>
//                               </div>
//                             </td>
//                             <td style={styles.td}>₹{gstAmount.toFixed(2)}</td>
//                             <td style={styles.td}>
//                               <strong>₹{lineTotal.toFixed(2)}</strong>
//                             </td>
//                             <td style={styles.td}>
//                               <button
//                                 style={styles.removeBtn}
//                                 onClick={() => removeItem(item.medicineId)}
//                               >
//                                 <Trash2 size={14} />
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT — Bill Summary */}
//           <div>
//             <div style={styles.panel}>
//               <div style={styles.panelHeader}>
//                 <h3 style={styles.panelTitle}>Bill Summary</h3>
//               </div>
//               <div style={styles.panelBody}>
//                 <div style={styles.summaryRow}>
//                   <span>Subtotal</span>
//                   <span>₹{subtotal.toFixed(2)}</span>
//                 </div>
//                 <div style={styles.summaryRow}>
//                   <span>Total GST</span>
//                   <span>₹{totalGST.toFixed(2)}</span>
//                 </div>

//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Discount (₹)</label>
//                   <input
//                     style={styles.input}
//                     type="number"
//                     min="0"
//                     value={discount}
//                     onChange={(e) => setDiscount(e.target.value)}
//                   />
//                 </div>

//                 <div style={styles.formGroup}>
//                   <label style={styles.label}>Payment Mode</label>
//                   <select
//                     style={styles.input}
//                     value={paymentMode}
//                     onChange={(e) => setPaymentMode(e.target.value)}
//                   >
//                     <option value="cash">Cash</option>
//                     <option value="upi">UPI</option>
//                     <option value="credit">Credit</option>
//                   </select>
//                 </div>

//                 <div style={styles.grandTotal}>
//                   <span>Grand Total</span>
//                   <span>₹{grandTotal.toFixed(2)}</span>
//                 </div>

//                 <button
//                   style={{ ...styles.createBtn, opacity: creating ? 0.7 : 1 }}
//                   onClick={handleCreateBill}
//                   disabled={creating}
//                 >
//                   <Receipt size={16} />
//                   {creating ? "Creating..." : "Create Bill & Generate PDF"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         /* Bill History */
//         <div style={styles.panel}>
//           <div style={styles.panelHeader}>
//             <h3 style={styles.panelTitle}>Bill History</h3>
//           </div>
//           <div>
//             {loadingBills ? (
//               <div style={styles.emptyCart}>Loading bills...</div>
//             ) : bills.length === 0 ? (
//               <div style={styles.emptyCart}>
//                 No bills yet. Create your first bill!
//               </div>
//             ) : (
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     {[
//                       "Bill No",
//                       "Customer",
//                       "Date",
//                       "Items",
//                       "Payment",
//                       "Total",
//                       "PDF",
//                     ].map((h) => (
//                       <th key={h} style={styles.th}>
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bills.map((bill, i) => (
//                     <tr
//                       key={bill._id}
//                       style={{ background: i % 2 === 0 ? "white" : "#FAFAFA" }}
//                     >
//                       <td style={styles.td}>
//                         <strong style={{ color: "var(--primary)" }}>
//                           {bill.billNo}
//                         </strong>
//                       </td>
//                       <td style={styles.td}>{bill.customerName}</td>
//                       <td style={styles.td}>
//                         {new Date(bill.createdAt).toLocaleDateString("en-IN")}
//                       </td>
//                       <td style={styles.td}>{bill.items.length} item(s)</td>
//                       <td style={styles.td}>
//                         <span style={styles.payBadge}>
//                           {bill.paymentMode.toUpperCase()}
//                         </span>
//                       </td>
//                       <td style={styles.td}>
//                         <strong>₹{bill.grandTotal}</strong>
//                       </td>
//                       <td style={styles.td}>
//                         <button
//                           style={styles.pdfBtn}
//                           onClick={() => downloadPDF(bill._id)}
//                         >
//                           <Download size={14} /> PDF
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       )}
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
//   tabs: {
//     display: "flex",
//     gap: 4,
//     marginBottom: 24,
//     background: "white",
//     padding: 4,
//     borderRadius: 10,
//     border: "1px solid var(--border)",
//     width: "fit-content",
//   },
//   tab: {
//     padding: "8px 20px",
//     borderRadius: 8,
//     border: "none",
//     background: "transparent",
//     fontSize: 13,
//     fontWeight: 500,
//     cursor: "pointer",
//     fontFamily: "Inter",
//     color: "var(--text-soft)",
//   },
//   tabActive: { background: "var(--primary)", color: "white", fontWeight: 600 },
//   billingGrid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 },
//   panel: {
//     background: "white",
//     border: "1px solid var(--border)",
//     borderRadius: 10,
//     boxShadow: "var(--shadow)",
//     marginBottom: 20,
//   },
//   panelHeader: {
//     padding: "16px 20px",
//     borderBottom: "1px solid var(--border)",
//   },
//   panelTitle: { fontSize: 15, fontWeight: 600, color: "var(--text)" },
//   panelBody: { padding: 20 },
//   row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
//   formGroup: { marginBottom: 14 },
//   label: {
//     display: "block",
//     fontSize: 12,
//     fontWeight: 600,
//     marginBottom: 5,
//     color: "var(--text)",
//   },
//   input: {
//     width: "100%",
//     padding: "9px 12px",
//     border: "1.5px solid var(--border)",
//     borderRadius: 7,
//     fontSize: 13,
//     fontFamily: "Inter",
//     color: "var(--text)",
//     outline: "none",
//   },
//   searchWrap: { position: "relative", marginBottom: 16 },
//   searchBox: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     border: "1.5px solid var(--border)",
//     borderRadius: 8,
//     padding: "9px 14px",
//   },
//   searchInput: {
//     border: "none",
//     outline: "none",
//     fontSize: 13,
//     fontFamily: "Inter",
//     width: "100%",
//   },
//   dropdown: {
//     position: "absolute",
//     top: "100%",
//     left: 0,
//     right: 0,
//     background: "white",
//     border: "1px solid var(--border)",
//     borderRadius: 8,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//     zIndex: 100,
//     maxHeight: 240,
//     overflowY: "auto",
//   },
//   dropdownItem: {
//     padding: "12px 14px",
//     cursor: "pointer",
//     borderBottom: "1px solid var(--border)",
//     transition: "background 0.1s",
//   },
//   dropdownName: { fontWeight: 600, fontSize: 13, color: "var(--text)" },
//   dropdownMeta: { fontSize: 12, color: "var(--text-soft)", marginTop: 2 },
//   emptyCart: {
//     textAlign: "center",
//     color: "var(--text-soft)",
//     padding: "32px 0",
//     fontSize: 13,
//   },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: {
//     padding: "10px 12px",
//     background: "var(--primary-light)",
//     color: "var(--primary)",
//     fontWeight: 600,
//     fontSize: 11,
//     textAlign: "left",
//     textTransform: "uppercase",
//     letterSpacing: "0.03em",
//   },
//   td: {
//     padding: "11px 12px",
//     borderBottom: "1px solid var(--border)",
//     fontSize: 13,
//     verticalAlign: "middle",
//   },
//   medName: { fontWeight: 500 },
//   qtyControl: { display: "flex", alignItems: "center", gap: 8 },
//   qtyBtn: {
//     width: 26,
//     height: 26,
//     border: "1px solid var(--border)",
//     background: "white",
//     borderRadius: 5,
//     cursor: "pointer",
//     fontSize: 15,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontFamily: "Inter",
//   },
//   qtyNum: { fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: "center" },
//   removeBtn: {
//     background: "var(--red-light)",
//     color: "var(--red)",
//     border: "none",
//     padding: "6px 8px",
//     borderRadius: 6,
//     cursor: "pointer",
//   },
//   summaryRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     fontSize: 13,
//     color: "var(--text-soft)",
//     marginBottom: 12,
//   },
//   grandTotal: {
//     display: "flex",
//     justifyContent: "space-between",
//     fontSize: 17,
//     fontWeight: 700,
//     color: "var(--primary)",
//     padding: "14px 0",
//     borderTop: "2px solid var(--primary-light)",
//     borderBottom: "2px solid var(--primary-light)",
//     margin: "16px 0",
//   },
//   createBtn: {
//     width: "100%",
//     padding: "12px",
//     background: "var(--primary)",
//     color: "white",
//     border: "none",
//     borderRadius: 8,
//     fontSize: 13,
//     fontWeight: 600,
//     cursor: "pointer",
//     fontFamily: "Inter",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   payBadge: {
//     background: "var(--primary-light)",
//     color: "var(--primary)",
//     padding: "3px 8px",
//     borderRadius: 20,
//     fontSize: 11,
//     fontWeight: 600,
//   },
//   pdfBtn: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 5,
//     padding: "6px 10px",
//     background: "var(--blue-light)",
//     color: "var(--blue)",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 600,
//     fontFamily: "Inter",
//   },
// };

import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Receipt,
  Download,
  Pill,
  FlaskConical,
  Syringe,
  Droplet,
  Wind,
  SprayCan,
  Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const CATEGORIES = [
  {
    key: "tablets",
    label: "Tablets",
    icon: Pill,
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    key: "syrup",
    label: "Syrup",
    icon: FlaskConical,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    key: "injection",
    label: "Injection",
    icon: Syringe,
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  {
    key: "topical",
    label: "Topical",
    icon: SprayCan,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    key: "drops",
    label: "Drops",
    icon: Droplet,
    color: "#0891B2",
    bg: "#ECFEFF",
  },
  {
    key: "inhaler",
    label: "Inhaler",
    icon: Wind,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    key: "other",
    label: "Other",
    icon: Layers,
    color: "#64748B",
    bg: "#F8FAFC",
  },
];

export default function Billing() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryResults, setCategoryResults] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [discount, setDiscount] = useState(0);
  const [bills, setBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    if (search.length < 1) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get("/medicines", {
          params: { search, limit: 8 },
        });
        setSearchResults(res.data.medicines);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch every medicine in the selected category whenever the chip changes
  useEffect(() => {
    if (!activeCategory) {
      setCategoryResults([]);
      return;
    }
    setLoadingCategory(true);
    api
      .get("/medicines", { params: { category: activeCategory, limit: 100 } })
      .then((res) => setCategoryResults(res.data.medicines))
      .catch(() => {
        toast.error("Failed to load medicines for this category");
        setCategoryResults([]);
      })
      .finally(() => setLoadingCategory(false));
  }, [activeCategory]);

  const fetchBills = async () => {
    setLoadingBills(true);
    try {
      const res = await api.get("/bills");
      setBills(res.data.bills);
    } catch {
      toast.error("Failed to load bills");
    } finally {
      setLoadingBills(false);
    }
  };

  const toggleCategory = (key) => {
    setActiveCategory((prev) => (prev === key ? null : key));
    setSearch("");
    setSearchResults([]);
  };

  const addToCart = (med) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.medicineId === med._id);
      if (exists) {
        return prev.map((i) =>
          i.medicineId === med._id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          medicineId: med._id,
          name: med.name,
          mrp: med.mrp,
          gstSlab: med.gstSlab,
          stock: med.stock,
          qty: 1,
        },
      ];
    });
    setSearch("");
    setSearchResults([]);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i.medicineId === id ? { ...i, qty } : i)),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((i) => i.medicineId !== id));
  };

  // ── Calculations ──
  const calcItem = (item) => {
    const lineTotal = item.mrp * item.qty;
    const base = Math.round((lineTotal / (1 + item.gstSlab / 100)) * 100) / 100;
    const gstAmount = Math.round((lineTotal - base) * 100) / 100;
    return { lineTotal, gstAmount };
  };

  const subtotal = cartItems.reduce((s, i) => s + calcItem(i).lineTotal, 0);
  const totalGST = cartItems.reduce((s, i) => s + calcItem(i).gstAmount, 0);
  const grandTotal = Math.max(0, subtotal - Number(discount));

  const handleCreateBill = async () => {
    if (cartItems.length === 0) {
      toast.error("Add at least one medicine");
      return;
    }
    setCreating(true);
    try {
      const payload = {
        customerName: customerName || "Walk-in Customer",
        customerPhone: customerPhone || "",
        paymentMode,
        discount: Number(discount),
        items: cartItems.map((i) => ({ medicineId: i.medicineId, qty: i.qty })),
      };
      const res = await api.post("/bills", payload);
      toast.success(`Bill ${res.data.bill.billNo} created!`);
      setCartItems([]);
      setCustomerName("");
      setCustomerPhone("");
      setDiscount(0);
      setPaymentMode("cash");
      fetchBills();
      setActiveTab("history");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create bill");
    } finally {
      setCreating(false);
    }
  };

  const downloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("mediflow_token");
      const res = await fetch(`http://localhost:5000/api/bills/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to download");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bill-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Billing</h1>
          <p style={styles.subtitle}>Create GST bills for walk-in customers</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "new" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("new")}
        >
          New Bill
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "history" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("history")}
        >
          Bill History
        </button>
      </div>

      {activeTab === "new" ? (
        <div style={styles.billingGrid}>
          {/* LEFT — Medicine search + cart */}
          <div>
            {/* Customer Info */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <h3 style={styles.panelTitle}>Customer Details</h3>
              </div>
              <div style={styles.panelBody}>
                <div style={styles.row}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Customer Name</label>
                    <input
                      style={styles.input}
                      placeholder="Walk-in Customer"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone Number</label>
                    <input
                      style={styles.input}
                      placeholder="9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Medicine Search */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <h3 style={styles.panelTitle}>Add Medicines</h3>
              </div>
              <div style={styles.panelBody}>
                <div style={styles.searchWrap}>
                  <div style={styles.searchBox}>
                    <Search size={15} color="var(--text-soft)" />
                    <input
                      style={styles.searchInput}
                      placeholder="Search medicine by name..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        if (e.target.value) setActiveCategory(null);
                      }}
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div style={styles.dropdown}>
                      {searchResults.map((med) => {
                        const cat = CATEGORIES.find(
                          (c) => c.key === med.category,
                        );
                        return (
                          <div
                            key={med._id}
                            style={styles.dropdownItem}
                            onClick={() => addToCart(med)}
                          >
                            <div style={styles.dropdownTop}>
                              <span style={styles.dropdownName}>
                                {med.name}
                              </span>
                              {cat && (
                                <span
                                  style={{
                                    ...styles.dropdownBadge,
                                    color: cat.color,
                                    background: cat.bg,
                                  }}
                                >
                                  {cat.label}
                                </span>
                              )}
                            </div>
                            <div style={styles.dropdownMeta}>
                              {med.brand} · Stock: {med.stock} · ₹{med.mrp}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Category chips */}
                <div style={styles.chipRow}>
                  {CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    const isActive = activeCategory === c.key;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        style={{
                          ...styles.chip,
                          ...(isActive
                            ? {
                                background: c.color,
                                borderColor: c.color,
                                color: "white",
                              }
                            : { color: c.color }),
                        }}
                        onClick={() => toggleCategory(c.key)}
                        onMouseEnter={(e) => {
                          if (!isActive)
                            e.currentTarget.style.background = c.bg;
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive)
                            e.currentTarget.style.background = "white";
                        }}
                      >
                        <Icon size={13} />
                        {c.label}
                      </button>
                    );
                  })}
                </div>

                {/* Category card grid */}
                {activeCategory && (
                  <div style={styles.categoryPanel}>
                    <div style={styles.categoryPanelHeader}>
                      <span style={styles.categoryPanelTitle}>
                        {
                          CATEGORIES.find((c) => c.key === activeCategory)
                            ?.label
                        }
                        {!loadingCategory && (
                          <span style={styles.categoryPanelCount}>
                            {categoryResults.length}
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        style={styles.categoryPanelClose}
                        onClick={() => setActiveCategory(null)}
                      >
                        Clear
                      </button>
                    </div>
                    {loadingCategory ? (
                      <div style={styles.emptyCart}>Loading...</div>
                    ) : categoryResults.length === 0 ? (
                      <div style={styles.emptyCart}>
                        No medicines found in this category
                      </div>
                    ) : (
                      <div style={styles.cardGrid}>
                        {categoryResults.map((med) => {
                          const cat = CATEGORIES.find(
                            (c) => c.key === med.category,
                          );
                          const Icon = cat?.icon || Layers;
                          const outOfStock = med.stock === 0;
                          const lowStock =
                            !outOfStock && med.stock <= med.reorderThreshold;
                          return (
                            <div
                              key={med._id}
                              style={{
                                ...styles.medCard,
                                ...(outOfStock ? styles.medCardDisabled : {}),
                              }}
                              onClick={() => !outOfStock && addToCart(med)}
                              onMouseEnter={(e) => {
                                if (outOfStock) return;
                                e.currentTarget.style.boxShadow =
                                  "0 4px 14px rgba(0,0,0,0.08)";
                                e.currentTarget.style.borderColor =
                                  "var(--primary)";
                                e.currentTarget.style.transform =
                                  "translateY(-1px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "none";
                                e.currentTarget.style.borderColor =
                                  "var(--border)";
                                e.currentTarget.style.transform = "none";
                              }}
                            >
                              <div
                                style={{
                                  ...styles.medCardIcon,
                                  background: cat?.bg || "var(--primary-light)",
                                }}
                              >
                                <Icon
                                  size={16}
                                  color={cat?.color || "var(--primary)"}
                                />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={styles.medCardName}>{med.name}</div>
                                <div style={styles.medCardMeta}>
                                  {med.brand ? `${med.brand} · ` : ""}
                                  <strong style={{ color: "var(--text)" }}>
                                    ₹{med.mrp}
                                  </strong>
                                </div>
                                <div
                                  style={{
                                    ...styles.medCardStock,
                                    color: outOfStock
                                      ? "var(--red)"
                                      : lowStock
                                        ? "#D97706"
                                        : "var(--text-soft)",
                                  }}
                                >
                                  {outOfStock
                                    ? "Out of stock"
                                    : `Stock: ${med.stock}`}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Cart Items */}
                {cartItems.length === 0 ? (
                  <div style={styles.emptyCart}>
                    Search and add medicines to create a bill
                  </div>
                ) : (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {["Medicine", "MRP", "Qty", "GST", "Total", ""].map(
                          (h) => (
                            <th key={h} style={styles.th}>
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => {
                        const { lineTotal, gstAmount } = calcItem(item);
                        return (
                          <tr key={item.medicineId}>
                            <td style={styles.td}>
                              <div style={styles.medName}>{item.name}</div>
                            </td>
                            <td style={styles.td}>₹{item.mrp}</td>
                            <td style={styles.td}>
                              <div style={styles.qtyControl}>
                                <button
                                  style={styles.qtyBtn}
                                  onClick={() =>
                                    updateQty(item.medicineId, item.qty - 1)
                                  }
                                >
                                  −
                                </button>
                                <span style={styles.qtyNum}>{item.qty}</span>
                                <button
                                  style={styles.qtyBtn}
                                  onClick={() =>
                                    updateQty(item.medicineId, item.qty + 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td style={styles.td}>₹{gstAmount.toFixed(2)}</td>
                            <td style={styles.td}>
                              <strong>₹{lineTotal.toFixed(2)}</strong>
                            </td>
                            <td style={styles.td}>
                              <button
                                style={styles.removeBtn}
                                onClick={() => removeItem(item.medicineId)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Bill Summary */}
          <div>
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <h3 style={styles.panelTitle}>Bill Summary</h3>
              </div>
              <div style={styles.panelBody}>
                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Total GST</span>
                  <span>₹{totalGST.toFixed(2)}</span>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Discount (₹)</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Payment Mode</label>
                  <select
                    style={styles.input}
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>

                <div style={styles.grandTotal}>
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>

                <button
                  style={{ ...styles.createBtn, opacity: creating ? 0.7 : 1 }}
                  onClick={handleCreateBill}
                  disabled={creating}
                >
                  <Receipt size={16} />
                  {creating ? "Creating..." : "Create Bill & Generate PDF"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Bill History */
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>Bill History</h3>
          </div>
          <div>
            {loadingBills ? (
              <div style={styles.emptyCart}>Loading bills...</div>
            ) : bills.length === 0 ? (
              <div style={styles.emptyCart}>
                No bills yet. Create your first bill!
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    {[
                      "Bill No",
                      "Customer",
                      "Date",
                      "Items",
                      "Payment",
                      "Total",
                      "PDF",
                    ].map((h) => (
                      <th key={h} style={styles.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill, i) => (
                    <tr
                      key={bill._id}
                      style={{ background: i % 2 === 0 ? "white" : "#FAFAFA" }}
                    >
                      <td style={styles.td}>
                        <strong style={{ color: "var(--primary)" }}>
                          {bill.billNo}
                        </strong>
                      </td>
                      <td style={styles.td}>{bill.customerName}</td>
                      <td style={styles.td}>
                        {new Date(bill.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td style={styles.td}>{bill.items.length} item(s)</td>
                      <td style={styles.td}>
                        <span style={styles.payBadge}>
                          {bill.paymentMode.toUpperCase()}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <strong>₹{bill.grandTotal}</strong>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.pdfBtn}
                          onClick={() => downloadPDF(bill._id)}
                        >
                          <Download size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
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
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Inter",
    color: "var(--text-soft)",
  },
  tabActive: { background: "var(--primary)", color: "white", fontWeight: 600 },
  billingGrid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 },
  panel: {
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 10,
    boxShadow: "var(--shadow)",
    marginBottom: 20,
  },
  panelHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid var(--border)",
  },
  panelTitle: { fontSize: 15, fontWeight: 600, color: "var(--text)" },
  panelBody: { padding: 20 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  formGroup: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 5,
    color: "var(--text)",
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
  searchWrap: { position: "relative", marginBottom: 16 },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    padding: "9px 14px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: 13,
    fontFamily: "Inter",
    width: "100%",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 8,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    zIndex: 100,
    maxHeight: 240,
    overflowY: "auto",
  },
  dropdownItem: {
    padding: "12px 14px",
    cursor: "pointer",
    borderBottom: "1px solid var(--border)",
    transition: "background 0.1s",
  },
  dropdownTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  dropdownName: { fontWeight: 600, fontSize: 13, color: "var(--text)" },
  dropdownBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 999,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  dropdownMeta: { fontSize: 12, color: "var(--text-soft)", marginTop: 2 },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    borderRadius: 999,
    border: "1.5px solid currentColor",
    background: "white",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
    transition: "transform 0.1s, box-shadow 0.15s",
  },
  categoryPanel: {
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    maxHeight: 340,
    overflowY: "auto",
    background: "#FBFCFE",
  },
  categoryPanelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryPanelTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "var(--text)",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  categoryPanelCount: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-soft)",
    background: "var(--border)",
    borderRadius: 999,
    padding: "1px 8px",
  },
  categoryPanelClose: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-soft)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "Inter",
    padding: "2px 4px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 10,
  },
  medCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    background: "white",
    border: "1px solid var(--border)",
    borderRadius: 9,
    padding: "11px 12px",
    cursor: "pointer",
    transition: "box-shadow 0.15s, transform 0.1s, border-color 0.15s",
  },
  medCardDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  medCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  medCardName: {
    fontWeight: 600,
    fontSize: 12.5,
    color: "var(--text)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  medCardMeta: { fontSize: 11, color: "var(--text-soft)", marginTop: 3 },
  medCardStock: { fontSize: 11, fontWeight: 600, marginTop: 4 },
  emptyCart: {
    textAlign: "center",
    color: "var(--text-soft)",
    padding: "32px 0",
    fontSize: 13,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "10px 12px",
    background: "var(--primary-light)",
    color: "var(--primary)",
    fontWeight: 600,
    fontSize: 11,
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  td: {
    padding: "11px 12px",
    borderBottom: "1px solid var(--border)",
    fontSize: 13,
    verticalAlign: "middle",
  },
  medName: { fontWeight: 500 },
  qtyControl: { display: "flex", alignItems: "center", gap: 8 },
  qtyBtn: {
    width: 26,
    height: 26,
    border: "1px solid var(--border)",
    background: "white",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter",
  },
  qtyNum: { fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: "center" },
  removeBtn: {
    background: "var(--red-light)",
    color: "var(--red)",
    border: "none",
    padding: "6px 8px",
    borderRadius: 6,
    cursor: "pointer",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "var(--text-soft)",
    marginBottom: 12,
  },
  grandTotal: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 17,
    fontWeight: 700,
    color: "var(--primary)",
    padding: "14px 0",
    borderTop: "2px solid var(--primary-light)",
    borderBottom: "2px solid var(--primary-light)",
    margin: "16px 0",
  },
  createBtn: {
    width: "100%",
    padding: "12px",
    background: "var(--primary)",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  payBadge: {
    background: "var(--primary-light)",
    color: "var(--primary)",
    padding: "3px 8px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  pdfBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 10px",
    background: "var(--blue-light)",
    color: "var(--blue)",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Inter",
  },
};
