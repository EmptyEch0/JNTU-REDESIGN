import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginWithEmail, logoutAdmin, getCurrentAdmin, loginHod, getCurrentHodDept, logoutHod } from "../auth/auth.server";

const ONE_HOUR_MS = 60 * 60 * 1000; // 1 Hour (3,600,000 ms)

interface AdminContextType {
  isAdmin: boolean;
  role: string | null;
  hodDeptId: string | null;
  isEditMode: boolean;
  editModesByDept: Record<string, boolean>;
  authorizedDepts: string[];
  timedOutRole: "admin" | "hod" | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsHod: (deptId: string, deptSlug: string, password: string) => Promise<boolean>;
  authorizeDepartment: (deptId: string) => void;
  lockDepartment: (deptId: string) => void;
  hasEditPermission: (deptId: string) => boolean;
  isDeptEditing: (deptId: string) => boolean;
  setDeptEditing: (deptId: string, active: boolean) => void;
  setGlobalEditMode: (active: boolean) => void;
  logout: () => Promise<void>;
  dismissTimeoutModal: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [hodDeptId, setHodDeptId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false); // Global fallback state
  const [authorizedDepts, setAuthorizedDepts] = useState<string[]>([]);
  const [editModesByDept, setEditModesByDept] = useState<Record<string, boolean>>({});
  const [timedOutRole, setTimedOutRole] = useState<"admin" | "hod" | null>(null);

