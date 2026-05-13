import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";

export const Route = createFileRoute("/admin/")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [password, setPassword] = useState("");
  // 1. Added isAdmin to the destructuring
  const { login, isAdmin } = useAdmin(); 
  const navigate = useNavigate();

  // 2. SMART REDIRECT: If already logged in, skip this page!
  useEffect(() => {
    if (isAdmin) {
      navigate({ to: "/" });
    }
  }, [isAdmin, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      // 3. Navigate to the DASHBOARD on success, not the Home page
      navigate({ to: "/" }); 
    } else {
      alert("Wrong password");
    }
  };

  // 4. Safety: Don't show the login form if we are already logged in
  if (isAdmin) return null;

  return (
    <div className="h-screen flex items-center justify-center bg-sand/30 px-6">
      <div className="p-8 bg-card border border-border rounded-2xl shadow-[var(--shadow-elegant)] max-w-sm w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink">Admin Login</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your password to access admin features.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}