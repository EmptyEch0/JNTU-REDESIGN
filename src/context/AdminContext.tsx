import { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean; // Fully restored for global navbar tracking
  editModesByDept: Record<string, boolean>; 
  authorizedDepts: string[];
  login: (password: string) => boolean;
  authorizeDepartment: (deptId: string) => void;
  lockDepartment: (deptId: string) => void; 
  hasEditPermission: (deptId: string) => boolean;
  isDeptEditing: (deptId: string) => boolean;
  setDeptEditing: (deptId: string, active: boolean) => void;
  setGlobalEditMode: (active: boolean) => void; // Added for non-department administration pages
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Global fallback state
  const [authorizedDepts, setAuthorizedDepts] = useState<string[]>([]);
  const [editModesByDept, setEditModesByDept] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminStatus = localStorage.getItem("admin") === "true";
      let savedDepts: string[] = [];
      try {
        savedDepts = JSON.parse(localStorage.getItem("authorized_depts") || "[]");
      } catch (e) {
        savedDepts = [];
      }
      setIsAdmin(adminStatus);
      setAuthorizedDepts(savedDepts);

      const initialModes: Record<string, boolean> = {};
      savedDepts.forEach(id => {
        initialModes[id] = true;
      });
      setEditModesByDept(initialModes);
    }
  }, []);

  const login = (password: string) => {
    if (password === "jntu@2026") {
      localStorage.setItem("admin", "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const authorizeDepartment = (deptId: string) => {
    setAuthorizedDepts((prev) => {
      if (prev.includes(deptId)) return prev;
      const updated = [...prev, deptId];
      localStorage.setItem("authorized_depts", JSON.stringify(updated));
      return updated;
    });
    setEditModesByDept((prev) => ({ ...prev, [deptId]: true }));
  };

  const lockDepartment = (deptId: string) => {
    setAuthorizedDepts((prev) => {
      const updated = prev.filter((id) => id !== deptId);
      localStorage.setItem("authorized_depts", JSON.stringify(updated));
      return updated;
    });
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

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("authorized_depts");
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