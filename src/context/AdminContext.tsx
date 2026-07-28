import { createContext, useContext, useState, useEffect } from "react";
import { loginWithEmail, logoutAdmin, getCurrentAdmin } from "../auth/auth.server";

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean; // Fully restored for global navbar tracking
  editModesByDept: Record<string, boolean>; 
  authorizedDepts: string[];
  login: (email: string, password: string) => Promise<boolean>;
  authorizeDepartment: (deptId: string) => void;
  lockDepartment: (deptId: string) => void; 
  hasEditPermission: (deptId: string) => boolean;
  isDeptEditing: (deptId: string) => boolean;
  setDeptEditing: (deptId: string, active: boolean) => void;
  setGlobalEditMode: (active: boolean) => void; // Added for non-department administration pages
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Global fallback state
  const [authorizedDepts, setAuthorizedDepts] = useState<string[]>([]);
  const [editModesByDept, setEditModesByDept] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initAuth = async () => {
      try {
        const admin = await getCurrentAdmin();
        if (admin) {
          setIsAdmin(true);
          setAuthorizedDepts(admin.authorizedDepts || []);
          
          const initialModes: Record<string, boolean> = {};
          (admin.authorizedDepts || []).forEach(id => {
            initialModes[id] = true;
          });
          setEditModesByDept(initialModes);
        } else {
          setIsAdmin(false);
          setAuthorizedDepts([]);
          setEditModesByDept({});
        }
      } catch (e) {
        console.error("Failed to restore admin session:", e);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const admin = await loginWithEmail({data: { email, password }});
      if (admin) {
        setIsAdmin(true);
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
    return authorizedDepts.includes(deptId);
  };

  const isDeptEditing = (deptId: string) => {
    return !!editModesByDept[deptId];
  };

  const setDeptEditing = (deptId: string, active: boolean) => {
    setEditModesByDept((prev) => ({ ...prev, [deptId]: active }));
  };

  const setGlobalEditMode = (active: boolean) => {
    setIsEditMode(active);
  };

  const logout = async () => {
    try {
      await logoutAdmin();
    } catch (e) {
      console.error("Failed to invalidate session on logout:", e);
    }
    setIsAdmin(false);
    setIsEditMode(false);
    setAuthorizedDepts([]);
    setEditModesByDept({});
  };

  return (
    <AdminContext.Provider 
      value={{ 
        isAdmin, 
        isEditMode, 
        editModesByDept,
        authorizedDepts, 
        login, 
        authorizeDepartment, 
        lockDepartment,
        hasEditPermission,
        isDeptEditing,
        setDeptEditing,
        setGlobalEditMode,
        logout 
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
