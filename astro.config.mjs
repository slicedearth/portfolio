// @ts-check
import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  site: "https://slicedearth.dev",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 560,
    },
    server: {
      strictPort: true,
    },
    preview: {
      strictPort: true,
    },
  },
})
