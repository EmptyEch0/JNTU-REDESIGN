import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginFaculty, logoutFaculty, getCurrentFacultyId, changeFacultyCredentials } from "@/lib/facultyAuth";

const ONE_HOUR_MS = 60 * 60 * 1000; // 1 Hour (3,600,000 ms)

interface FacultyContextType {
  facultyId: number | null;
  isFacultyLoggedIn: boolean;
  timedOutFaculty: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; deptSlug?: string; facultyId?: number }>;
  logout: () => Promise<void>;
  isOwnProfile: (targetFacultyId: string | number) => boolean;
  changeCredentials: (currentPassword: string, newEmail?: string, newPassword?: string) => Promise<{ success: boolean }>;
  dismissFacultyTimeout: () => void;
}
const FacultyContext = createContext<FacultyContextType | null>(null);

export const FacultyProvider = ({ children }: { children: React.ReactNode }) => {
  const [facultyId, setFacultyId] = useState<number | null>(null);
  const [timedOutFaculty, setTimedOutFaculty] = useState(false);

  const dismissFacultyTimeout = () => {
    setTimedOutFaculty(false);
  };

  const changeCredentials = async (currentPassword: string, newEmail?: string, newPassword?: string) => {
    const res = await changeFacultyCredentials({ data: { currentPassword, newEmail, newPassword } });
    return res;
  };

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem("faculty_session_start");
    } catch {
      // ignore
    }
    try {
      await logoutFaculty();
    } catch (e) {
      console.error("Failed to invalidate faculty session:", e);
    }
    setFacultyId(null);
  }, []);

  const checkExpiration = useCallback(() => {
    if (facultyId === null) return;
    const now = Date.now();
    try {
      const start = localStorage.getItem("faculty_session_start");
      if (start && now - Number(start) >= ONE_HOUR_MS) {
        logout();
        setTimedOutFaculty(true);
      }
    } catch {
      // ignore localStorage errors
    }
  }, [facultyId, logout]);

  useEffect(() => {
    const init = async () => {
      try {
        const id = await getCurrentFacultyId();
        const now = Date.now();
        if (id) {
          const start = localStorage.getItem("faculty_session_start");
          if (start && now - Number(start) >= ONE_HOUR_MS) {
            await logout();
            setTimedOutFaculty(true);
            return;
          }

          if (!start) {
            localStorage.setItem("faculty_session_start", String(now));
          }
          setFacultyId(id);
        } else {
          setFacultyId(null);
          localStorage.removeItem("faculty_session_start");
        }
      } catch (e) {
        console.error("Failed to restore faculty session:", e);
      }
    };
    init();
  }, [logout]);

  // Periodic heartbeat & tab-focus check for 1-hour session timeout
  useEffect(() => {
    if (facultyId === null) return;

    const interval = setInterval(checkExpiration, 10000);
    const onActivityOrFocus = () => checkExpiration();

    window.addEventListener("focus", onActivityOrFocus);
    document.addEventListener("visibilitychange", onActivityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onActivityOrFocus);
      document.removeEventListener("visibilitychange", onActivityOrFocus);
    };
  }, [facultyId, checkExpiration]);

  const login = async (email: string, password: string) => {
    try {
      const res = await loginFaculty({ data: { email, password } });
      if (res.success) {
        try {
          localStorage.setItem("faculty_session_start", String(Date.now()));
        } catch {}
        setTimedOutFaculty(false);
        setFacultyId(res.facultyId);
        return { success: true, deptSlug: res.deptSlug, facultyId: res.facultyId };
      }
      return { success: false };
    } catch (err) {
      console.error("Faculty login failed:", err);
      throw err;
    }
  };

  const isOwnProfile = (targetFacultyId: string | number) => {
    if (facultyId === null) return false;
    return Number(targetFacultyId) === facultyId;
  };

  return (
    <FacultyContext.Provider
      value={{ 
        facultyId, 
        isFacultyLoggedIn: facultyId !== null, 
        timedOutFaculty, 
        login, 
        logout, 
        isOwnProfile, 
        changeCredentials,
        dismissFacultyTimeout 
      }}
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