import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

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

// Admin layout (no navbar/footer — will get its own sidebar later)
function AdminLayout() {
  return <Outlet />;
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

// Admin layout route
const adminLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: AdminLayout,
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/",
  component: () => <div className="mx-auto max-w-[var(--max-content)] p-6">Home (Coming Soon)</div>,
});

const videosRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/videos",
  component: () => <div className="mx-auto max-w-[var(--max-content)] p-6">Videos (Coming Soon)</div>,
});

const videoDetailRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/videos/$id",
  component: () => <div className="mx-auto max-w-[var(--max-content)] p-6">Video Detail (Coming Soon)</div>,
});

const aboutRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/about",
  component: () => <div className="mx-auto max-w-[var(--max-content)] p-6">About (Coming Soon)</div>,
});

const contactRoute = createRoute({
  getParentRoute: () => publicLayout,
  path: "/contact",
  component: () => <div className="mx-auto max-w-[var(--max-content)] p-6">Contact (Coming Soon)</div>,
});

// Admin routes
const adminLoginRoute = createRoute({
  getParentRoute: () => adminLayout,
  path: "/admin/login",
  component: () => <div>Admin Login (Coming Soon)</div>,
});

const adminRoute = createRoute({
  getParentRoute: () => adminLayout,
  path: "/admin",
  component: () => <div>Admin Dashboard (Coming Soon)</div>,
});

const adminVideosRoute = createRoute({
  getParentRoute: () => adminLayout,
  path: "/admin/videos",
  component: () => <div>Manage Videos (Coming Soon)</div>,
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => adminLayout,
  path: "/admin/categories",
  component: () => <div>Manage Categories (Coming Soon)</div>,
});

const adminNewsletterRoute = createRoute({
  getParentRoute: () => adminLayout,
  path: "/admin/newsletter",
  component: () => <div>Manage Newsletter (Coming Soon)</div>,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayout,
  path: "/admin/users",
  component: () => <div>Manage Users (Coming Soon)</div>,
});

const adminFeaturedRoute = createRoute({
  getParentRoute: () => adminLayout,
  path: "/admin/featured",
  component: () => <div>Featured Content (Coming Soon)</div>,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayout,
  path: "/admin/settings",
  component: () => <div>Settings (Coming Soon)</div>,
});

const routeTree = rootRoute.addChildren([
  publicLayout.addChildren([
    indexRoute,
    videosRoute,
    videoDetailRoute,
    aboutRoute,
    contactRoute,
  ]),
  adminLayout.addChildren([
    adminLoginRoute,
    adminRoute,
    adminVideosRoute,
    adminCategoriesRoute,
    adminNewsletterRoute,
    adminUsersRoute,
    adminFeaturedRoute,
    adminSettingsRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
