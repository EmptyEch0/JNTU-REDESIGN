import { createContext, useContext, useState, useEffect } from "react";
import { loginFaculty, logoutFaculty, getCurrentFacultyId, changeFacultyCredentials } from "@/lib/facultyAuth";

interface FacultyContextType {
  facultyId: number | null;
  isFacultyLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; deptSlug?: string; facultyId?: number }>;
  logout: () => Promise<void>;
  isOwnProfile: (targetFacultyId: string | number) => boolean;
  changeCredentials: (currentPassword: string, newEmail?: string, newPassword?: string) => Promise<{ success: boolean }>;
}
const FacultyContext = createContext<FacultyContextType | null>(null);

export const FacultyProvider = ({ children }: { children: React.ReactNode }) => {
  const [facultyId, setFacultyId] = useState<number | null>(null);
  const changeCredentials = async (currentPassword: string, newEmail?: string, newPassword?: string) => {
    const res = await changeFacultyCredentials({ data: { currentPassword, newEmail, newPassword } });
    return res;
  };

  useEffect(() => {
    const init = async () => {
      try {
        const id = await getCurrentFacultyId();
        setFacultyId(id);
      } catch (e) {
        console.error("Failed to restore faculty session:", e);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await loginFaculty({ data: { email, password } });
      if (res.success) {
        setFacultyId(res.facultyId);
        return { success: true, deptSlug: res.deptSlug, facultyId: res.facultyId };
      }
      return { success: false };
    } catch (err) {
      console.error("Faculty login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutFaculty();
    } catch (e) {
      console.error("Failed to invalidate faculty session:", e);
    }
    setFacultyId(null);
  };

  const isOwnProfile = (targetFacultyId: string | number) => {
    if (facultyId === null) return false;
    return Number(targetFacultyId) === facultyId;
  };

  return (
    <FacultyContext.Provider
  value={{ facultyId, isFacultyLoggedIn: facultyId !== null, login, logout, isOwnProfile, changeCredentials }}
>
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (!context) {
    throw new Error("useFaculty must be used within a FacultyProvider wrapper.");
  }
  return context;
};