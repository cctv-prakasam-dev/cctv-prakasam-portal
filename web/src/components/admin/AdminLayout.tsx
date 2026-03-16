import { Outlet, useNavigate } from "@tanstack/react-router";
import { Suspense, useEffect } from "react";

import { useAuthUser } from "@/stores/authStore";

import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuthUser();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />
      <main className="ml-[var(--sidebar-width)] min-h-screen">
        <div className="p-6">
          <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" /></div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
