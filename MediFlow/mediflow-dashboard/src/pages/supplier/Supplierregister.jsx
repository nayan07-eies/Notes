import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const CATEGORY_OPTIONS = [
  "tablets",
  "syrup",
  "injection",
  "topical",
  "drops",
  "inhaler",
  "other",
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  company: "",
  categories: [],
  gstNumber: "",
  city: "",
  state: "",
};

export default function SupplierRegister() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleCategory = (cat) => {
    setForm((p) => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter((c) => c !== cat)
        : [...p.categories, cat],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.categories.length === 0) {
      toast.error("Select at least one medicine category you supply");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/supplier-portal/register", form);
      const { accessToken, user } = res.data;
      login(accessToken, user);
      toast.success("Registered! Welcome to MediFlow.");
      navigate("/supplier/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoBadge}>+</div>
          <span style={styles.logoText}>MediFlow</span>
        </div>
        <p style={styles.portalTag}>Supplier Registration</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.sectionLabel}>Login Details</div>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contact Name</label>
              <input
                style={styles.input}
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Ramesh Shah"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                style={styles.input}
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="9876543210"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="you@company.com"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
          </div>

          <div style={styles.sectionLabel}>Company Details</div>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Company Name</label>
              <input
                style={styles.input}
                value={form.company}
                onChange={(e) =>
                  setForm((p) => ({ ...p, company: e.target.value }))
                }
                placeholder="Shah Medical Distributors"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>GST Number (optional)</label>
              <input
                style={styles.input}
                value={form.gstNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, gstNumber: e.target.value }))
                }
                placeholder="24XXXXX5678X1ZX"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                style={styles.input}
                value={form.city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, city: e.target.value }))
                }
                placeholder="Surat"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>State</label>
              <input
                style={styles.input}
                value={form.state}
                onChange={(e) =>
                  setForm((p) => ({ ...p, state: e.target.value }))
                }
                placeholder="Gujarat"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>What do you supply?</label>
            <div style={styles.chipRow}>
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  style={{
                    ...styles.chip,
                    ...(form.categories.includes(cat) ? styles.chipActive : {}),
                  }}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={styles.footerLink}>
          Already have an account?{" "}
          <Link to="/supplier/login" style={styles.link}>
            Log in →
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  screen: {
    minHeight: "100vh",
    background: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    background: "white",
    borderRadius: 16,
    padding: "40px 40px 32px",
    width: 520,
    maxWidth: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
  logoBadge: {
    width: 34,
    height: 34,
    background: "var(--primary)",
    color: "white",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
  },
  logoText: {
    fontFamily: "Inter",
    fontSize: 22,
    fontWeight: 700,
    color: "var(--primary)",
  },
  portalTag: {
    display: "inline-block",
    background: "var(--primary-light)",
    color: "var(--primary)",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 22,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-soft)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "18px 0 10px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px 14px",
  },
  formGroup: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 12.5,
    fontWeight: 600,
    marginBottom: 5,
    color: "var(--text)",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    fontSize: 13.5,
    fontFamily: "Inter",
    color: "var(--text)",
    outline: "none",
    boxSizing: "border-box",
  },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: {
    padding: "6px 13px",
    borderRadius: 999,
    border: "1.5px solid var(--border)",
    background: "white",
    color: "var(--text-soft)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Inter",
    textTransform: "capitalize",
  },
  chipActive: {
    background: "var(--primary)",
    borderColor: "var(--primary)",
    color: "white",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "var(--primary)",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Inter",
    cursor: "pointer",
    marginTop: 20,
  },
  footerLink: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
    color: "var(--text-soft)",
  },
  link: { color: "var(--primary)", fontWeight: 600, textDecoration: "none" },
};
