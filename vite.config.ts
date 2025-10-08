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
    registerType: 'autoUpdate',
    manifest: {
      name: "Open Wise Timetable Web",
      short_name: "Opent WTT",
      description: "Web app to view and customize wise lectures",
      theme_color: "#ffffff",
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
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
