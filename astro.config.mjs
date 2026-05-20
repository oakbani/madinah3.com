import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// Custom domain (madinah3.com) serves from root, so no `base` is needed.
export default defineConfig({
  site: "https://madinah3.com",
  trailingSlash: "ignore",
  integrations: [tailwind({ applyBaseStyles: true }), sitemap()],
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
