import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'prompt',
    strategies: "generateSW",
    srcDir: 'src',
    manifest: {
      name: "Open Wise Timetable Web",
      start_url: "/",
      short_name: "Opent WTT",
      description: "Web app to view and customize wise lectures",
      theme_color: "oklch(0.145 0 0)",
      icons: [
        {
          src: "/icon192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icon512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,svg,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },
    devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        /* when using generateSW the PWA plugin will switch to classic */
        type: 'module',
      },
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