  const dismissTimeoutModal = () => {
    setTimedOutRole(null);
  };

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem("admin_session_start");
      localStorage.removeItem("hod_session_start");
    } catch {
      // ignore
    }
    try {
      await logoutAdmin();
    } catch (e) {
      console.error("Failed to invalidate session on logout:", e);
    }
    try {
      await logoutHod();
    } catch (e) {
      console.error("Failed to invalidate HOD session on logout:", e);
    }
    setIsAdmin(false);
    setRole(null);
    setHodDeptId(null);
    setIsEditMode(false);
    setAuthorizedDepts([]);
    setEditModesByDept({});
  }, []);

  const checkExpiration = useCallback(() => {
    const now = Date.now();
    try {
      // Check Admin Session Expiration (1 hour)
      const adminStart = localStorage.getItem("admin_session_start");
      if (isAdmin && adminStart) {
        if (now - Number(adminStart) >= ONE_HOUR_MS) {
          logout();
          setTimedOutRole("admin");
          return;
        }
      }

      // Check HOD Session Expiration (1 hour)
      const hodStart = localStorage.getItem("hod_session_start");
      if (hodDeptId && hodStart) {
        if (now - Number(hodStart) >= ONE_HOUR_MS) {
          logout();
          setTimedOutRole("hod");
          return;
        }
      }
    } catch {
      // ignore localStorage errors
    }
  }, [isAdmin, hodDeptId, logout]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const admin = await getCurrentAdmin();
        const now = Date.now();
        if (admin) {
          const adminStart = localStorage.getItem("admin_session_start");
          if (adminStart && now - Number(adminStart) >= ONE_HOUR_MS) {
            // Expired after 1 hour
            await logout();
            setTimedOutRole("admin");
            return;
          }

          if (!adminStart) {
            localStorage.setItem("admin_session_start", String(now));
          }

          setIsAdmin(true);
          setRole(admin.role || null);
          setAuthorizedDepts(admin.authorizedDepts || []);
    
          const initialModes: Record<string, boolean> = {};
          (admin.authorizedDepts || []).forEach(id => {
            initialModes[id] = true;
          });
          setEditModesByDept(initialModes);
        } else {
          setIsAdmin(false);
          setRole(null);
          setAuthorizedDepts([]);
          setEditModesByDept({});
          localStorage.removeItem("admin_session_start");
        }
    
        // check for an active HOD-only session
        const hodDept = await getCurrentHodDept();
        if (hodDept) {
          const hodStart = localStorage.getItem("hod_session_start");
          if (hodStart && now - Number(hodStart) >= ONE_HOUR_MS) {
            // Expired after 1 hour
            await logout();
            setTimedOutRole("hod");
            return;
          }

          if (!hodStart) {
            localStorage.setItem("hod_session_start", String(now));
          }
          setHodDeptId(hodDept);
        } else {
          setHodDeptId(null);
          localStorage.removeItem("hod_session_start");
        }
      } catch (e) {
        console.error("Failed to restore admin session:", e);
      }
    };
    initAuth();
  }, [logout]);

  // Periodic heartbeat & tab-focus check for 1-hour session timeout
  useEffect(() => {
    if (!isAdmin && !hodDeptId) return;

    const interval = setInterval(checkExpiration, 10000);
    const onActivityOrFocus = () => checkExpiration();

    window.addEventListener("focus", onActivityOrFocus);
    document.addEventListener("visibilitychange", onActivityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onActivityOrFocus);
      document.removeEventListener("visibilitychange", onActivityOrFocus);
    };
  }, [isAdmin, hodDeptId, checkExpiration]);

  const login = async (email: string, password: string) => {
    try {
      const admin = await loginWithEmail({data: { email, password }});
      if (admin) {
        try {
          localStorage.setItem("admin_session_start", String(Date.now()));
        } catch {}
        setTimedOutRole(null);
        setIsAdmin(true);
        setRole(admin.role || null);
        setAuthorizedDepts(admin.authorizedDepts || []);
  
        const initialModes: Record<string, boolean> = {};
        (admin.authorizedDepts || []).forEach(id => {
          initialModes[id] = true;
        });
        setEditModesByDept(initialModes);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login request failed:", err);
      throw err;
    }
  };

  const loginAsHod = async (deptId: string, deptSlug: string, password: string) => {
    try {
      const res = await loginHod({ data: { deptId, deptSlug, password } });
      if (res.success) {
        try {
          localStorage.setItem("hod_session_start", String(Date.now()));
        } catch {}
        setTimedOutRole(null);
        setHodDeptId(res.deptSlug); // store slug now, matches everywhere else
        return true;
      }
      return false;
    } catch (err) {
      console.error("HOD login request failed:", err);
      throw err;
    }
  };

  const authorizeDepartment = (deptId: string) => {
    setAuthorizedDepts((prev) => {
      if (prev.includes(deptId)) return prev;
      return [...prev, deptId];
    });
    setEditModesByDept((prev) => ({ ...prev, [deptId]: true }));
  };

  const lockDepartment = (deptId: string) => {
    setAuthorizedDepts((prev) => prev.filter((id) => id !== deptId));
    setEditModesByDept((prev) => ({ ...prev, [deptId]: false }));
  };

  const hasEditPermission = (deptId: string) => {
    if (role === "super_admin") return true;
    if (hodDeptId && hodDeptId === deptId) return true;
    return authorizedDepts.includes(deptId);
  };
  
  const isDeptEditing = (deptId: string) => {
    if (role === "super_admin") return true;
    if (hodDeptId && hodDeptId === deptId) return true;
    return !!editModesByDept[deptId];
  };

  const setDeptEditing = (deptId: string, active: boolean) => {
    setEditModesByDept((prev) => ({ ...prev, [deptId]: active }));
  };

  const setGlobalEditMode = (active: boolean) => {
    setIsEditMode(active);
  };

  return (
    <AdminContext.Provider 
      value={{ 
        isAdmin, 
        role,
        hodDeptId,
        isEditMode, 
        editModesByDept,
        authorizedDepts, 
        timedOutRole,
        login, 
        loginAsHod,
        authorizeDepartment, 
        lockDepartment,
        hasEditPermission,
        isDeptEditing,
        setDeptEditing,
        setGlobalEditMode,
        logout,
        dismissTimeoutModal
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider wrapper.");
  }
  return context;
};
