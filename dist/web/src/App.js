import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
});
export default function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(RouterProvider, { router: router }) }));
}
