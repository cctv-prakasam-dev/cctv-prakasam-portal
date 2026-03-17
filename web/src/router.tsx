import { lazy, Suspense } from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import AdminLayout from "@/components/admin/AdminLayout";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

// Lazy-loaded pages
const Home = lazy(() => import("@/pages/Home"));
const Videos = lazy(() => import("@/pages/Videos"));
const VideoDetail = lazy(() => import("@/pages/VideoDetail"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Register = lazy(() => import("@/pages/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Cookies = lazy(() => import("@/pages/Cookies"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const ManageVideos = lazy(() => import("@/pages/admin/ManageVideos"));
const ManageCategories = lazy(() => import("@/pages/admin/ManageCategories"));
const ManageNewsletter = lazy(() => import("@/pages/admin/ManageNewsletter"));
const ManageUsers = lazy(() => import("@/pages/admin/ManageUsers"));
const FeaturedContent = lazy(() => import("@/pages/admin/FeaturedContent"));
const ManageBreakingNews = lazy(() => import("@/pages/admin/ManageBreakingNews"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" /></div>}>
      {children}
    </Suspense>
  );
}

// Public layout with Navbar + Footer
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LazyPage><Outlet /></LazyPage>
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
  component: () => <LazyPage><Outlet /></LazyPage>,
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

const privacyRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/privacy",
  component: Privacy,
});

const termsRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/terms",
  component: Terms,
});

const cookiesRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/cookies",
  component: Cookies,
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
    privacyRoute,
    termsRoute,
    cookiesRoute,
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

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
