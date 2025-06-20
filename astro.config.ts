import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import typesafeRoutes from "astro-typesafe-routes";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.te6.in",
  integrations: [mdx(), sitemap(), react(), typesafeRoutes()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    // 301, by default
    "/all": "/posts",
    "/memos": "/posts",
    "/memo/[slug]": "/post/[slug]",
    "/category/[slug]": "/tag/[slug]",
  },
  env: {
    schema: {
      DEV_ONLY_CONTENTS_PATH: envField.string({
        access: "secret",
        context: "server",
        optional: true,
      }),
    },
  },
});
