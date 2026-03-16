import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

import { useSyncStatus } from "@/hooks/useAdminVideos";
import { useAuthUser } from "@/stores/authStore";
import { dismissToast, stopSyncing, useSyncStore } from "@/stores/syncStore";

import AdminSidebar from "./AdminSidebar";

function SyncToast({ type, message }: { type: "success" | "error"; message: string }) {
  useEffect(() => {
    const timer = setTimeout(dismissToast, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 shadow-lg text-white ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      {message}
    </div>
  );
}

function SyncPoller() {
  const { isSyncing } = useSyncStore();
  const { data: statusData } = useSyncStatus(isSyncing);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isSyncing || !statusData?.data)
      return;
    const status = statusData.data;
    if (!status.is_syncing) {
      if (status.last_error) {
        stopSyncing({ type: "error", message: `Sync failed: ${status.last_error}` });
      }
      else if (status.last_result) {
        stopSyncing({ type: "success", message: `Synced! ${status.last_result.newVideos} new, ${status.last_result.updatedVideos} updated` });
        queryClient.invalidateQueries({ queryKey: ["admin", "videos"] });
        queryClient.invalidateQueries({ queryKey: ["videos"] });
      }
      else {
        stopSyncing();
      }
    }
  }, [isSyncing, statusData, queryClient]);

  return null;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthUser();
  const { toast } = useSyncStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate, user]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center border-b border-[var(--color-border)] bg-[var(--color-navbar)] px-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="cursor-pointer border-none bg-transparent p-1 text-slate-300"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="ml-3 font-[var(--font-display)] text-sm tracking-widest text-white">CCTV AP PRAKASAM</span>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 h-screen transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      <SyncPoller />
      {toast && <SyncToast type={toast.type} message={toast.message} />}

      {/* Main content - add top padding on mobile for the top bar */}
      <main className="min-h-screen pt-14 lg:ml-[var(--sidebar-width)] lg:pt-0">
        <div className="p-4 md:p-6">
          <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" /></div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
