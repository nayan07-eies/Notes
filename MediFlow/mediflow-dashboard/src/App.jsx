import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import Alerts from "./pages/Alerts";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import Analytics from "./pages/Analytics";

// Supplier pages
import SupplierLogin from "./pages/supplier/SupplierLogin";
import SupplierRegister from "./pages/supplier/SupplierRegister";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";

// Layout
import Layout from "./components/Layout";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "var(--text-soft)",
        }}
      >
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/supplier/dashboard" />;
  return children;
}

function SupplierRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "var(--text-soft)",
        }}
      >
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/supplier/login" />;
  if (user.role !== "supplier") return <Navigate to="/login" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Admin */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AdminRoute>
            <Layout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="billing" element={<Billing />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="purchase-orders" element={<PurchaseOrders />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Supplier */}
      <Route path="/supplier/login" element={<SupplierLogin />} />
      <Route path="/supplier/register" element={<SupplierRegister />} />
      <Route
        path="/supplier/dashboard"
        element={
          <SupplierRoute>
            <SupplierDashboard />
          </SupplierRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
