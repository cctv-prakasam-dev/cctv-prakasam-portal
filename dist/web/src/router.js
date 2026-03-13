import { jsx as _jsx, jsxs as _jsxs } from "hono/jsx/jsx-runtime";
import { createRootRoute, createRoute, createRouter, Outlet, } from "@tanstack/react-router";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
// Public layout with Navbar + Footer
function PublicLayout() {
    return (_jsxs("div", { className: "flex min-h-screen flex-col", children: [_jsx(Navbar, {}), _jsx("main", { className: "flex-1", children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }));
}
// Admin layout (no navbar/footer — will get its own sidebar later)
function AdminLayout() {
    return _jsx(Outlet, {});
}
const rootRoute = createRootRoute({
    component: () => _jsx(Outlet, {}),
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
    component: () => _jsx("div", { className: "mx-auto max-w-[var(--max-content)] p-6", children: "Home (Coming Soon)" }),
});
const videosRoute = createRoute({
    getParentRoute: () => publicLayout,
    path: "/videos",
    component: () => _jsx("div", { className: "mx-auto max-w-[var(--max-content)] p-6", children: "Videos (Coming Soon)" }),
});
const videoDetailRoute = createRoute({
    getParentRoute: () => publicLayout,
    path: "/videos/$id",
    component: () => _jsx("div", { className: "mx-auto max-w-[var(--max-content)] p-6", children: "Video Detail (Coming Soon)" }),
});
const aboutRoute = createRoute({
    getParentRoute: () => publicLayout,
    path: "/about",
    component: () => _jsx("div", { className: "mx-auto max-w-[var(--max-content)] p-6", children: "About (Coming Soon)" }),
});
const contactRoute = createRoute({
    getParentRoute: () => publicLayout,
    path: "/contact",
    component: () => _jsx("div", { className: "mx-auto max-w-[var(--max-content)] p-6", children: "Contact (Coming Soon)" }),
});
// Admin routes
const adminLoginRoute = createRoute({
    getParentRoute: () => adminLayout,
    path: "/admin/login",
    component: () => _jsx("div", { children: "Admin Login (Coming Soon)" }),
});
const adminRoute = createRoute({
    getParentRoute: () => adminLayout,
    path: "/admin",
    component: () => _jsx("div", { children: "Admin Dashboard (Coming Soon)" }),
});
const adminVideosRoute = createRoute({
    getParentRoute: () => adminLayout,
    path: "/admin/videos",
    component: () => _jsx("div", { children: "Manage Videos (Coming Soon)" }),
});
const adminCategoriesRoute = createRoute({
    getParentRoute: () => adminLayout,
    path: "/admin/categories",
    component: () => _jsx("div", { children: "Manage Categories (Coming Soon)" }),
});
const adminNewsletterRoute = createRoute({
    getParentRoute: () => adminLayout,
    path: "/admin/newsletter",
    component: () => _jsx("div", { children: "Manage Newsletter (Coming Soon)" }),
});
const adminUsersRoute = createRoute({
    getParentRoute: () => adminLayout,
    path: "/admin/users",
    component: () => _jsx("div", { children: "Manage Users (Coming Soon)" }),
});
const adminFeaturedRoute = createRoute({
    getParentRoute: () => adminLayout,
    path: "/admin/featured",
    component: () => _jsx("div", { children: "Featured Content (Coming Soon)" }),
});
const adminSettingsRoute = createRoute({
    getParentRoute: () => adminLayout,
    path: "/admin/settings",
    component: () => _jsx("div", { children: "Settings (Coming Soon)" }),
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
