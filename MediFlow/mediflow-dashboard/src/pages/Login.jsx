import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, user } = res.data;

      if (user.role !== "admin") {
        toast.error("This portal is for Store Admin only.");
        setLoading(false);
        return;
      }

      login(accessToken, user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoBadge}>+</div>
          <span style={styles.logoText}>MediFlow</span>
        </div>
        <p style={styles.subtitle}>Medical Store Management System</p>
        <p style={styles.portalTag}>Admin Portal</p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="admin@mediflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Supplier link */}
        <p style={styles.supplierLink}>
          Are you a supplier?{" "}
          {/* CAPITALIZED 'Link' AND FIXED TO 'to=' */}
          <Link to="/supplier/login" style={styles.link}>
            Login here →
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
  },
  card: {
    background: "var(--white)",
    borderRadius: 16,
    padding: "44px 40px",
    width: 400,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  logoBadge: {
    width: 36,
    height: 36,
    background: "var(--primary)",
    color: "white",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 20,
  },
  logoText: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: 700,
    color: "var(--primary)",
  },
  subtitle: {
    color: "var(--text-soft)",
    fontSize: 13,
    marginBottom: 4,
  },
  portalTag: {
    display: "inline-block",
    background: "var(--primary-light)",
    color: "var(--primary)",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    marginBottom: 28,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: "var(--text)",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid var(--border)",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "Inter",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 0.15s",
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
    marginTop: 8,
    transition: "opacity 0.15s",
  },
  supplierLink: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 13,
    color: "var(--text-soft)",
  },
  link: {
    color: "var(--primary)",
    fontWeight: 600,
    textDecoration: "none",
  },
};