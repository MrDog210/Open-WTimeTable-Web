import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";

// Register service worker (vite-plugin-pwa)
// Uses the virtual module provided by the plugin. This makes Chrome detect the
// service worker and the manifest both in dev and production builds.
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - virtual module injected by vite-plugin-pwa
  const { registerSW } = await import('virtual:pwa-register');
  registerSW({ immediate: true });
  // You may keep a reference to the returned updateSW function if you want
  // to trigger updates later: const updateSW = registerSW(...)
} catch (e) {
  // no-op in environments without the plugin
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);
