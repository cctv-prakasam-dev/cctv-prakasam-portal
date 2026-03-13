import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
