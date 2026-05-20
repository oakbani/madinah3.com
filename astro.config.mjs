import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import tailwind from "@astrojs/tailwind";

// Custom domain (madinah3.com) serves from root, so no `base` is needed.
export default defineConfig({
  site: "https://madinah3.com",
  trailingSlash: "ignore",
  integrations: [tailwind({ applyBaseStyles: true })],
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
