import {
  Bookmark,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Settings,
  Users,
  Video,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

import logo from "@/assets/logo.svg";
import { useLogout } from "@/hooks/useAuth";
import { useAuthUser } from "@/stores/authStore";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/videos", icon: Video, label: "Videos", roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/categories", icon: FolderOpen, label: "Categories", roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/featured", icon: Bookmark, label: "Featured", roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/breaking-news", icon: Megaphone, label: "Breaking News", roles: ["ADMIN", "MANAGER"] },
  { to: "/admin/newsletter", icon: Mail, label: "Newsletter", roles: ["ADMIN"] },
  { to: "/admin/users", icon: Users, label: "Users", roles: ["ADMIN"] },
  { to: "/admin/settings", icon: Settings, label: "Settings", roles: ["ADMIN"] },
] as const;

export default function AdminSidebar() {
  const location = useLocation();
  const logout = useLogout();
  const user = useAuthUser();
  const userRole = user?.user_type ?? "CUSTOMER";

  const filteredNavItems = navItems.filter(item =>
    (item.roles as readonly string[]).includes(userRole),
  );

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/admin/login";
      },
    });
  }

  return (
    <aside className="flex h-screen w-[var(--sidebar-width)] flex-col border-r border-[var(--color-border)] bg-[var(--color-navbar)]">
      {/* Logo */}
      <div className="flex h-[var(--navbar-height)] items-center justify-center border-b border-white/10 px-4">
        <Link to="/admin">
          <img src={logo} alt="CCTV AP Prakasam" className="h-9 object-contain" />
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-0.5">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-[var(--font-heading)] text-[13px] font-medium no-underline transition-colors ${
                  isActive
                    ? "bg-[var(--color-primary)]/15 text-[var(--color-primary-light)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-3">
        {user && (
          <div className="mb-2 px-3 py-2">
            <p className="truncate font-[var(--font-heading)] text-[12px] font-medium text-slate-300">
              {user.first_name}
              {" "}
              {user.last_name}
            </p>
            <p className="font-[var(--font-body)] text-[10px] text-slate-500">{user.user_type}</p>
          </div>
        )}
        <Link
          to="/"
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 font-[var(--font-heading)] text-[13px] font-medium text-slate-400 no-underline transition-colors hover:bg-white/5 hover:text-slate-200"
        >
          ← View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg border-none bg-transparent px-3 py-2.5 font-[var(--font-heading)] text-[13px] font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
