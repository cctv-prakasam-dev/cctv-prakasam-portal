import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import AdminLayout from "@/components/admin/AdminLayout";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import VideoDetail from "@/pages/VideoDetail";
import Videos from "@/pages/Videos";
import Dashboard from "@/pages/admin/Dashboard";
import FeaturedContent from "@/pages/admin/FeaturedContent";
import AdminLogin from "@/pages/admin/Login";
import ManageBreakingNews from "@/pages/admin/ManageBreakingNews";
import ManageCategories from "@/pages/admin/ManageCategories";
import ManageNewsletter from "@/pages/admin/ManageNewsletter";
import ManageUsers from "@/pages/admin/ManageUsers";
import ManageVideos from "@/pages/admin/ManageVideos";
import AdminSettings from "@/pages/admin/Settings";

// Public layout with Navbar + Footer
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public layout route
const publicLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicLayout,
});

// Admin layout (bare wrapper for login — no sidebar)
const adminBareLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-bare",
  component: () => <Outlet />,
});

// Admin protected layout (sidebar + auth guard)
const adminProtectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-protected",
  component: AdminLayout,
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/",
  component: Home,
});

const videosRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/videos",
  component: Videos,
});

const videoDetailRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/videos/$id",
  component: VideoDetail,
});

const aboutRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/about",
  component: About,
});

const contactRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/contact",
  component: Contact,
});

// Auth pages (bare layout — no navbar/footer/sidebar)
const adminLoginRoute = createRoute({
  getParentRoute: () => adminBareLayout,
  path: "/admin/login",
  component: AdminLogin,
});

const registerRoute = createRoute({
  getParentRoute: () => adminBareLayout,
  path: "/register",
  component: Register,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => adminBareLayout,
  path: "/forgot-password",
  component: ForgotPassword,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => adminBareLayout,
  path: "/reset-password",
  component: ResetPassword,
});

// Admin protected routes
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminProtectedLayout,
  path: "/admin",
  component: Dashboard,
});

const adminVideosRoute = createRoute({
  getParentRoute: () => adminProtectedLayout,
  path: "/admin/videos",
  component: ManageVideos,
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => adminProtectedLayout,
  path: "/admin/categories",
  component: ManageCategories,
});

const adminNewsletterRoute = createRoute({
  getParentRoute: () => adminProtectedLayout,
  path: "/admin/newsletter",
  component: ManageNewsletter,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminProtectedLayout,
  path: "/admin/users",
  component: ManageUsers,
});

const adminFeaturedRoute = createRoute({
  getParentRoute: () => adminProtectedLayout,
  path: "/admin/featured",
  component: FeaturedContent,
});

const adminBreakingNewsRoute = createRoute({
  getParentRoute: () => adminProtectedLayout,
  path: "/admin/breaking-news",
  component: ManageBreakingNews,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminProtectedLayout,
  path: "/admin/settings",
  component: AdminSettings,
});

const routeTree = rootRoute.addChildren([
  publicLayout.addChildren([
    indexRoute,
    videosRoute,
    videoDetailRoute,
    aboutRoute,
    contactRoute,
  ]),
  adminBareLayout.addChildren([
    adminLoginRoute,
    registerRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
  ]),
  adminProtectedLayout.addChildren([
    adminDashboardRoute,
    adminVideosRoute,
    adminCategoriesRoute,
    adminNewsletterRoute,
    adminUsersRoute,
    adminFeaturedRoute,
    adminBreakingNewsRoute,
    adminSettingsRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
