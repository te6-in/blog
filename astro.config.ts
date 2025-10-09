import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import typesafeRoutes from "astro-typesafe-routes";
import type { RouteId } from "astro-typesafe-routes/path";
import { defineConfig, envField } from "astro/config";
import { METADATA } from "./src/lib/metadata";

// https://astro.build/config
export default defineConfig({
  site: METADATA.site,
  // this already is the default behavior when <ClientRouter /> is used
  // however, astro requires us to specify this explicitly when we use astro:prefetch
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
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
  } satisfies Record<string, RouteId>,
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
