import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext<any>(null);

export const AdminProvider = ({ children }: any) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem("admin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  const login = (password: string) => {
    if (password === "jntu@2026") {
      localStorage.setItem("admin", "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("admin");
    setIsAdmin(false);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isEditMode, toggleEditMode, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
