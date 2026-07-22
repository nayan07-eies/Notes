import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("mediflow_token");
    const storedUser = localStorage.getItem("mediflow_user");
    
    // 🛡️ Guard rail: check that strings exist AND are not literal "undefined" texts
    if (storedToken && storedToken !== "undefined" && storedUser && storedUser !== "undefined") {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Corrupted authentication storage token wiped out:", err);
        // Clean out dirty values silently if parsing breaks
        localStorage.removeItem("mediflow_token");
        localStorage.removeItem("mediflow_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (accessToken, userData) => {
    // Prevent "undefined" from getting written during initial login responses
    if (!accessToken || !userData) {
      console.error("Cannot initialize session with empty user parameter maps.");
      return;
    }
    localStorage.setItem("mediflow_token", accessToken);
    localStorage.setItem("mediflow_user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("mediflow_token");
    localStorage.removeItem("mediflow_user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);