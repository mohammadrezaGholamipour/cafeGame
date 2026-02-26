import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
//////////////////////////////////
export default defineConfig({
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://intelligent-pascal.retunnel.net",
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, "/cafe-game-api/v1"),
  //     },
  //   },
  // },
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "CafeGame",
        short_name: "Cafe",
        display: "standalone",
        description: "Console and cafe food management",
        background_color: "#1f5b77",
        theme_color: "#1f5b77",
        icons: [
          {
            src: "/assets/icon.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
