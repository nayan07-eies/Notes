import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Pill,
  Receipt,
  Bell,
  Truck,
  ClipboardList,
  BarChart2,
  LogOut,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/inventory", label: "Inventory", icon: Pill },
  { path: "/billing", label: "Billing", icon: Receipt },
  { path: "/alerts", label: "Alerts", icon: Bell },
  { path: "/suppliers", label: "Suppliers", icon: Truck },
  { path: "/purchase-orders", label: "Purchase Orders", icon: ClipboardList },
  { path: "/analytics", label: "Analytics", icon: BarChart2 },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoBadge}>+</div>
        <span style={styles.logoText}>MediFlow</span>
      </div>

      {/* Nav Items */}
      <nav style={styles.nav}>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.userPill}>
          <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={styles.userName}>{user?.name}</div>
            <div style={styles.userRole}>Store Admin</div>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={logout}>
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 230,
    background: "var(--primary)",
    display: "flex",
    flexDirection: "column",
    padding: "24px 14px",
    minHeight: "100vh",
    flexShrink: 0,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 36,
    paddingLeft: 6,
  },
  logoBadge: {
    width: 30,
    height: 30,
    background: "white",
    color: "var(--primary)",
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
    flexShrink: 0,
  },
  logoText: {
    color: "white",
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: "-0.01em",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 8,
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none",
    fontSize: 13.5,
    fontWeight: 500,
    transition: "all 0.15s",
  },
  navItemActive: {
    background: "rgba(255,255,255,0.15)",
    color: "white",
    fontWeight: 600,
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: 16,
  },
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  userName: {
    color: "white",
    fontWeight: 600,
    fontSize: 13,
  },
  userRole: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
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
};
