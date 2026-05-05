import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { MegaMenu } from "@/components/MegaMenu";
import { Footer } from "@/components/Footer";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import { QueryClientProvider } from "@tanstack/react-query";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-eyebrow mb-3">404</div>
        <h1 className="text-display text-5xl text-ink">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Back home</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JNTU-GV College of Engineering Vizianagaram" },
      { name: "description", content: "A premier engineering college shaping tomorrow's innovators — JNTU-GV CEV." },
      { name: "author", content: "JNTU-GV CEV" },
      { property: "og:title", content: "JNTU-GV College of Engineering Vizianagaram" },
      { property: "og:description", content: "A premier engineering college shaping tomorrow's innovators — JNTU-GV CEV." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "JNTU-GV College of Engineering Vizianagaram" },
      { name: "twitter:description", content: "A premier engineering college shaping tomorrow's innovators — JNTU-GV CEV." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/456b7283-b8f9-4b85-ab44-c95de54f717f/id-preview-dd487b58--97bf9169-b7f5-4566-9e17-2db61f222788.lovable.app-1777518152701.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/456b7283-b8f9-4b85-ab44-c95de54f717f/id-preview-dd487b58--97bf9169-b7f5-4566-9e17-2db61f222788.lovable.app-1777518152701.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap",
      },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

declare module "@tanstack/react-router" {
  interface StaticDataRouteContext {
    queryClient: import("@tanstack/react-query").QueryClient;
  }
}

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <AdminContent />
      </AdminProvider>
    </QueryClientProvider>
  );
}

function AdminContent() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { isAdmin, isEditMode, toggleEditMode, logout } = useAdmin();

  return (
    <div className={`min-h-screen flex flex-col ${isAdmin ? "pt-12" : ""}`}>
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 h-12 bg-black text-white px-6 flex items-center justify-between z-[100] shadow-lg">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Admin</span>
              <span className="text-xs font-medium">Dashboard</span>
            </div>
            
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                isEditMode 
                ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" 
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isEditMode ? "bg-primary animate-pulse" : "bg-zinc-600"}`} />
              {isEditMode ? "Editing Enabled" : "Enable Edit Mode"}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/admin/placements" className="text-[11px] font-medium hover:text-primary transition-colors">Manage Placements</Link>
            <button 
              onClick={logout}
              className="text-[11px] font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      <MegaMenu />
      <main key={path} className="flex-1 animate-[fade-in_0.5s_ease-out]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
