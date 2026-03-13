import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { isAuthenticated } from "@/lib/auth";

import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />
      <main className="ml-[var(--sidebar-width)] min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
